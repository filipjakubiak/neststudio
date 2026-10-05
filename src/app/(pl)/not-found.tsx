import { pl } from '@/content/pl';

export default function NotFound() {
  return (
    <section className="wrap" style={{ minHeight: '100dvh', display: 'grid', alignContent: 'center', gap: 'var(--s-6)' }}>
      <h1 className="t-h1">{pl.system.notFound}</h1>
      <p className="t-lead"><a className="link" href="/">{pl.system.backHome}</a></p>
    </section>
  );
}
