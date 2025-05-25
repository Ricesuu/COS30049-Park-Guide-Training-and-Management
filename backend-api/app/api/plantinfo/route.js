import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import admin from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic';
export const maxDuration = 10;

// Middleware to verify Firebase token
async function verifyAuthToken(request) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            throw new Error('No token provided');
        }
        
        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(token);
        return decodedToken;
    } catch (error) {
        console.error('Auth error:', error);
        throw new Error('Invalid token');
    }
}

function getCorsHeaders() {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Content-Type': 'application/json'
    };
}

export async function OPTIONS() {
    console.log('🔄 OPTIONS /api/plantinfo - Handling preflight request');
    return new NextResponse(null, {
        status: 200,
        headers: getCorsHeaders()
    });
}

export async function GET(request) {
    console.log('🌿 GET /api/plantinfo - Starting request');
    const headers = getCorsHeaders();
    let connection;
    
    try {
        // Verify authentication first
        const decodedToken = await verifyAuthToken(request);
        console.log('✅ User authenticated:', decodedToken.uid);

        console.log('📡 Attempting database connection...');
        connection = await getConnection();
        console.log('✅ Database connection established');

        console.log('🔍 Executing database query...');
        const [rows] = await connection.execute(
            'SELECT * FROM plantinfo ORDER BY plant_id ASC'
        );
        
        console.log('Query result:', rows);
        
        if (!rows || rows.length === 0) {
            console.log('⚠️ No plant data found in the database');
            return new NextResponse(
                JSON.stringify({ 
                    success: false, 
                    error: "No plant information found in the database"
                }),
                { status: 404, headers }
            );
        }
        
        console.log(`✨ Retrieved ${rows.length} plants from database`);
        
        const response = new NextResponse(
            JSON.stringify({ success: true, data: rows }),
            { status: 200, headers }
        );
        
        console.log('📤 Sending response');
        return response;
    } catch (error) {
        console.error('❌ Error in GET /api/plantinfo:', error);
        
        // Handle authentication errors specifically
        if (error.message === 'No token provided' || error.message === 'Invalid token') {
            return new NextResponse(
                JSON.stringify({ 
                    success: false, 
                    error: "Authentication failed",
                    details: error.message 
                }),
                { status: 401, headers }
            );
        }

        console.error('Error details:', {
            name: error.name,
            message: error.message,
            code: error.code,
            sqlState: error.sqlState,
            sqlMessage: error.sqlMessage
        });
        
        return new NextResponse(
            JSON.stringify({ 
                success: false, 
                error: "Failed to fetch plant information",
                details: error.message 
            }),
            { status: 500, headers }
        );
    } finally {
        if (connection) {
            try {
                console.log('🔄 Releasing database connection');
                await connection.release();
                console.log('👋 Database connection released');
            } catch (e) {
                console.error('⚠️ Error releasing connection:', e);
            }
        }
    }
}
