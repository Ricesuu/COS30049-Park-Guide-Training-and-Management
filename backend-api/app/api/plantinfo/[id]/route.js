import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

// GET a single plant by ID
export async function GET(req, { params }) {
    const id = params.id;
    const connection = await getConnection();
    try {
        const [rows] = await connection.execute(`
            SELECT * FROM plantinfo 
            WHERE plant_id = ?`, [id]);
        
        if (rows.length === 0) {
            return NextResponse.json(
                { success: false, error: "Plant not found" },
                { status: 404 }
            );
        }
        
        return NextResponse.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error(`Error fetching plant with id ${id}:`, error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch plant information" },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}

// Update plant information
export async function PUT(req, { params }) {
    const id = params.id;
    try {
        const {
            common_name,
            scientific_name,
            family,
            description,
            image_url
        } = await req.json();

        // Validation
        if (!common_name || !scientific_name || !family) {
            return NextResponse.json(
                { success: false, error: "Common name, scientific name, and family are required" },
                { status: 400 }
            );
        }

        const connection = await getConnection();
        try {
            const [existingPlant] = await connection.execute(
                "SELECT * FROM plantinfo WHERE plant_id = ?",
                [id]
            );

            if (existingPlant.length === 0) {
                return NextResponse.json(
                    { success: false, error: "Plant not found" },
                    { status: 404 }
                );
            }

            await connection.execute(
                `UPDATE plantinfo 
                SET common_name = ?, scientific_name = ?, family = ?, description = ?, image_url = ? 
                WHERE plant_id = ?`,
                [common_name, scientific_name, family, description || "", image_url || "", id]
            );

            return NextResponse.json({
                success: true,
                message: "Plant updated successfully",
                data: {
                    plant_id: parseInt(id),
                    common_name,
                    scientific_name,
                    family,
                    description: description || "",
                    image_url: image_url || "",
                    updated_at: new Date()
                }
            });
        } finally {
            if (connection) connection.release();
        }
    } catch (error) {
        console.error(`Error updating plant with id ${id}:`, error);
        return NextResponse.json(
            { success: false, error: "Failed to update plant information" },
            { status: 500 }
        );
    }
}

// Delete plant
export async function DELETE(req, { params }) {
    const id = params.id;
    const connection = await getConnection();
    try {
        const [existingPlant] = await connection.execute(
            "SELECT * FROM plantinfo WHERE plant_id = ?",
            [id]
        );

        if (existingPlant.length === 0) {
            return NextResponse.json(
                { success: false, error: "Plant not found" },
                { status: 404 }
            );
        }

        await connection.execute(
            "DELETE FROM plantinfo WHERE plant_id = ?",
            [id]
        );

        return NextResponse.json({
            success: true,
            message: "Plant deleted successfully"
        });
    } catch (error) {
        console.error(`Error deleting plant with id ${id}:`, error);
        return NextResponse.json(
            { success: false, error: "Failed to delete plant" },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}
