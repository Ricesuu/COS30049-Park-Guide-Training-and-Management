// app/api/users/[id]/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET(request, { params }) {
    const { id } = params;
    let connection;
    try {
        connection = await getConnection();
        const [rows] = await connection.execute(
            "SELECT * FROM Users WHERE user_id = ?",
            [id]
        );
        if (rows.length === 0) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error(`Error fetching user with ID ${id}:`, error);
        return NextResponse.json(
            { error: `Failed to fetch user with ID ${id}` },
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
            first_name,
            last_name,
            email,
            password_hash,
            role,
            phone_number,
        } = body;
        const connection = await getConnection();
        const [result] = await connection.execute(
            "UPDATE Users SET first_name = ?, last_name = ?, email = ?, password_hash = ?, role = ?, phone_number = ? WHERE user_id = ?",
            [
                first_name,
                last_name,
                email,
                password_hash,
                role,
                phone_number,
                id,
            ]
        );
        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({
            message: `User with ID ${id} updated successfully`,
        });
    } catch (error) {
        console.error(`Error updating user with ID ${id}:`, error);
        return NextResponse.json(
            { error: `Failed to update user with ID ${id}` },
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
            "DELETE FROM Users WHERE user_id = ?",
            [id]
        );
        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({
            message: `User with ID ${id} deleted successfully`,
        });
    } catch (error) {
        console.error(`Error deleting user with ID ${id}:`, error);
        return NextResponse.json(
            { error: `Failed to delete user with ID ${id}` },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}
