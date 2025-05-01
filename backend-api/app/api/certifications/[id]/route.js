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
    try {
        const body = await request.json();
        const { guide_id, module_id, issued_date, expiry_date } = body;
        const connection = await getConnection();
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
    } catch (error) {
        console.error(`Error updating certification with ID ${id}:`, error);
        return NextResponse.json(
            { error: `Failed to update certification with ID ${id}` },
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
