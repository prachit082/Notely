export default function Footer() {
    return (
      <footer className="w-full text-center py-4 text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()}{" "}
        <a
          href="https://github.com/prachit082"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-blue-500 transition-colors"
        >
          Prachit Pandit
        </a>. All rights reserved.
      </footer>
    );
  }
  