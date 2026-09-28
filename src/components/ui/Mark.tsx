/* Znak Nest Studio, wariant A: N z trzech nici (propozycja, docs/brand.md). */
export function Mark({ size = 28, className, title = 'Nest Studio' }: { size?: number; className?: string; title?: string }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={3.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={title}
    >
      <path className="nest-thread nest-thread-1" d="M15 4V6.44M15 14.56V44" />
      <path className="nest-thread nest-thread-2" d="M33 4V44" />
      <path className="nest-thread nest-thread-3" d="M11 4.5L30.3 33.45M35.7 41.55L38.6 45.9" />
    </svg>
  );
}
