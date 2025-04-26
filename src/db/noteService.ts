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

export const deleteNote = async (id: number) => {
  return await db.notes.delete(id);
};
