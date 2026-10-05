type Arrow = 'up' | 'down' | false;
type Common = { children: React.ReactNode; variant?: 'primary' | 'quiet'; size?: 'md' | 'sm'; arrow?: Arrow; className?: string; ariaLabel?: string };
type LinkProps = Common & { href: string; external?: boolean; type?: never; disabled?: never };
type ButtonProps = Common & { href?: never; external?: never; type?: 'button' | 'submit'; disabled?: boolean };

/* Pill button: 48 px (36 px small, with a 44 px hit area). The arrows are the document's (↗ ↓). */
export function Button(props: LinkProps | ButtonProps) {
  const { children, variant = 'primary', size = 'md', arrow = 'up', className = '', ariaLabel } = props;
  const cls = `btn btn-${variant}${size === 'sm' ? ' btn-sm' : ''} ${className}`.trim();
  const inner = (
    <>
      <span>{children}</span>
      {arrow === 'up' && <span className="arr" aria-hidden="true">↗</span>}
      {arrow === 'down' && <span className="arr-down" aria-hidden="true">↓</span>}
    </>
  );
  if ('href' in props && props.href) {
    return (
      <a href={props.href} className={cls} aria-label={ariaLabel} {...(props.external ? { target: '_blank', rel: 'noopener' } : {})}>
        {inner}
      </a>
    );
  }
  const b = props as ButtonProps;
  return (
    <button type={b.type ?? 'button'} disabled={b.disabled} className={cls} aria-label={ariaLabel}>
      {inner}
    </button>
  );
}

/* Text link with the document's arrow, in the accent colour. */
export function More({ href, children, external, className = '', stretched }: { href: string; children: React.ReactNode; external?: boolean; className?: string; stretched?: boolean }) {
  return (
    <a href={href} className={`more${stretched ? ' stretched' : ''} ${className}`.trim()} {...(external ? { target: '_blank', rel: 'noopener' } : {})}>
      <span>{children}</span>
      <span className="arr" aria-hidden="true">↗</span>
    </a>
  );
}
