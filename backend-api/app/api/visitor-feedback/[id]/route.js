// app/api/visitor-feedback/[id]/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET(request, { params }) {
    const { id } = params;
    let connection;
    try {
        connection = await getConnection();
        const [rows] = await connection.execute(
            "SELECT * FROM VisitorFeedback WHERE feedback_id = ?",
            [id]
        );
        if (rows.length === 0) {
            return NextResponse.json(
                { error: "Visitor feedback not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error(`Error fetching visitor feedback with ID ${id}:`, error);
        return NextResponse.json(
            { error: `Failed to fetch visitor feedback with ID ${id}` },
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
        const { visitor_id, guide_id, rating, comment } = body;
        const connection = await getConnection();
        const [result] = await connection.execute(
            "UPDATE VisitorFeedback SET visitor_id = ?, guide_id = ?, rating = ?, comment = ? WHERE feedback_id = ?",
            [visitor_id, guide_id, rating, comment, id]
        );
        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: "Visitor feedback not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({
            message: `Visitor feedback with ID ${id} updated successfully`,
        });
    } catch (error) {
        console.error(`Error updating visitor feedback with ID ${id}:`, error);
        return NextResponse.json(
            { error: `Failed to update visitor feedback with ID ${id}` },
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
            "DELETE FROM VisitorFeedback WHERE feedback_id = ?",
            [id]
        );
        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: "Visitor feedback not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({
            message: `Visitor feedback with ID ${id} deleted successfully`,
        });
    } catch (error) {
        console.error(`Error deleting visitor feedback with ID ${id}:`, error);
        return NextResponse.json(
            { error: `Failed to delete visitor feedback with ID ${id}` },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}
