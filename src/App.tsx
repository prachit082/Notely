import { useEffect, useState } from 'react';
import { getAllNotes, addNote, updateNote, deleteNote } from '../src/db/noteService';
import { Note } from '../src/db/db';
import Landing from './components/Landing';
import NotesList from './components/NotesList';
import ToggleTheme from './components/ui/ToggleTheme';
import { useTheme } from './hooks/useTheme';
import NoteModal from './components/ui/NoteModal';
import { List, LayoutGrid, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import Footer from './components/Footer';

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'tiles'>('tiles');
  const [sortBy, setSortBy] = useState<'title' | 'createdAt'>('createdAt');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deleteNoteId, setDeleteNoteId] = useState<number | null>(null);
  const [deleteNoteIds, setDeleteNoteIds] = useState<number[]>([]);

  useTheme();

  useEffect(() => {
    loadNotes();
  }, [sortBy]);

  const loadNotes = async () => {
    let allNotes = await getAllNotes();

    if (sortBy === 'title') {
      allNotes = allNotes.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      allNotes = allNotes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    setNotes(allNotes);
  };

  const handleAddNote = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  const handleEditNote = (id: number) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const handleSaveNote = async (data: { title: string; content: string; image?: string }) => {
    if (editingNote) {
      await updateNote(editingNote.id!, { ...editingNote, ...data, updatedAt: new Date() });
    } else {
      await addNote({ ...data, createdAt: new Date(), updatedAt: new Date() });
    }
    await loadNotes();
    setIsModalOpen(false);
  };

  const confirmDeleteNote = async () => {
    if (deleteNoteId !== null) {
      await deleteNote(deleteNoteId);
      await loadNotes();
      setDeleteNoteId(null); // Close the modal
    }
  };

  const confirmDeleteNotes = async () => {
    if (deleteNoteIds.length > 0) {
      for (const id of deleteNoteIds) {
        await deleteNote(id);
      }
      await loadNotes();
      setDeleteNoteIds([]); // clear after delete
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="flex flex-col md:flex-row p-4 sm:p-6 lg:p-8">
        {/* Header content */}
        <div className="w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ToggleTheme />
            <button
              onClick={() => setViewMode(viewMode === 'list' ? 'tiles' : 'list')}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
            >
              <motion.div
                key={viewMode}
                initial={{ rotate: -20, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {viewMode === 'list' ? (
                  <LayoutGrid size={20} className="text-black dark:text-white" />
                ) : (
                  <List size={20} className="text-black dark:text-white" />
                )}
              </motion.div>
            </button>
          </div>

          {/* Sort controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'title' | 'createdAt')}
              className="px-3 py-2 rounded-md text-sm font-semibold bg-gray-200 dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="createdAt">Sort by Date</option>
              <option value="title">Sort by Title</option>
            </select>

            {/* Add button */}
            <button
              onClick={handleAddNote}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
            >
              <motion.div
                initial={{ rotate: -20, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                whileTap={{ scale: 0.9 }}
              >
                <Plus size={20} className="text-black dark:text-white" />
              </motion.div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full flex flex-col p-4 sm:p-6 lg:p-8">
        {notes.length === 0 ? (
          <Landing />
        ) : (
          <NotesList
            notes={notes}
            viewMode={viewMode}
            onEdit={handleEditNote}
            onDelete={(idOrIds) => {
              if (Array.isArray(idOrIds)) {
                setDeleteNoteIds(idOrIds); // Set multiple IDs
              } else {
                setDeleteNoteId(idOrIds); // Set single ID
              }
            }
          }
            className="w-full max-w-7xl mx-auto"
          />
        )}
      </main>

      <Footer />

      {/* Modals */}
      {isModalOpen && (
        <NoteModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveNote}
          initialData={editingNote || undefined}
          mode="edit"
          className="sm:max-w-[500px] md:max-w-[600px]"
        />
      )}

      {/* Delete Note Modal */}
      {deleteNoteId !== null && (
        <NoteModal
          open={deleteNoteId !== null}
          onClose={() => setDeleteNoteId(null)}
          onDelete={confirmDeleteNote}
          mode="delete"
          title="Delete Note"
          description="Are you sure you want to delete this note?"
        />
      )}

      {/* Delete Multiple Notes Modal */}
      {deleteNoteIds.length > 0 && (
        <NoteModal
          open={deleteNoteIds.length > 0}
          onClose={() => setDeleteNoteIds([])}
          onDelete={confirmDeleteNotes}
          mode="delete"
          title={`Delete ${deleteNoteIds.length} notes`}
          description={`Are you sure you want to delete ${deleteNoteIds.length} notes? This action cannot be undone.`}
        />
      )}
    </div>
  );
}
