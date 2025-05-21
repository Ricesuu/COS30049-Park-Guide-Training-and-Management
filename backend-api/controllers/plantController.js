import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

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
