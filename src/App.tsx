import { useEffect, useState } from "react";
import {
  getAllNotes,
  addNote,
  updateNote,
  deleteOldTrashedNotes,
  softDeleteNote,
  deleteNote,
} from "../src/db/noteService";
import { Note } from "../src/db/db";
import Landing from "./components/Landing";
import NotesList from "./components/NotesList";
import ToggleTheme from "./components/ui/ToggleTheme";
import { useTheme } from "./hooks/useTheme";
import NoteModal from "./components/ui/NoteModal";
import { List, LayoutGrid, Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Footer from "./components/Footer";
import jsPDF from "jspdf";
import toast from "react-hot-toast";

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "tiles">("tiles");
  const [sortBy, setSortBy] = useState<"title" | "createdAt">("createdAt");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deleteNoteId, setDeleteNoteId] = useState<number | null>(null);
  const [deleteNoteIds, setDeleteNoteIds] = useState<number[]>([]);
  const [, setAllNotes] = useState<Note[]>([]);
  const [trashMode, setTrashMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  useTheme();

  useEffect(() => {
    loadNotes();
  }, [sortBy, trashMode]);

  const loadNotes = async () => {
    await deleteOldTrashedNotes();

    const fetchedNotes = await getAllNotes();
    setAllNotes(fetchedNotes); // Save all notes to allow filtering

    const filtered = trashMode
      ? fetchedNotes.filter((note) => note.deletedAt)
      : fetchedNotes.filter((note) => !note.deletedAt);

    const sorted =
      sortBy === "title"
        ? filtered.sort((a, b) => a.title.localeCompare(b.title))
        : filtered.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
          );

    setNotes(sorted);
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

  const handleSaveNote = async (data: {
    title: string;
    content: string;
    image?: string;
  }) => {
    if (editingNote) {
      await updateNote(editingNote.id!, {
        ...editingNote,
        ...data,
        updatedAt: new Date(),
      });
    } else {
      await addNote({ ...data, createdAt: new Date(), updatedAt: new Date() });
    }
    await loadNotes();
    setIsModalOpen(false);
  };

  const confirmDeleteNote = async () => {
    if (deleteNoteId !== null) {
      await softDeleteNote(deleteNoteId);
      toast.success("Moved to Trash");
      await loadNotes();
      setDeleteNoteId(null); // Close the modal
    }
  };

  const confirmDeleteNotes = async () => {
    if (deleteNoteIds.length > 0) {
      if (!trashMode) {
        for (const id of deleteNoteIds) {
          await softDeleteNote(id);
        }
        toast.success("Moved to Trash");
      } else {
        for (const id of deleteNoteIds) {
          await deleteNote(id);
        }
        toast.success("Notes permanently deleted");
      }
      await loadNotes();
      setDeleteNoteIds([]); // clear after delete
    }
  };

  const handleRestoreNote = async (id: number) => {
    await updateNote(id, { deletedAt: null, updatedAt: new Date() });
    toast.success("Note restored");
    await loadNotes();
  };

  const exportNotes = (type: "pdf" | "txt") => {
    if (notes.length === 0) return;

    const content = notes
      .map(
        (note) =>
          `Title: ${note.title}\nDate: ${new Date(
            note.createdAt
          ).toLocaleString()}\n\n${note.content}\n\n---\n`
      )
      .join("\n");

    if (type === "txt") {
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "notes.txt";
      link.click();
    } else if (type === "pdf") {
      const doc = new jsPDF();
      const lines = doc.splitTextToSize(content, 180);
      doc.text(lines, 10, 10);
      doc.save("notes.pdf");
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
              onClick={() =>
                setViewMode(viewMode === "list" ? "tiles" : "list")
              }
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
            >
              <motion.div
                key={viewMode}
                initial={{ rotate: -20, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {viewMode === "list" ? (
                  <LayoutGrid
                    size={20}
                    className="text-black dark:text-white"
                  />
                ) : (
                  <List size={20} className="text-black dark:text-white" />
                )}
              </motion.div>
            </button>
          </div>

          {/* Sort controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setTrashMode(!trashMode)}
              className={`px-3 py-2 rounded-md text-sm font-semibold ${
                trashMode
                  ? "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
                  : "bg-red-500 text-white"
              } transition-all`}
            >
              {trashMode ? "Notes" : "Bin"}
            </button>

            {/* Sort Button */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="px-3 py-2 rounded-md text-sm font-semibold bg-gray-200 dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                {sortBy === "createdAt" ? "By Date" : "By Title"}
              </button>

              {/* Dropdown Options */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.ul
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-1 w-28 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-50"
                  >
                    <li
                      onClick={() => {
                        setSortBy("createdAt");
                        setDropdownOpen(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm text-black dark:text-white"
                    >
                      Sort By Date
                    </li>
                    <li
                      onClick={() => {
                        setSortBy("title");
                        setDropdownOpen(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm text-black dark:text-white"
                    >
                      Sort By Title
                    </li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
            {/* Export Button */}
            <div className="relative">
              <button
                onClick={() => setExportOpen((prev) => !prev)}
                className="px-3 py-2 rounded-md text-sm font-semibold bg-gray-200 dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.75"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-download-icon lucide-download"
                >
                  <path d="M12 15V3" />
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <path d="m7 10 5 5 5-5" />
                </svg>
              </button>

              {/* Export Options */}
              <AnimatePresence>
                {exportOpen && (
                  <motion.ul
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-1 w-32 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-50"
                  >
                    <li
                      onClick={() => {
                        exportNotes("txt");
                        setExportOpen(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm text-black dark:text-white"
                    >
                      Export as TXT
                    </li>
                    <li
                      onClick={() => {
                        exportNotes("pdf");
                        setExportOpen(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm text-black dark:text-white"
                    >
                      Export as PDF
                    </li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            {/* Add button */}
            <button
              onClick={handleAddNote}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
            >
              <motion.div
                initial={{ rotate: -20, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
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
        {trashMode && (
          <div className="mb-4 text-center">
            <h2 className="text-lg font-bold text-red-500">BIN</h2>
            <p className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Trash2 size={16} className="text-red-500" />
              Notes in bin will be permanently deleted after 15 days.
            </p>
          </div>
        )}

        {notes.length === 0 && !trashMode ? (
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
            }}
            onRestore={handleRestoreNote}
            trashMode={trashMode}
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
