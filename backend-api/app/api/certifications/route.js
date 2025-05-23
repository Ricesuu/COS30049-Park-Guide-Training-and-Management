// app/api/certifications/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { sendEmail } from "@/lib/emailService";

export async function GET() {
    let connection;
    try {
        connection = await getConnection();
        const [rows] = await connection.execute("SELECT * FROM Certifications");
        return NextResponse.json(rows);
    } catch (error) {
        console.error("Error fetching certifications:", error);
        return NextResponse.json(
            { error: "Failed to fetch certifications" },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}

export async function POST(request) {
    let connection;
    try {
        const body = await request.json();
        const {
            guide_id,
            module_id,
            issued_date,
            expiry_date,
            update_guide_status = false,
        } = body;

        if (!guide_id || !module_id || !issued_date || !expiry_date) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        console.log(
            `Creating certification for guide ${guide_id}, module ${module_id}`
        );
        connection = await getConnection();

        // Get user and certification information for the email
        const [userRows] = await connection.execute(
            "SELECT email, first_name FROM users WHERE id = ?",
            [guide_id]
        );

        const [moduleRows] = await connection.execute(
            "SELECT module_name FROM training_modules WHERE id = ?",
            [module_id]
        );
        const user = userRows[0];
        const trainingModule = moduleRows[0];

        // Use transaction if we need to update guide status as well
        if (update_guide_status) {
            await connection.beginTransaction();
        }

        try {
            // Step 1: Insert the certification record
            const [result] = await connection.execute(
                "INSERT INTO Certifications (guide_id, module_id, issued_date, expiry_date) VALUES (?, ?, ?, ?)",
                [guide_id, module_id, issued_date, expiry_date]
            );

            // Step 2: If requested, check if all required modules are completed and update guide status
            if (update_guide_status) {
                console.log(
                    `Checking if guide ${guide_id} has completed all required modules`
                );

                // First verify this guide has completed all required modules
                const [moduleResults] = await connection.execute(
                    `
                    SELECT 
                        COUNT(TM.module_id) as total_modules,
                        COUNT(GTP.module_id) as completed_modules
                    FROM 
                        TrainingModules TM
                    LEFT JOIN 
                        GuideTrainingProgress GTP ON TM.module_id = GTP.module_id 
                        AND GTP.guide_id = ? AND GTP.status = 'completed'
                    WHERE 
                        TM.is_required = true
                `,
                    [guide_id]
                );

                const { total_modules, completed_modules } = moduleResults[0];

                // Only update status if all required modules are completed
                if (total_modules === completed_modules && total_modules > 0) {
                    console.log(
                        `Guide ${guide_id} has completed all required modules, updating certification status`
                    );

                    // Update the guide's certification status to certified
                    const [updateResult] = await connection.execute(
                        "UPDATE ParkGuides SET certification_status = 'certified', license_expiry_date = ? WHERE guide_id = ?",
                        [expiry_date, guide_id]
                    );

                    if (update_guide_status) {
                        await connection.commit();
                    }

                    // Send certification email
                    if (user && trainingModule) {
                        await sendEmail({
                            to: user.email,
                            template: "certificationApproved",
                            data: {
                                firstName: user.first_name,
                                certificationName: trainingModule.module_name,
                                expiryDate: new Date(
                                    expiry_date
                                ).toLocaleDateString(),
                            },
                        });

                        // Schedule expiration reminder for 30 days before expiry
                        const expiryDate = new Date(expiry_date);
                        const reminderDate = new Date(expiryDate);
                        reminderDate.setDate(reminderDate.getDate() - 30);

                        if (reminderDate > new Date()) {
                            setTimeout(async () => {
                                await sendEmail({
                                    to: user.email,
                                    template: "certificationExpiring",
                                    data: {
                                        firstName: user.first_name,
                                        certificationName:
                                            trainingModule.module_name,
                                        expiryDate:
                                            expiryDate.toLocaleDateString(),
                                    },
                                });
                            }, reminderDate.getTime() - Date.now());
                        }
                    }

                    return NextResponse.json(
                        {
                            id: result.insertId,
                            message:
                                "Certification created successfully and guide status updated to certified",
                            certificationCreated: result.affectedRows > 0,
                            guideUpdated: updateResult.affectedRows > 0,
                        },
                        { status: 201 }
                    );
                }
            }

            // If we didn't update the guide status or transaction not used
            if (update_guide_status) {
                await connection.commit();
            }

            // Send certification email
            if (user && trainingModule) {
                await sendEmail({
                    to: user.email,
                    template: "certificationApproved",
                    data: {
                        firstName: user.first_name,
                        certificationName: trainingModule.module_name,
                        expiryDate: new Date(expiry_date).toLocaleDateString(),
                    },
                });

                // Schedule expiration reminder for 30 days before expiry
                const expiryDate = new Date(expiry_date);
                const reminderDate = new Date(expiryDate);
                reminderDate.setDate(reminderDate.getDate() - 30);

                if (reminderDate > new Date()) {
                    setTimeout(async () => {
                        await sendEmail({
                            to: user.email,
                            template: "certificationExpiring",
                            data: {
                                firstName: user.first_name,
                                certificationName: trainingModule.module_name,
                                expiryDate: expiryDate.toLocaleDateString(),
                            },
                        });
                    }, reminderDate.getTime() - Date.now());
                }
            }

            return NextResponse.json(
                {
                    id: result.insertId,
                    message: "Certification created successfully",
                },
                { status: 201 }
            );
        } catch (error) {
            // Rollback if transaction was started
            if (update_guide_status) {
                await connection.rollback();
            }
            throw error;
        }
    } catch (error) {
        console.error("Error in certification process:", error);
        return NextResponse.json(
            { error: "Failed to create certification", details: error.message },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}
