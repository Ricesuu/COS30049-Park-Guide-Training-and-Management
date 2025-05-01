// app/api/multi-license-exemptions/[id]/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET(request, { params }) {
    const { id } = params;
    let connection;
    try {
        connection = await getConnection();
        const [rows] = await connection.execute(
            "SELECT * FROM MultiLicenseTrainingExemptions WHERE exemption_id = ?",
            [id]
        );
        if (rows.length === 0) {
            return NextResponse.json(
                { error: "Multi-license training exemption not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error(
            `Error fetching multi-license training exemption with ID ${id}:`,
            error
        );
        return NextResponse.json(
            {
                error: `Failed to fetch multi-license training exemption with ID ${id}`,
            },
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
        const { guide_id, training_id, exempted_training_id } = body;
        const connection = await getConnection();
        const [result] = await connection.execute(
            "UPDATE MultiLicenseTrainingExemptions SET guide_id = ?, training_id = ?, exempted_training_id = ? WHERE exemption_id = ?",
            [guide_id, training_id, exempted_training_id, id]
        );
        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: "Multi-license training exemption not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({
            message: `Multi-license training exemption with ID ${id} updated successfully`,
        });
    } catch (error) {
        console.error(
            `Error updating multi-license training exemption with ID ${id}:`,
            error
        );
        return NextResponse.json(
            {
                error: `Failed to update multi-license training exemption with ID ${id}`,
            },
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
            "DELETE FROM MultiLicenseTrainingExemptions WHERE exemption_id = ?",
            [id]
        );
        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: "Multi-license training exemption not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({
            message: `Multi-license training exemption with ID ${id} deleted successfully`,
        });
    } catch (error) {
        console.error(
            `Error deleting multi-license training exemption with ID ${id}:`,
            error
        );
        return NextResponse.json(
            {
                error: `Failed to delete multi-license training exemption with ID ${id}`,
            },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}
