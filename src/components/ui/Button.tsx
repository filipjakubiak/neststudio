import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr';

type Common = { children: React.ReactNode; variant?: 'primary' | 'ghost'; icon?: boolean; className?: string; magnetic?: boolean };
type LinkProps = Common & { href: string; onClick?: never; type?: never; disabled?: never; ariaLabel?: string };
type ButtonProps = Common & { href?: never; onClick?: () => void; type?: 'button' | 'submit'; disabled?: boolean; ariaLabel?: string };

export function Button(props: LinkProps | ButtonProps) {
  const { children, variant = 'primary', icon = true, className = '', magnetic = false, ariaLabel } = props;
  const cls = `btn btn-${variant} ${className}`.trim();
  const inner = (
    <>
      <span>{children}</span>
      {icon && (
        <span className="btn-icon" aria-hidden="true">
          <ArrowUpRight size={16} weight="regular" />
        </span>
      )}
    </>
  );
  if ('href' in props && props.href) {
    return (
      <a href={props.href} className={cls} data-magnetic={magnetic || undefined} aria-label={ariaLabel}>
        {inner}
      </a>
    );
  }
  const b = props as ButtonProps;
  return (
    <button type={b.type ?? 'button'} onClick={b.onClick} disabled={b.disabled} className={cls} data-magnetic={magnetic || undefined} aria-label={ariaLabel}>
      {inner}
    </button>
  );
}
