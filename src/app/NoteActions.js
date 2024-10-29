"use server";

import { pool } from "../../utils/dbConnect";

export async function createNoteAction(data) {
    const note = data.get("note")?.valueOf();
    const date = data.get("date")?.valueOf();

    try {
        const newNote = await pool.query(
            'INSERT INTO notes(note, date) VALUES ($1, $2) RETURNING *',
            [note, date]
        );
        return newNote.rows[0];
    } catch (err) {
        console.error("Error inserting note:", err);
        throw new Error("Error inserting note");
    }
}

export async function deleteNoteAction(data) {
    const id = data.get("id").valueOf();

    try {
        await pool.query('DELETE FROM notes WHERE id = $1', [id]);
    } catch (err) {
        console.error("Error deleting note:", err);
        throw new Error("Error deleting note");
    }
}