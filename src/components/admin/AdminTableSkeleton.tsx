export default function AdminTableSkeleton({
  rows = 6,
  columns = 5,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#14211F]/10 bg-white">
      <div className="border-b border-[#14211F]/10 p-5">
        <div className="h-4 w-40 animate-pulse rounded bg-[#14211F]/10" />
      </div>

      <div className="space-y-5 p-5">
        {Array.from({ length: rows }).map((_, row) => (
          <div key={row} className="flex items-center gap-5">
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
