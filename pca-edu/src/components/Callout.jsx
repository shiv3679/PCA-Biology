export default function Callout({ type = 'info', children }) {
  const palette = {
    info: 'bg-sky-50  border-sky-300  text-sky-900  dark:bg-sky-900/20',
    tip:  'bg-emerald-50 border-emerald-300 text-emerald-900 dark:bg-emerald-900/20',
    warn: 'bg-amber-50 border-amber-300 text-amber-900 dark:bg-amber-900/20',
  }[type] ?? '';

  return (
    <aside className={`not-prose mt-6 mb-8 rounded-lg border-l-4 p-4 ${palette}`}>
      {children}
    </aside>
  );
}
