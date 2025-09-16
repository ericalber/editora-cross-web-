interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  viewAllHref?: string;
  viewAllLabel?: string;
}

export function SectionTitle({
  title,
  subtitle,
  align = "left",
  viewAllHref,
  viewAllLabel = "Ver mais",
}: SectionTitleProps) {
  const alignment = align === "center" ? "text-center" : "text-left";

  return (
    <div className={`space-y-2 ${alignment}`}>
      <div
        className={`flex flex-col gap-2 ${
          align === "center" ? "items-center" : "items-start"
        } md:flex-row md:items-end md:justify-between`}
      >
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900 md:text-3xl">
          <span className="relative inline-block">
            <span className="relative z-10">{title}</span>
            <span className="absolute -bottom-1 left-0 h-2 w-full bg-secondary/30" />
          </span>
        </h2>
        {viewAllHref ? (
          <a
            href={viewAllHref}
            className="text-sm font-semibold text-primary transition hover:text-primary/80"
          >
            {viewAllLabel}
          </a>
        ) : null}
      </div>
      {subtitle ? (
        <p className="max-w-2xl text-sm text-gray-600 md:text-base md:leading-relaxed">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
