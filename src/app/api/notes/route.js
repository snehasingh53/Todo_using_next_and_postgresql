import dbConnect, { pool } from "../../../../utils/dbConnect";
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await dbConnect();
        const result = await pool.query("SELECT * FROM notes");
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("Error fetching notes:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// Add POST handler if needed
export async function POST(request) {
    try {
        const data = await request.json();
        await dbConnect();
        const result = await pool.query(
            'INSERT INTO notes(note, date) VALUES ($1, $2) RETURNING *',
            [data.note, data.date]
        );
        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error("Error creating note:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// Add DELETE handler if needed
export async function DELETE(request) {
    try {
        const { id } = await request.json();
        await dbConnect();
        await pool.query('DELETE FROM notes WHERE id = $1', [id]);
        return NextResponse.json({ message: "Note deleted successfully" });
    } catch (error) {
        console.error("Error deleting note:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}