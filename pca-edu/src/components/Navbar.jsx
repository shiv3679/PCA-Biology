import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, Sun, Moon } from 'lucide-react';

export default function Navbar() {
  /* ─── theme & state ──────────────────────────── */
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const close = () => setOpen(false);

  /* ─── close on route change / esc / resize ──── */
  useEffect(() => close(), [pathname]);
  useEffect(() => {
    const esc = e => e.key === 'Escape' && close();
    const resize = () => window.innerWidth >= 768 && close();   // close on desktop
    window.addEventListener('keydown', esc);
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('keydown', esc);
      window.removeEventListener('resize', resize);
    };
  }, []);

  /* ─── lock scroll when drawer open ───────────── */
  useEffect(() => {
    document.documentElement.classList.toggle('overflow-hidden', open);
    return () => document.documentElement.classList.remove('overflow-hidden');
  }, [open]);

  const navItem =
    'block px-4 py-2 rounded hover:bg-brand-light/10 dark:hover:bg-brand-dark/20';
  const active = 'text-brand font-semibold';

  const Links = () => (
    <>
      <NavLink to="/" onClick={close} className={({ isActive }) => navItem + (isActive ? ' ' + active : '')}>
        Home
      </NavLink>
      <NavLink to="/theory" onClick={close} className={({ isActive }) => navItem + (isActive ? ' ' + active : '')}>
        Theory
      </NavLink>
      {/* future Playground */}
    </>
  );

  return (
    <>
      {/* ─── Transparent overlay bar ───────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between
                          px-4 py-3 md:px-6
                          text-slate-700 dark:text-slate-200
                          bg-transparent">
        {/* Brand */}
        <Link to="/" className="text-2xl font-heading text-brand-dark dark:text-brand-light">
          🧬 BioLearn Lab
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-2">
          <Links />
          <button
            onClick={toggle}
            className="ml-4 rounded-full p-2 hover:bg-brand-light/10 dark:hover:bg-brand-dark/20"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden rounded-full p-2 hover:bg-brand-light/10 dark:hover:bg-brand-dark/20"
          aria-label="Open menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* ─── Backdrop ─────────────────────────────────── */}
      <div
        onClick={close}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300
                    ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* ─── Slide-in drawer ──────────────────────────── */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-[75vw] xs:w-[60vw] max-w-xs
                    bg-white dark:bg-slate-800 shadow-lg p-6 flex flex-col
                    transition-transform duration-300
                    ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <nav className="flex-1">{<Links />}</nav>

        <button
          onClick={() => {
            toggle();
            close();
          }}
          className="mt-auto self-start rounded-full p-2 hover:bg-brand-light/10 dark:hover:bg-brand-dark/20"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </aside>
    </>
  );
}
