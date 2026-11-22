export default function CustomerLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="border-b border-[#14211F]/10 pb-7">
        <div className="h-3 w-36 rounded bg-[#14211F]/10" />
        <div className="mt-4 h-10 w-64 rounded bg-[#14211F]/10" />
        <div className="mt-3 h-4 w-80 max-w-full rounded bg-[#14211F]/10" />
      </div>

      <div className="h-48 rounded-2xl bg-[#14211F]/10" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-44 rounded-2xl bg-white" />
        ))}
      </div>
    </div>
  );
}
