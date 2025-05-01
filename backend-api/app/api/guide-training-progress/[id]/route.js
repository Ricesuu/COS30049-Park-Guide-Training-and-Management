// app/api/guide-training-progress/[id]/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET(request, { params }) {
    const { id } = params;
    let connection;
    try {
        connection = await getConnection();
        const [rows] = await connection.execute(
            "SELECT * FROM GuideTrainingProgress WHERE progress_id = ?",
            [id]
        );
        if (rows.length === 0) {
            return NextResponse.json(
                { error: "Guide training progress not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error(
            `Error fetching guide training progress with ID ${id}:`,
            error
        );
        return NextResponse.json(
            { error: `Failed to fetch guide training progress with ID ${id}` },
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
        const { guide_id, module_id, status, completion_date } = body;
        const connection = await getConnection();
        const [result] = await connection.execute(
            "UPDATE GuideTrainingProgress SET guide_id = ?, module_id = ?, status = ?, completion_date = ? WHERE progress_id = ?",
            [guide_id, module_id, status, completion_date, id]
        );
        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: "Guide training progress not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({
            message: `Guide training progress with ID ${id} updated successfully`,
        });
    } catch (error) {
        console.error(
            `Error updating guide training progress with ID ${id}:`,
            error
        );
        return NextResponse.json(
            { error: `Failed to update guide training progress with ID ${id}` },
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
            "DELETE FROM GuideTrainingProgress WHERE progress_id = ?",
            [id]
        );
        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: "Guide training progress not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({
            message: `Guide training progress with ID ${id} deleted successfully`,
        });
    } catch (error) {
        console.error(
            `Error deleting guide training progress with ID ${id}:`,
            error
        );
        return NextResponse.json(
            { error: `Failed to delete guide training progress with ID ${id}` },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}
