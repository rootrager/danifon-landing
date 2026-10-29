/* eslint-disable @next/next/no-img-element */
import { photoFor, placeholderTint, type PhotoItem } from "../lib/photos";

type Props = {
  item: PhotoItem;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/**
 * Product visual: real photo when we have one, otherwise a calm neutral tile.
 * Never shows a broken image and never mislabels a model.
 */
export default function PhoneImage({ item, className = "", priority = false }: Props) {
  const src = photoFor(item);

  if (src) {
    return (
      <img
        src={src}
        alt={item.model ?? "آیفون"}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  const tint = placeholderTint(item);
  return (
    <div
      className={`relative flex h-full w-full items-center justify-center ${className}`}
      style={{ background: `linear-gradient(160deg, ${tint}1f 0%, ${tint}08 60%, #ffffff 100%)` }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 120 200" className="h-[58%] w-auto opacity-[0.5]" fill="none">
        <rect x="8" y="6" width="104" height="188" rx="26" stroke={tint} strokeWidth="3" />
        <rect x="20" y="18" width="80" height="164" rx="18" fill={`${tint}14`} />
        <rect x="40" y="110" width="40" height="34" rx="10" fill={tint} opacity="0.35" />
        <circle cx="60" cy="196" r="0" />
      </svg>
    </div>
  );
}
