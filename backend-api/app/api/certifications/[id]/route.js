// app/api/certifications/[id]/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET(request, { params }) {
    const { id } = params;
    let connection;
    try {
        connection = await getConnection();
        const [rows] = await connection.execute(
            "SELECT * FROM Certifications WHERE cert_id = ?",
            [id]
        );
        if (rows.length === 0) {
            return NextResponse.json(
                { error: "Certification not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error(`Error fetching certification with ID ${id}:`, error);
        return NextResponse.json(
            { error: `Failed to fetch certification with ID ${id}` },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}

export async function PUT(request, { params }) {
    const { id } = params;
    let connection;
    try {
        const body = await request.json();
        connection = await getConnection();

        if (body.certification_status && body.update_guide_status) {
            // This is a certification approval request
            // Set expiry date to one year from now
            const oneYearFromNow = new Date();
            oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
            const licenseExpiryDate = oneYearFromNow
                .toISOString()
                .split("T")[0]; // YYYY-MM-DD format

            // Get the requested park id before updating
            const [requestedParkResult] = await connection.execute(
                "SELECT requested_park_id FROM ParkGuides WHERE guide_id = ?",
                [id]
            );

            if (requestedParkResult.length === 0) {
                return NextResponse.json(
                    { error: "Park guide not found" },
                    { status: 404 }
                );
            }

            const requestedParkId = requestedParkResult[0].requested_park_id;

            // Update the park guide's certification status, assign them to their requested park,
            // clear the requested_park_id, and set the license expiry date
            const [result] = await connection.execute(
                `UPDATE ParkGuides 
                SET certification_status = ?,
                    assigned_park = ?,
                    requested_park_id = NULL,
                    license_expiry_date = ?
                WHERE guide_id = ?`,
                [
                    body.certification_status,
                    requestedParkId,
                    licenseExpiryDate,
                    id,
                ]
            );

            if (result.affectedRows === 0) {
                return NextResponse.json(
                    { error: "Park guide not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                message: `Guide certification status updated successfully`,
            });
        } else {
            // This is a regular certification update
            const { guide_id, module_id, issued_date, expiry_date } = body;
            const [result] = await connection.execute(
                "UPDATE Certifications SET guide_id = ?, module_id = ?, issued_date = ?, expiry_date = ? WHERE cert_id = ?",
                [guide_id, module_id, issued_date, expiry_date, id]
            );

            if (result.affectedRows === 0) {
                return NextResponse.json(
                    { error: "Certification not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                message: `Certification with ID ${id} updated successfully`,
            });
        }
    } catch (error) {
        console.error(
            `Error updating certification/guide status with ID ${id}:`,
            error
        );
        return NextResponse.json(
            {
                error: `Failed to update certification/guide status with ID ${id}`,
            },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}

export async function DELETE(request, { params }) {
    const { id } = params;
    let connection;
    try {
        connection = await getConnection();
        const [result] = await connection.execute(
            "DELETE FROM Certifications WHERE cert_id = ?",
            [id]
        );
        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: "Certification not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({
            message: `Certification with ID ${id} deleted successfully`,
        });
    } catch (error) {
        console.error(`Error deleting certification with ID ${id}:`, error);
        return NextResponse.json(
            { error: `Failed to delete certification with ID ${id}` },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}
