export default function CustomerTableSkeleton({
  rows = 6,
  columns = 6,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#14211F]/10 bg-white p-5">
      <div className="mb-6 h-5 w-40 animate-pulse rounded bg-[#14211F]/10" />

      <div className="space-y-5">
        {Array.from({ length: rows }).map((_, row) => (
          <div key={row} className="flex gap-5">
            {Array.from({ length: columns }).map((_, column) => (
              <div
                key={column}
                className="h-5 flex-1 animate-pulse rounded bg-[#14211F]/8"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
