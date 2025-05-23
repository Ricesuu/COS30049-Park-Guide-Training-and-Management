import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

// Get all plants
export async function getAllPlants() {
    const connection = await getConnection();
    try {
        const [rows] = await connection.execute(`
            SELECT * FROM plantinfo 
            ORDER BY plant_id ASC, created_at ASC`);
        return NextResponse.json({ success: true, data: rows });
    } catch (error) {
        console.error("Error fetching plants:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch plant information" },
            { status: 500 }
        );
    } finally {
        connection.release();
    }
}

// Get a single plant by ID
export async function getPlantById(id) {
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
        connection.release();
    }
}

// Create a new plant
export async function createPlant(req) {
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
            const [result] = await connection.execute(`
                INSERT INTO plantinfo 
                (common_name, scientific_name, family, description, image_url) 
                VALUES (?, ?, ?, ?, ?)`,
                [common_name, scientific_name, family, description || "", image_url || ""]
            );

            const newPlant = {
                plant_id: result.insertId,
                common_name,
                scientific_name,
                family,
                description: description || "",
                image_url: image_url || "",
                created_at: new Date()
            };

            return NextResponse.json({ 
                success: true, 
                message: "Plant created successfully", 
                data: newPlant 
            });
        } catch (error) {
            console.error("Database error creating plant:", error);
            return NextResponse.json(
                { success: false, error: "Failed to create plant: Database error" },
                { status: 500 }
            );
        } finally {
            connection.release();
        }
    } catch (parseError) {
        console.error("Error parsing request body:", parseError);
        return NextResponse.json(
            { success: false, error: "Invalid request format" },
            { status: 400 }
        );
    }
}

// Update plant information
export async function updatePlant(req, id) {
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
        // Check if plant exists
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

        // Update the plant
        await connection.execute(
            `UPDATE plantinfo 
             SET common_name = ?, scientific_name = ?, family = ?, description = ?, image_url = ? 
             WHERE plant_id = ?`,
            [common_name, scientific_name, family, description || "", image_url || "", id]
        );

        const updatedPlant = {
            plant_id: parseInt(id),
            common_name,
            scientific_name,
            family,
            description: description || "",
            image_url: image_url || "",
            updated_at: new Date()
        };

        return NextResponse.json({
            success: true,
            message: "Plant updated successfully",
            data: updatedPlant
        });
    } catch (error) {
        console.error(`Error updating plant with id ${id}:`, error);
        return NextResponse.json(
            { success: false, error: "Failed to update plant information" },
            { status: 500 }
        );
    } finally {
        connection.release();
    }
}

// Delete a plant
export async function deletePlant(id) {
    const connection = await getConnection();
    try {
        // Check if plant exists
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

        // Delete the plant
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
        connection.release();
    }
}
