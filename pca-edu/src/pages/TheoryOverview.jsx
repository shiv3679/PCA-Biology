import { Link } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { categories } from '../content';

export default function TheoryOverview() {
  return (
    <PageWrapper>
      <section className="mx-auto max-w-6xl px-6 py-16 space-y-14">
        <h1 className="text-4xl text-center">Theory Library</h1>

        {Object.entries(categories).map(([cat, topics]) => (
          <div key={cat} className="space-y-6">
            <h2 className="text-2xl text-brand">{cat}</h2>

            <div className="grid gap-6 md:grid-cols-2">
              {topics.map(({ slug, title }) => (
                <Link
                  key={slug}
                  to={`/theory/${slug}`}
                  className="group rounded-xl border border-slate-200 dark:border-slate-700 p-5
                             hover:shadow-md hover:border-brand transition"
                >
                  <h3 className="text-xl group-hover:underline">{title}</h3>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>
    </PageWrapper>
  );
}
