import { Note } from '../db/db';
import NoteCard from './NoteCard';

interface NotesListProps {
    notes: Note[];
    viewMode: 'list' | 'tiles';
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    className?: string;
  }
  
  export default function NotesList({ notes, viewMode, onEdit, onDelete }: NotesListProps) {
    return (
      <div className={`grid gap-4 ${
        viewMode === 'list' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'flex flex-col'
      }`}>
        {notes.length === 0 ? (
          <div className="text-center text-lg text-gray-500 dark:text-gray-300">No notes found!</div>
        ) : (
          notes.map((note) => (
            <NoteCard key={note.id} viewMode={viewMode} note={note} onEdit={onEdit} onDelete={onDelete} />
          ))
        )}
      </div>
    );
  }
