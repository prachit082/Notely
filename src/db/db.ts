import Dexie, { Table } from 'dexie';

export interface Note {
  id?: number;
  title: string;
  content: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

class NotesDatabase extends Dexie {
  notes!: Table<Note, number>;

  constructor() {
    super('notesDB');
    this.version(1).stores({
      notes: '++id, title, createdAt, updatedAt, deletedAt',
    });
  }
}

export const db = new NotesDatabase();
