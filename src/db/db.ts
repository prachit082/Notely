import Dexie, { Table } from 'dexie';

export interface Note {
  id?: number;
  title: string;
  content: string;
  image?: string; // base64 image
  createdAt: Date;
  updatedAt: Date;
}

class NotesDatabase extends Dexie {
  notes!: Table<Note, number>;

  constructor() {
    super('notesDB');
    this.version(1).stores({
      notes: '++id, title, createdAt, updatedAt',
    });
  }
}

export const db = new NotesDatabase();
