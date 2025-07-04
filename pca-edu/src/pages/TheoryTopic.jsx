import { useParams } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { categories } from '../content';

export default function TheoryTopic() {
  const { slug } = useParams();
  const topic = Object.values(categories).flat().find(t => t.slug === slug);

  return (
    <PageWrapper>
      <article className="prose prose-slate dark:prose-invert lg:prose-lg mx-auto px-6 py-16">
        {topic ? <topic.Component /> : <h1>Topic not found.</h1>}
      </article>
    </PageWrapper>
  );
}
