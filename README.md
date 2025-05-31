# NOTELY

A beautiful, minimalistic, and responsive **Notes Manager** — built with **React**, **TypeScript**, **TailwindCSS**, **Radix UI**, **Dexie**, and **Lucide Icons**.  
It is **Responsive** and supports **Light/Dark Mode** & **Smooth Animations**!

---

## ✨ Features

- 📒 **Create, Edit, and Delete Notes**.
- 🎨 **Light & Dark Mode Toggle** with smooth bounce animation.
- 🖼️ **Image Upload** support for your notes (in Tiles view).
- 📋 **View Modes**:  
  - **List** view for simple scrolling.
  - **Tiles** view for gallery-style cards.
- 🔍 **Sort Notes** by:
  - Title (A-Z)
  - Created Date (New → Old)
- ⚡ **Framer Motion Animations** for interactive feel.
- 🌐 **Responsive Design** (works perfectly on Mobile, Tablet, Desktop).
- 🚀 **Super Fast** and lightweight!

---

---

## 🛠️ Tech Stack

- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (animations)
- **Radix UI** (accessible modals)
- **Lucide React** (beautiful icons)
- **Dexie - IndexedDB** (via custom service)

---

## Folder Structure

```js
src/
 ├─ components/
 │   ├─ ui/
 │   │   ├─ Button.tsx
 │   │   ├─ Input.tsx
 │   │   ├─ NoteModal.tsx
 │   │   ├─ ToggleTheme.tsx
 │   ├─ Footer.tsx
 │   ├─ Landing.tsx
 │   ├─ NoteCard.tsx
 │   ├─ NotesList.tsx
 ├─ db/
 │   ├─ db.ts
 │   ├─ noteService.ts
 ├─ hooks/
 │   ├─ useTheme.ts
 ├─ utils/
 │   ├─ cn.ts
 │   ├─ imageHelpers.ts
 │   ├─ toBase64.ts
 ├─ App.css
 ├─ App.tsx
 ├─ index.css
 ├─ main.tsx
 ├─ vite-env.d.ts
eslint.config.js
index.html
package-lock.json
package.json
postcss.config.js
tailwind.config.ts
tsconfig.app.json
tsconfig.json
tsconfig.node.json
vite.config.ts
```
## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/prachit082/Notely.git
cd Notely
```
Install dependencies:

```bash
npm install
# or
yarn install
```
Start the development server:
```bash
npm run dev
# or
yarn dev
```
### ✍️ Author
Made with ❤️ by Prachit Pandit

### 📜 License
This project is licensed under the MIT License.

### 💡 Future Improvements
✅ Drag-and-drop notes reordering.

✅ Markdown support for note content.

✅ Pin favorite notes to top.

✅ Backend integration (optional).


