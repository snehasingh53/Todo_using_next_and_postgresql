
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link'; 
import { createNoteAction, deleteNoteAction } from './NoteActions'; 

export default function Home() { 
    const [notes, setNotes] = useState([]); 
    const [recurrence, setRecurrence] = useState({ frequency: 'none', interval: 1, specificDays: [], nthDay: '' }); 
    const [editingNote, setEditingNote] = useState(null); 

    useEffect(() => {
        async function fetchNotes() {
            try {
                const response = await fetch("/api/notes");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setNotes(data);
            } catch (error) {
                console.error('Failed to fetch notes:', error);
                // Optionally set an error state here
            }
        }
        fetchNotes();
    }, []);

    const handleCreateNote = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        formData.append('recurrence', JSON.stringify(recurrence));

        try {
            const newNote = await createNoteAction(formData);
            setNotes((prevNotes) => [...prevNotes, newNote]);
            event.target.reset();
            setRecurrence({ frequency: 'none', interval: 1, specificDays: [], nthDay: '' });
            setEditingNote(null); 
        } catch (error) {
            console.error('Failed to create note:', error);
        }
    };

    const handleDeleteNote = async (event, id) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('id', id);

        try {
            await deleteNoteAction(formData);
            setNotes((prevNotes) => prevNotes.filter(note => note.id !== id));
        } catch (error) {
            console.error('Failed to delete note:', error);
        }
    };

    return (
        <main className='max-w-4xl mx-auto mt-4 bg-purple-100'>
            <div className="text-center my-5 flex flex-col gap-4">
                <h1 className="text-2xl font-bold text-purple-800">To-Do App</h1>
                <h1 className="text-center m-5">Add Task</h1>

                <form onSubmit={handleCreateNote} className="flex flex-col space-y-5">
                    <div className="flex items-center space-x-3">
                        <input
                            type="text"
                            name="note"
                            id="note"
                            placeholder="Add task"
                            className="shadow-lg rounded-md shadow-black h-10 p-3 flex-grow"
                            required
                        />
                        <input
                            type="date"
                            name="date"
                            id="date"
                            className="shadow-lg rounded-md shadow-black h-10 p-3"
                            required
                        />
                        <select
                            id="recurrence"
                            value={recurrence.frequency}
                            onChange={(e) => setRecurrence({ ...recurrence, frequency: e.target.value })}
                            className="shadow-lg rounded-md shadow-black p-2"
                        >
                            <option value="none">No Recurrence</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option> 
                            <option value="yearly">Yearly</option> 
                        </select> 
                        <button type="submit" className="bg-purple-800 text-white rounded-md p-2"> 
                            {editingNote ? 'Update Task' : 'Add Task'} 
                        </button> 
                    </div>

                    
                    {recurrence.frequency !== 'none' && (
                        <div className="flex flex-col">
                            <div className="mt-2">
                                <label htmlFor="interval">Interval :</label>
                                <input
                                    type="number"
                                    id="interval"
                                    min="1"
                                    value={recurrence.interval}
                                    onChange={(e) => setRecurrence({ ...recurrence, interval: Number(e.target.value) })}
                                    className="shadow-lg rounded-md shadow-black h-10 p-3"
                                />
                            </div>

                            {recurrence.frequency === 'weekly' && (
                                <div className="mt-2">
                                    <label htmlFor="specificDays">Specific Days:</label>
                                    <select
                                        id="specificDays"
                                        value={recurrence.specificDays}
                                        onChange={(e) => setRecurrence({ ...recurrence, specificDays: Array.from(e.target.selectedOptions, (option) => option.value) })}
                                        multiple
                                        className="shadow-lg rounded-md shadow-black p-2 w-full"
                                    >
                                        <option value="monday">Monday</option>
                                        <option value="tuesday">Tuesday</option>
                                        <option value="wednesday">Wednesday</option>
                                        <option value="thursday">Thursday</option>
                                        <option value="friday">Friday</option>
                                        <option value="saturday">Saturday</option>
                                        <option value="sunday">Sunday</option>
                                    </select>
                                    <p className="text-sm text-gray-600">Hold Ctrl (Windows) or Command (Mac) to select multiple days.</p>
                                </div>
                            )}

                            {recurrence.frequency === 'monthly' && (
                                <div className="mt-2">
                                    <label htmlFor="nthDay">Nth Day:</label>
                                    <select
                                        id="nthDay"
                                        value={recurrence.nthDay}
                                        onChange={(e) => setRecurrence({ ...recurrence, nthDay: e.target.value })}
                                        className="shadow-lg rounded-md shadow-black p-2"
                                    >
                                        <option value="first">First</option>
                                        <option value="second">Second</option>
                                        <option value="third">Third</option>
                                        <option value="fourth">Fourth</option>
                                        <option value="last">Last</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    )}
                </form>

                
                <table className="w-full text-lg">
                    <thead>
                        <tr>
                            <th>Note</th>
                            <th>Due Date</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notes.map((note) => (
                            <tr key={note.id}>
                                <td>{note.note}</td>
                                <td>{note.date}</td>
                                <td className="text-center">
                                    <Link href={`/edit/${note.id}`}>
                                        <button className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded">
                                            EDIT
                                        </button>
                                    </Link>
                                </td>
                                <td className="text-center">
                                    <form onSubmit={(event) => handleDeleteNote(event, note.id)}>
                                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" type="submit">
                                            DEL
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}