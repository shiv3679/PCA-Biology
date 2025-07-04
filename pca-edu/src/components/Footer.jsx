export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      <div className="mx-auto max-w-7xl p-6 text-center text-sm text-slate-500 dark:text-slate-400">
        © {new Date().getFullYear()}  BioLearn Lab · Built on curiosity ✨
      </div>
    </footer>
  );
}
