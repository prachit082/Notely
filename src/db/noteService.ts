import { db, Note } from './db';

// Get a note by its ID
export const getAllNotes = async (): Promise<Note[]> => {
  return await db.notes.toArray();
};

// Add a new note to the database
export const addNote = async (note: Omit<Note, 'id'>) => {
  return await db.notes.add(note);
};

// Update an existing note by its ID
export const updateNote = async (id: number, updatedNote: Partial<Note>) => {
  return await db.notes.update(id, {
    ...updatedNote,
    updatedAt: new Date(),
  });
};

// Delete a note by its ID
export const deleteNote = async (id: number) => {
  return await db.notes.delete(id);
};

// Soft delete a note(Move to bin) by setting its deletedAt field
export async function softDeleteNote(id: number) {
  await db.notes.update(id, {
    deletedAt: new Date()
  });
}

// Get all trashed notes and remove after 15 days
export async function deleteOldTrashedNotes() {
  const now = new Date();
  const threshold = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
  await db.notes.where('deletedAt').below(threshold).delete();
}

// Restore a soft-deleted note(Note in bin) by clearing its deletedAt field
export async function restoreNote(id: number) {
  await db.notes.update(id, {
    deletedAt: null,
    updatedAt: new Date(),
  });
}



