import { NextResponse } from "next/server";
import { assertUser } from "@/lib/assertUser";
import admin from "@/lib/firebaseAdmin";

// Change user password through Firebase Auth
export async function POST(request) {
    try {
        // Authenticate the user
        const { uid } = await assertUser(request, ["admin", "park_guide"]);
        const body = await request.json();

        // Check if required fields exist
        if (!body.currentPassword || !body.newPassword) {
            return NextResponse.json(
                { error: "Current password and new password are required" },
                { status: 400 }
            );
        }

        // Verify current password
        try {
            const userRecord = await admin.auth().getUser(uid);
            const email = userRecord.email;
            
            // Use Firebase Admin SDK to verify the current password
            await admin.auth().getUserByEmail(email);
            
            // Firebase requires passwords to be at least 6 characters
            if (body.newPassword.length < 6) {
                return NextResponse.json(
                    { error: "New password must be at least 6 characters long" },
                    { status: 400 }
                );
            }

            // Update password in Firebase Authentication
            await admin.auth().updateUser(uid, {
                password: body.newPassword,
            });

            return NextResponse.json({
                message: "Password changed successfully",
            });
        } catch (error) {
            console.error("Error verifying current password:", error);
            return NextResponse.json(
                { error: "Current password is incorrect" },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error("Error changing password:", error);

        // Handle specific Firebase Auth error codes
        if (error.code === "auth/requires-recent-login") {
            return NextResponse.json(
                { error: "Please sign in again before changing your password" },
                { status: 403 }
            );
        }

        return NextResponse.json(
            { error: error.message || "Failed to change password" },
            { status: error.status || 500 }
        );
    }
}

// Options for handling CORS preflight requests
export async function OPTIONS() {
    return NextResponse.json(
        {},
        {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
        }
    );
}
