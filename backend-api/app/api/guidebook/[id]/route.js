// app/api/guidebook/[id]/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET(request, { params }) {
    const { id } = params;
    let connection;
    try {
        connection = await getConnection();
        const [rows] = await connection.execute(
            "SELECT * FROM Guidebook WHERE guidebook_id = ?",
            [id]
        );
        if (rows.length === 0) {
            return NextResponse.json(
                { error: "Guidebook entry not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error(`Error fetching guidebook entry with ID ${id}:`, error);
        return NextResponse.json(
            { error: `Failed to fetch guidebook entry with ID ${id}` },
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
        const { park_id, title, content, multimedia_links } = body;
        const connection = await getConnection();
        const [result] = await connection.execute(
            "UPDATE Guidebook SET park_id = ?, title = ?, content = ?, multimedia_links = ? WHERE guidebook_id = ?",
            [park_id, title, content, multimedia_links, id]
        );
        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: "Guidebook entry not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({
            message: `Guidebook entry with ID ${id} updated successfully`,
        });
    } catch (error) {
        console.error(`Error updating guidebook entry with ID ${id}:`, error);
        return NextResponse.json(
            { error: `Failed to update guidebook entry with ID ${id}` },
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
            "DELETE FROM Guidebook WHERE guidebook_id = ?",
            [id]
        );
        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: "Guidebook entry not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({
            message: `Guidebook entry with ID ${id} deleted successfully`,
        });
    } catch (error) {
        console.error(`Error deleting guidebook entry with ID ${id}:`, error);
        return NextResponse.json(
            { error: `Failed to delete guidebook entry with ID ${id}` },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}
