import { getCategoryMeta } from "@lib/category-meta";

interface BlogCardThumbnailProps {
  title: string;
  category: string;
}

export default function BlogCardThumbnail({
  title,
  category,
}: BlogCardThumbnailProps) {
  const meta = getCategoryMeta(category);
  return (
    <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-blue to-navy p-5 flex flex-col justify-between">
      <svg
        className="absolute -right-2 -top-2 h-24 w-24 text-white/10"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d={meta.iconPath} />
      </svg>
      <div>
        <span className="inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-[0.625rem] font-semibold text-white uppercase tracking-wider">
          {meta.label}
        </span>
      </div>
      <p className="text-sm font-bold leading-snug text-white line-clamp-3 relative z-10">
        {title}
      </p>
    </div>
  );
}
