import dbConnect, { pool } from "../../../../utils/dbConnect";
import { redirect } from "next/navigation";

export default async function Edit({ params }) {
    await dbConnect();
    
    // Await the params object
    const { id } = await params;

    const data = await pool.query("SELECT * FROM notes WHERE id = $1", [id]);
    const result = data.rows[0];

    async function updatedNote(formData) {
        "use server";
        const note = formData.get("note");
        const date = formData.get("date");

        try {
            await pool.query(
                `UPDATE notes SET note = $1, date = $2 WHERE id = $3`,
                [note, date, id]
            );
            console.log("Note updated");
        } catch (err) {
            console.error("Error in update", err);
        }
        redirect('/');
    }

    return (
        <main className='max-w-4xl mx-auto mt-4'>
            <div className="text-center my-5 flex flex-col gap-4">
                <h1 className="text-2xl font-bold">To-Do App</h1>
                <h1 className="text-center m-5">Make Changes</h1>
                <form action={updatedNote} className="space-y-5">
                    <div className="flex items-center space-x-3">
                        <input
                            type="text"
                            name="note"
                            id="note"
                            placeholder="Add task"
                            defaultValue={result.note}
                            className="shadow-lg rounded-md shadow-black h-10 p-3 flex-1"
                        />
                        <input
                            type="date"
                            name="date"
                            id="date"
                            defaultValue={result.date}
                            className="shadow-lg rounded-md shadow-black h-10 p-3"
                        />
                        <button type="submit" className="bg-purple-800 text-white rounded-md p-2">
                            Update Task
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}