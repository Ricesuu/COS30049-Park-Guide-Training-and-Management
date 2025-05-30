// app/api/contact/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

/**
 * GET handler for contact messages
 * Retrieves all contact form submissions from the database
 */
export async function GET() {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute("SELECT * FROM contact_messages");
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact messages" },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}

/**
 * POST handler for contact form submissions
 * Saves a new contact message to the database
 */
export async function POST(request) {
  let connection;
  try {
    const body = await request.json();
    const { firstName, lastName, address, telephone, email, message } = body;

    console.log("Received contact form submission:", body);

    // Validate required fields
    const requiredFields = {
      firstName,
      lastName,
      email,
      message,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([field]) => field);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: "Missing required fields", fields: missingFields },
        { status: 400 }
      );
    }

    // Connect to database
    connection = await getConnection();

    // Create the contact_messages table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        address TEXT,
        telephone VARCHAR(20),
        email VARCHAR(100) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert the new contact message
    const [result] = await connection.execute(
      `INSERT INTO contact_messages (
        first_name,
        last_name,
        address,
        telephone,
        email,
        message
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [firstName, lastName, address || null, telephone || null, email, message]
    );

    return NextResponse.json(
      {
        id: result.insertId,
        message: "Contact message submitted successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting contact message:", error);
    return NextResponse.json(
      { error: "Failed to submit contact message" },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
