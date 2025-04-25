// app/api/park-guides/[id]/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET(request, { params }) {
    const { id } = params;
    let connection;
    try {
        connection = await getConnection();
        const [rows] = await connection.execute(
            "SELECT * FROM ParkGuides WHERE guide_id = ?",
            [id]
        );
        if (rows.length === 0) {
            return NextResponse.json(
                { error: "Park guide not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error(`Error fetching park guide with ID ${id}:`, error);
        return NextResponse.json(
            { error: `Failed to fetch park guide with ID ${id}` },
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
        const {
            user_id,
            certification_status,
            license_expiry_date,
            assigned_park,
        } = body;
        const connection = await getConnection();
        const [result] = await connection.execute(
            "UPDATE ParkGuides SET user_id = ?, certification_status = ?, license_expiry_date = ?, assigned_park = ? WHERE guide_id = ?",
            [
                user_id,
                certification_status,
                license_expiry_date,
                assigned_park,
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
            message: `Park guide with ID ${id} updated successfully`,
        });
    } catch (error) {
        console.error(`Error updating park guide with ID ${id}:`, error);
        return NextResponse.json(
            { error: `Failed to update park guide with ID ${id}` },
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
            "DELETE FROM ParkGuides WHERE guide_id = ?",
            [id]
        );
        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: "Park guide not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({
            message: `Park guide with ID ${id} deleted successfully`,
        });
    } catch (error) {
        console.error(`Error deleting park guide with ID ${id}:`, error);
        return NextResponse.json(
            { error: `Failed to delete park guide with ID ${id}` },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}
