// app/api/parks/[id]/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET(request, { params }) {
    const { id } = params;
    let connection;
    try {
        connection = await getConnection();
        const [rows] = await connection.execute(
            "SELECT * FROM Parks WHERE park_id = ?",
            [id]
        );
        if (rows.length === 0) {
            return NextResponse.json(
                { error: "Park not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error(`Error fetching park with ID ${id}:`, error);
        return NextResponse.json(
            { error: `Failed to fetch park with ID ${id}` },
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
        const { park_name, location, description, wildlife } = body;
        const connection = await getConnection();
        const [result] = await connection.execute(
            "UPDATE Parks SET park_name = ?, location = ?, description = ?, wildlife = ? WHERE park_id = ?",
            [park_name, location, description, wildlife, id]
        );
        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: "Park not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({
            message: `Park with ID ${id} updated successfully`,
        });
    } catch (error) {
        console.error(`Error updating park with ID ${id}:`, error);
        return NextResponse.json(
            { error: `Failed to update park with ID ${id}` },
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
            "DELETE FROM Parks WHERE park_id = ?",
            [id]
        );
        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: "Park not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({
            message: `Park with ID ${id} deleted successfully`,
        });
    } catch (error) {
        console.error(`Error deleting park with ID ${id}:`, error);
        return NextResponse.json(
            { error: `Failed to delete park with ID ${id}` },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}
