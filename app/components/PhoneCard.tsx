import Link from "next/link";
import PhoneImage from "./PhoneImage";
import { formatPrice, isRegistered, splitModel, type InventoryItem } from "../lib/inventory";

type Props = {
  item: InventoryItem;
  onSelect?: (item: InventoryItem) => void;
  priority?: boolean;
};

export default function PhoneCard({ item, onSelect, priority }: Props) {
  const { name, color } = splitModel(item.model);
  const price = formatPrice(item.price);
  const registered = isRegistered(item.registry);

  const body = (
    <>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[18px] bg-[#f4f4f7]">
        <PhoneImage
          item={item}
          priority={priority}
          className="transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.035]"
        />
        <span
          className={`absolute right-2.5 top-2.5 rounded-full px-2.5 py-1 text-[10px] font-bold backdrop-blur ${
            registered
              ? "bg-ink/85 text-white"
              : "bg-white/85 text-ink-soft ring-1 ring-line"
          }`}
        >
          {registered ? "کددار" : "بدون کد"}
        </span>
      </div>

      <div className="px-0.5 pt-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-[13.5px] font-bold leading-6 text-ink">{name}</h3>
          <span className="shrink-0 text-[11px] font-medium text-muted tnum">{item.capacity}</span>
        </div>
        <p className="mt-0.5 truncate text-[11.5px] text-muted">
          {color && (
            <>
              <span>{color}</span>
              <span className="mx-1.5 text-line">•</span>
            </>
          )}
          <span className="tnum">{item.part}</span>
        </p>

        <div className="mt-2.5 flex items-baseline gap-1">
          {price ? (
            <>
              <span className="text-[15px] font-extrabold tracking-tight text-ink tnum">{price}</span>
              <span className="text-[10.5px] font-medium text-muted">تومان</span>
            </>
          ) : (
            <span className="text-[12px] font-medium text-muted">استعلام قیمت</span>
          )}
        </div>
      </div>
    </>
  );

  const shell =
    "group block w-full rounded-[24px] border border-line bg-surface p-2.5 text-right transition-transform duration-300 ease-out hover:-translate-y-0.5";

  if (onSelect) {
    return (
      <button type="button" onClick={() => onSelect(item)} className={shell}>
        {body}
      </button>
    );
  }

  return (
    <Link href="/inventory" className={shell}>
      {body}
    </Link>
  );
}
