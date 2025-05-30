import { db, Note } from './db';

export const addNote = async (note: Omit<Note, 'id'>) => {
  return await db.notes.add(note);
};

export const getAllNotes = async (): Promise<Note[]> => {
  return await db.notes.toArray();
};

export const updateNote = async (id: number, updatedNote: Partial<Note>) => {
  return await db.notes.update(id, {
    ...updatedNote,
    updatedAt: new Date(),
  });
};

// export const deleteNote = async (id: number) => {
//   return await db.notes.delete(id);
// };

export async function softDeleteNote(id: number) {
  await db.notes.update(id, {
    deletedAt: new Date()
  });
}

export async function deleteOldTrashedNotes() {
  const now = new Date();
  const threshold = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
  await db.notes.where('deletedAt').below(threshold).delete();
}

export async function restoreNote(id: number) {
  await db.notes.update(id, {
    deletedAt: null,
    updatedAt: new Date(),
  });
}



