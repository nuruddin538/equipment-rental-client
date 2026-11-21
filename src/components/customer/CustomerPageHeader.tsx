interface CustomerPageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function CustomerPageHeader({
  eyebrow,
  title,
  description,
  action,
}: CustomerPageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-5 border-b border-[#14211F]/10 pb-7 sm:flex-row sm:items-end">
      <div>
        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.24em] text-[#F07842]">
          {eyebrow}
        </p>

        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
          {title}
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#14211F]/55">
          {description}
        </p>
      </div>

      {action}
    </div>
  );
}
