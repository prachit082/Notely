import { ArrowUpFromLine } from "lucide-react";
import { Note } from "../db/db";
import Button from "./ui/Button";

interface NoteCardProps {
  note: Note;
  viewMode: "list" | "tiles";
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onRestore?: (id: number) => void;
  trashMode?: boolean;
}

export default function NoteCard({
  note,
  isSelected,
  onSelect,
  viewMode,
  onEdit,
  onDelete,
  onRestore,
  trashMode,
}: NoteCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex flex-col h-full">
      {/* Top Section: Checkbox + Main Content */}
      <div className="flex items-center gap-2">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(note.id!)}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
        />

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white truncate">
          {note.title}
        </h2>
      </div>

      {/* Content */}
      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-3">
        {note.content}
      </p>

      {/* Image */}
      {viewMode === "tiles" && note.image && (
        <img
          src={note.image}
          alt="Note"
          className="mt-4 w-full aspect-[10/8] object-cover rounded-lg"
        />
      )}

      {/* Created At */}
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Created at: {new Date(note.createdAt).toLocaleString()}
      </div>

      {/* Action Buttons */}
      <div className="flex items-end gap-2 mt-auto pt-4 text-black dark:text-white">
        {trashMode ? (
          <Button
            variant="secondary"
            onClick={() => onRestore?.(note.id!)}
            title="Restore"
            className="text-sm text-blue-500 hover:text-blue-700 flex items-center gap-1"
          >
            <ArrowUpFromLine size={16} />
            Restore
          </Button>
        ) : (
          <>
            <Button
              variant="secondary"
              onClick={() => onEdit(note.id!)}
              className="text-sm"
            >
              Edit
            </Button>
            <Button
              variant="secondary"
              onClick={() => onDelete(note.id!)}
              className="text-sm"
            >
              Delete
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
