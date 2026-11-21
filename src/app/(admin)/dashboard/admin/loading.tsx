export default function AdminLoading() {
  return (
    <div className="space-y-8">
      <div className="animate-pulse border-b border-[#14211F]/10 pb-7">
        <div className="h-3 w-36 rounded bg-[#14211F]/10" />
        <div className="mt-4 h-10 w-64 rounded bg-[#14211F]/10" />
        <div className="mt-3 h-4 w-80 max-w-full rounded bg-[#14211F]/10" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-44 animate-pulse rounded-2xl border border-[#14211F]/10 bg-white p-6"
          >
            <div className="h-10 w-10 rounded-xl bg-[#14211F]/10" />
            <div className="mt-8 h-8 w-20 rounded bg-[#14211F]/10" />
            <div className="mt-3 h-4 w-32 rounded bg-[#14211F]/10" />
          </div>
        ))}
      </div>

      <div className="h-64 animate-pulse rounded-2xl bg-white" />
    </div>
  );
}
