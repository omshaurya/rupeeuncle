/** Matches CalculatorCard's layout exactly so the loading→loaded transition doesn't jump. */
export default function CardSkeleton() {
  return (
    <div className="card-surface flex flex-col justify-between p-5">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="skeleton h-10 w-10 rounded-lg" />
          <div className="skeleton h-5 w-16 rounded-full" />
        </div>
        <div className="skeleton mt-4 h-4 w-3/4 rounded" />
        <div className="skeleton mt-2 h-3 w-full rounded" />
        <div className="skeleton mt-1.5 h-3 w-5/6 rounded" />
      </div>
      <div className="skeleton mt-4 h-3 w-24 rounded" />
    </div>
  );
}
