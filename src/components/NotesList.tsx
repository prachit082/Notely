import { useState } from 'react';
import { Note } from '../db/db';
import NoteCard from './NoteCard';
import { Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface NotesListProps {
  notes: Note[];
  viewMode: 'list' | 'tiles';
  onEdit: (id: number) => void;
  onDelete: (idOrIds: number | number[]) => void;
  className?: string;
}

export default function NotesList({ notes, viewMode, onEdit, onDelete }: NotesListProps) {
  const [selectedNotes, setSelectedNotes] = useState<number[]>([]);

  const handleSelectNote = (id: number) => {
    setSelectedNotes((prev) =>
      prev.includes(id) ? prev.filter(noteId => noteId !== id) : [...prev, id]
    );
  };

  const handleDeleteNotes = (idOrIds: number | number[]) => {
    onDelete(idOrIds);
    setSelectedNotes([]); // Clear selected notes after deleting
  };

  return (
    <div className="relative">
      {/* Delete Selected Button */}
      {selectedNotes.length > 0 && (
        <div className="flex items-center justify-start gap-2 mb-2">
          <button
            onClick={() => handleDeleteNotes(selectedNotes)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
            aria-label="Delete Selected Notes"
          >
            <motion.div
              initial={{ rotate: -20, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              whileTap={{ scale: 0.9 }}
            >
              <Trash2 size={20} className="text-black dark:text-white" />
            </motion.div>
          </button>

          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            ({selectedNotes.length})
          </span>
        </div>
      )}

      {/* Notes Grid */}
      <div className={`grid gap-4 ${viewMode === 'tiles' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'flex flex-col'}`}>
        {notes.length === 0 ? (
          <div className="text-center text-lg text-gray-500 dark:text-gray-300">
            No notes found!
          </div>
        ) : (
          notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              viewMode={viewMode}
              onEdit={onEdit}
              onDelete={() => onDelete(note.id!)} // Pass onDelete function
              isSelected={selectedNotes.includes(note.id!)} // Check if note is selected
              onSelect={handleSelectNote} // Handle selection/deselection
            />
          ))
        )}
      </div>
    </div>
  );
}
