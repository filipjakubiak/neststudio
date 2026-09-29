import { pl } from '@/content/pl';
import { BASE_PATH } from '@/content/site';

export default function NotFound() {
  return (
    <section className="section wrap" style={{ minHeight: '100dvh', display: 'grid', alignContent: 'center' }}>
      <h1 className="t-h1">{pl.system.notFound}</h1>
      <p className="t-lead" style={{ marginTop: 'var(--s-6)' }}>
        <a className="link" href={`${BASE_PATH}/`}>{pl.system.backHome}</a>
      </p>
    </section>
  );
}
