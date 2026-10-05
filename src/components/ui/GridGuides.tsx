/*
 * The page grid: six column guides aligned to the content columns (two on a phone), barely there.
 * Fixed behind everything; tiles cover it, so it only shows in the open space between them, and it fades
 * out toward the top and bottom of the screen. The quote section draws its hairlines on the same columns.
 */
export function GridGuides() {
  return (
    <div className="grid-guides" aria-hidden="true">
      <div className="wrap grid-guides-in">
        {Array.from({ length: 6 }, (_, i) => <span key={i} />)}
      </div>
    </div>
  );
}
