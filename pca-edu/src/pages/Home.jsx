import { Link } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';

export default function Home() {
  return (
    <PageWrapper>
      {/* ── HERO ─────────────────────────────────── */}
      <section className="relative flex items-center justify-center h-[70vh] px-4 text-center">
        {/* gradient background */}
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-br from-brand via-emerald-500 to-cyan-500
                     dark:from-brand-dark dark:via-emerald-700 dark:to-cyan-700"
        />
        {/* subtle texture overlay */}
        <div className="absolute inset-0 -z-20 bg-[url('/noise.svg')] opacity-20" />
        <div className="max-w-3xl">
          <h1 className="text-4xl xs:text-5xl md:text-6xl leading-tight font-heading text-white drop-shadow">
            Biology concepts <span className="whitespace-nowrap">that finally&nbsp;click</span>
          </h1>
          <p className="mt-6 text-lg xs:text-xl md:text-2xl text-slate-100">
            Bite-sized theory notes and interactive mini-labs — from cell bio to data science.
          </p>
          <Link
            to="/theory"
            className="mt-8 inline-block rounded-lg bg-white/90 dark:bg-slate-900/90
                       px-8 py-3 text-brand font-semibold hover:bg-white dark:hover:bg-slate-900"
          >
            Start learning →
          </Link>
        </div>
      </section>

      {/* ── VALUE CARDS ───────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-20 space-y-12">
        <h2 className="text-3xl text-center">Why BioLearn Lab?</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            ['📚  Curated theory', 'Straight-to-the-point explanations distilled from PhD struggles.'],
            ['🧪  Hands-on mini labs', 'Client-side Python playgrounds — no installs, just click & explore.'],
            ['🎨  Youthful design', 'Dark-mode ready, mobile-first, emoji-sprinkled.'],
          ].map(([title, body]) => (
            <article
              key={title}
              className="rounded-xl bg-white dark:bg-slate-800 p-6 shadow hover:shadow-md transition"
            >
              <h3 className="text-xl mb-2">{title}</h3>
              <p className="text-slate-600 dark:text-slate-300">{body}</p>
            </article>
          ))}
        </div>
      </section>
    </PageWrapper>
  );
}
