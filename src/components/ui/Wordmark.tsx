import { Mark } from './Mark';

export function Wordmark({ href = '/', compact = false }: { href?: string; compact?: boolean }) {
  return (
    <a href={href} className="wordmark" aria-label="Nest Studio">
      <Mark size={compact ? 22 : 26} />
      {!compact && (
        <span className="wordmark-text">
          Nest <span style={{ fontWeight: 300 }}>Studio</span>
        </span>
      )}
    </a>
  );
}
