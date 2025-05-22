// app/api/training-modules/[id]/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET(request, { params }) {
    const { id } = params;
    let connection;
    try {
        connection = await getConnection();
        const [rows] = await connection.execute(
            "SELECT * FROM TrainingModules WHERE module_id = ?",
            [id]
        );
        if (rows.length === 0) {
            return NextResponse.json(
                { error: "Training module not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error(`Error fetching training module with ID ${id}:`, error);
        return NextResponse.json(
            { error: `Failed to fetch training module with ID ${id}` },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}

export async function PUT(request, { params }) {
    const { id } = params;
    try {
        const body = await request.json();
        const { module_name, description, duration, price } = body;
        const connection = await getConnection();
        const [result] = await connection.execute(
            "UPDATE TrainingModules SET module_name = ?, description = ?, duration = ?, price = ? WHERE module_id = ?",
            [module_name, description, duration, price || 0.0, id]
        );
        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: "Training module not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({
            message: `Training module with ID ${id} updated successfully`,
        });
    } catch (error) {
        console.error(`Error updating training module with ID ${id}:`, error);
        return NextResponse.json(
            { error: `Failed to update training module with ID ${id}` },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    const { id } = params;
    let connection;
    try {
        connection = await getConnection();
        const [result] = await connection.execute(
            "DELETE FROM TrainingModules WHERE module_id = ?",
            [id]
        );
        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: "Training module not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({
            message: `Training module with ID ${id} deleted successfully`,
        });
    } catch (error) {
        console.error(`Error deleting training module with ID ${id}:`, error);
        return NextResponse.json(
            { error: `Failed to delete training module with ID ${id}` },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}
