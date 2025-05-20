import * as Dialog from '@radix-ui/react-dialog';
import { useState, useEffect } from 'react';
import Button from './Button';
import { toBase64 } from '../../utils/toBase64';

interface NoteModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: (data: { title: string; content: string; image?: string }) => void;
  onDelete?: () => void;
  initialData?: { title: string; content: string; image?: string };
  mode: 'edit' | 'delete';
  className?: string;
  title?: string;          // 👈 Dynamic title
  description?: string;    // 👈 Dynamic description
}

export default function NoteModal({
  open,
  onClose,
  onSave,
  onDelete,
  initialData,
  mode,
  title,
  description,
}: NoteModalProps) {
  const [noteTitle, setNoteTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [image, setImage] = useState<string | undefined>(initialData?.image);

  useEffect(() => {
    if (open) {
      setNoteTitle(initialData?.title || '');
      setContent(initialData?.content || '');
      setImage(initialData?.image);
    }
  }, [open, initialData]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await toBase64(file);
      setImage(base64);
    }
  };

  const handleSave = () => {
    if (!noteTitle.trim()) {
      alert('Title is required');
      return;
    }
    onSave?.({ title: noteTitle, content, image });
    onClose();
  };

  const handleConfirmDelete = () => {
    onDelete?.();
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg space-y-4">
          
          {/* Title */}
          <Dialog.Title className="text-lg font-semibold text-gray-800 dark:text-white">
            {title ? title : (mode === 'edit' ? (initialData ? 'Edit Note' : 'Add New Note') : 'Confirm Delete')}
          </Dialog.Title>

          {mode === 'edit' ? (
            <>
              {/* Form for editing/adding notes */}
              <input
                className="w-full p-2 rounded-md border dark:bg-gray-700 dark:border-gray-600"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Note Title"
              />
              <textarea
                className="w-full p-2 rounded-md border dark:bg-gray-700 dark:border-gray-600"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Note Content"
              />
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-sm"
                />
                {image && (
                  <img src={image} alt="Preview" className="mt-2 w-full h-48 object-cover rounded-md" />
                )}
              </div>

              <div className="flex justify-end gap-2 text-black dark:text-white">
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
              </div>
            </>
          ) : (
            <>
              {/* Delete confirmation */}
              <p className="text-gray-600 dark:text-gray-300">
                {description ? description : 'Are you sure you want to delete this note? This action cannot be undone.'}
              </p>

              <div className="flex justify-end gap-2 text-black dark:text-white">
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button variant="primary" onClick={handleConfirmDelete}>Delete</Button>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
