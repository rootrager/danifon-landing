"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  Send,
  MessageCircle,
  Target,
  Smartphone,
  RotateCcw,
  LayoutGrid,
  Table2,
  ArrowLeft,
} from "lucide-react";
import type { InventoryItem } from "./page";
import config from "../../config.json";
import TopNav from "../components/TopNav";
import InventoryCard from "./components/InventoryCard";
import TechnicalInspectionSheet from "./components/TechnicalInspectionSheet";
import {
  parseModelAndColor,
  getColorMeta,
  getPartCountry,
  getActivationMeta,
  getRegistryMeta,
  formatPrice,
  capacityRank,
} from "./components/inventoryHelpers";

export default function InventoryClient({
  items,
}: {
  items: InventoryItem[];
  fetchedAt?: string;
}) {
  const [registryFilter, setRegistryFilter] = useState<"all" | "with-reg" | "no-reg">("all");
  const [selectedSeriesFilter, setSelectedSeriesFilter] = useState<string>("all");
  const [selectedModelFilter, setSelectedModelFilter] = useState<string>("all");
  const [selectedCapacityFilter, setSelectedCapacityFilter] = useState<string>("all");
  const [selectedColorFilter, setSelectedColorFilter] = useState<string>("all");
  const [activationFilter, setActivationFilter] = useState<"all" | "not-active" | "active">("all");
  const [sortOption, setSortOption] = useState<"default" | "price-asc" | "price-desc">("default");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileAdvanced, setShowMobileAdvanced] = useState(false);
  const [inspectedItem, setInspectedItem] = useState<InventoryItem | null>(null);
  const [heroImgError, setHeroImgError] = useState(false);

  const registryCounts = useMemo(() => {
    let withReg = 0;
    let noReg = 0;
    items.forEach((item) => {
      if (getRegistryMeta(item.registry).isRegistered) withReg++;
      else noReg++;
    });
    return { withReg, noReg };
  }, [items]);

  const availableModels = useMemo(() => {
    const map = new Map<string, number>();
    items.forEach((item) => {
      if (selectedSeriesFilter !== "all" && item.series !== selectedSeriesFilter) return;
      if (registryFilter !== "all") {
        const isReg = getRegistryMeta(item.registry).isRegistered;
        if (registryFilter === "with-reg" && !isReg) return;
        if (registryFilter === "no-reg" && isReg) return;
      }
      const { modelName } = parseModelAndColor(item.model, item.color);
      map.set(modelName, (map.get(modelName) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [items, selectedSeriesFilter, registryFilter]);

  const availableCapacities = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.capacity) set.add(item.capacity);
    });
    return Array.from(set).sort((a, b) => capacityRank(a) - capacityRank(b));
  }, [items]);

  const availableColors = useMemo(() => {
    const map = new Map<string, { compactName: string; hex: string }>();
    items.forEach((item) => {
      const { modelName, extractedColor } = parseModelAndColor(item.model, item.color);
      const meta = getColorMeta(extractedColor, modelName);
      if (!map.has(meta.shortName)) {
        map.set(meta.shortName, {
          compactName: meta.compactName,
          hex: meta.hex,
        });
      }
    });
    return Array.from(map.entries()).map(([name, data]) => ({
      name,
      compactName: data.compactName,
      hex: data.hex,
    }));
  }, [items]);

  const filteredItems = useMemo(() => {
    let result = [...items];

    if (registryFilter !== "all") {
      result = result.filter((i) => {
        const isReg = getRegistryMeta(i.registry).isRegistered;
        return registryFilter === "with-reg" ? isReg : !isReg;
      });
    }

    if (selectedSeriesFilter !== "all") {
      result = result.filter((i) => i.series === selectedSeriesFilter);
    }

    if (selectedModelFilter !== "all") {
      result = result.filter(
        (i) => parseModelAndColor(i.model, i.color).modelName === selectedModelFilter
      );
    }

    if (selectedCapacityFilter !== "all") {
      result = result.filter((i) => i.capacity === selectedCapacityFilter);
    }

    if (selectedColorFilter !== "all") {
      result = result.filter((i) => {
        const { modelName, extractedColor } = parseModelAndColor(i.model, i.color);
        return getColorMeta(extractedColor, modelName).shortName === selectedColorFilter;
      });
    }

    if (activationFilter !== "all") {
      result = result.filter((i) => {
        const meta = getActivationMeta(i.condition);
        return activationFilter === "not-active" ? meta.isNotActive : !meta.isNotActive;
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((i) => {
        const c = (i.color ?? "").toLowerCase();
        const enColorAlias =
          c.includes("آلبالویی") || c.includes("زرشکی")
            ? "burgundy crimson red"
            : c.includes("آبی")
            ? "blue glacier"
            : c.includes("سفید")
            ? "silver white"
            : c.includes("مشکی")
            ? "black blk"
            : c.includes("نارنجی")
            ? "orange"
            : c.includes("بنفش")
            ? "purple perpul"
            : c.includes("سبز")
            ? "sage green"
            : "";
        const text = `${i.model ?? ""} ${i.capacity ?? ""} ${i.part ?? ""} ${i.color ?? ""} ${enColorAlias} ${i.condition ?? ""} ${i.registry ?? ""}`.toLowerCase();
        return text.includes(q);
      });
    }

    if (sortOption !== "default") {
      result.sort((a, b) => {
        const priceA = formatPrice(a.price).rawNum;
        const priceB = formatPrice(b.price).rawNum;
        return sortOption === "price-asc" ? priceA - priceB : priceB - priceA;
      });
    }

    return result;
  }, [
    items,
    registryFilter,
    selectedSeriesFilter,
    selectedModelFilter,
    selectedCapacityFilter,
    selectedColorFilter,
    activationFilter,
    searchQuery,
    sortOption,
  ]);

  const groupedByModel = useMemo(() => {
    const groups = new Map<
      string,
      {
        modelName: string;
        items: InventoryItem[];
        minPrice: number;
        previewPhotos: string[];
      }
    >();

    filteredItems.forEach((item) => {
      const { modelName, extractedColor } = parseModelAndColor(item.model, item.color);
      const { imageSrc } = getColorMeta(extractedColor, modelName);
      const priceNum = formatPrice(item.price).rawNum;
      const existing = groups.get(modelName);
      if (!existing) {
        groups.set(modelName, {
          modelName,
          items: [item],
          minPrice: priceNum > 0 ? priceNum : Infinity,
          previewPhotos: [imageSrc],
        });
      } else {
        existing.items.push(item);
        if (priceNum > 0 && priceNum < existing.minPrice) {
          existing.minPrice = priceNum;
        }
        if (!existing.previewPhotos.includes(imageSrc) && existing.previewPhotos.length < 4) {
          existing.previewPhotos.push(imageSrc);
        }
      }
    });

    return Array.from(groups.values());
  }, [filteredItems]);

  const advancedFilterCount =
    (selectedModelFilter !== "all" ? 1 : 0) +
    (selectedCapacityFilter !== "all" ? 1 : 0) +
    (selectedColorFilter !== "all" ? 1 : 0) +
    (activationFilter !== "all" ? 1 : 0);

  const hasActiveFilters =
    registryFilter !== "all" ||
    selectedSeriesFilter !== "all" ||
    advancedFilterCount > 0 ||
    searchQuery.trim() !== "";

  const resetAllFilters = () => {
    setRegistryFilter("all");
    setSelectedSeriesFilter("all");
    setSelectedModelFilter("all");
    setSelectedCapacityFilter("all");
    setSelectedColorFilter("all");
    setActivationFilter("all");
    setSearchQuery("");
  };

  return (
    <div className="flex flex-col min-h-dvh w-full" dir="rtl">
      <TopNav />

      <div className="w-full px-4 sm:px-6 lg:px-8 pt-6 pb-28 md:pb-14 flex flex-col gap-6 flex-1">
        {/* Header & Banner Split */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-center gap-2">
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <span>فروشگاه دانیفون</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-300 font-medium tabular-nums">
                {items.length} دستگاه پلمپ آماده تحویل
              </span>
              <span aria-hidden="true">·</span>
              <span>۱۰ روز مهلت تست کتبی</span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-white leading-tight text-balance">
              لیست قیمت و موجودی آیفون‌های آکبند
            </h1>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-2xl">
              تمامی دستگاه‌ها پلمپ اصلی شرکت اپل هستند. با انتخاب هر کانفیگ می‌توانید مشخصات فنی، پارت‌نامبر و قیمت نقدی روز را مشاهده و رزرو کنید.
            </p>
          </div>

          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-white/12 bg-neutral-900 aspect-[21/9] lg:aspect-[16/7] flex items-center justify-center">
            {!heroImgError ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src="/models/hero-4colors-framed.jpg"
                alt="رنگ‌بندی آیفون‌های سری ۱۸ در فروشگاه دانیفون"
                referrerPolicy="no-referrer"
                onError={() => setHeroImgError(true)}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <Smartphone className="w-8 h-8 text-neutral-600" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-2.5 inset-x-3.5 flex items-center justify-between text-[11px] text-neutral-200">
              <span className="font-semibold">سری ۱۸، ۱۷ و ۱۶ پلمپ نات‌اکتیو</span>
              <span className="text-emerald-300 font-semibold">تحویل فوری تهران</span>
            </div>
          </div>
        </section>

        {/* MOBILE-ONLY ABOVE-THE-FOLD FILTER BAR (< lg) */}
        <section
          aria-label="فیلترهای سریع موبایل"
          className="lg:hidden w-full p-3.5 rounded-2xl bg-white/[0.045] backdrop-blur-2xl border border-white/[0.10] flex flex-col gap-3"
        >
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                aria-label="جستجوی مدل، رنگ یا پارت‌نامبر"
                placeholder="جستجوی مدل، رنگ یا پارت..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full min-h-[44px] py-2 pr-10 pl-9 rounded-xl bg-black/45 border border-white/15 focus:border-emerald-400/70 text-xs text-white placeholder:text-neutral-400 outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="w-8 h-8 flex items-center justify-center absolute left-1.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white cursor-pointer"
                  aria-label="پاک کردن جستجو"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowMobileAdvanced((prev) => !prev)}
              aria-expanded={showMobileAdvanced}
              className={`min-h-[44px] px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap touch-manipulation ${
                showMobileAdvanced || advancedFilterCount > 0
                  ? "bg-white text-neutral-950 border-white"
                  : "bg-black/40 border-white/15 text-neutral-200"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>فیلتر</span>
              {advancedFilterCount > 0 && (
                <span className="px-1.5 py-0.5 rounded bg-neutral-900 text-white text-[10px] font-mono tabular-nums leading-none">
                  {advancedFilterCount}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {(
              [
                { id: "all", label: "همه" },
                { id: "18", label: "سری ۱۸" },
                { id: "17", label: "سری ۱۷" },
                { id: "16", label: "سری ۱۶" },
              ] as const
            ).map((s) => {
              const active = selectedSeriesFilter === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setSelectedSeriesFilter(active && s.id !== "all" ? "all" : s.id);
                    setSelectedModelFilter("all");
                  }}
                  className={`min-h-[36px] py-1 px-3 rounded-xl text-xs font-semibold border cursor-pointer whitespace-nowrap shrink-0 touch-manipulation ${
                    active
                      ? "bg-white text-neutral-950 border-white font-bold"
                      : "bg-white/[0.04] border-white/[0.08] text-neutral-300"
                  }`}
                >
                  {s.label}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() =>
                setSortOption((prev) =>
                  prev === "default" ? "price-asc" : prev === "price-asc" ? "price-desc" : "default"
                )
              }
              className="min-h-[36px] py-1 px-3 rounded-xl bg-black/40 border border-white/12 text-neutral-200 text-xs font-semibold flex items-center gap-1 whitespace-nowrap shrink-0 mr-auto touch-manipulation"
            >
              <ArrowUpDown className="w-3 h-3 text-neutral-400" />
              <span>
                {sortOption === "default"
                  ? "پرچمدار"
                  : sortOption === "price-asc"
                  ? "ارزان‌ترین"
                  : "گران‌ترین"}
              </span>
            </button>
          </div>

          <AnimatePresence initial={false}>
            {showMobileAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex flex-col gap-3 pt-3 border-t border-white/[0.08]">
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setRegistryFilter("all")}
                      className={`min-h-[36px] rounded-xl text-[11px] font-semibold border ${
                        registryFilter === "all"
                          ? "bg-white text-neutral-950 border-white font-bold"
                          : "bg-white/[0.04] border-white/[0.08] text-neutral-300"
                      }`}
                    >
                      همه ({items.length})
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setRegistryFilter(registryFilter === "with-reg" ? "all" : "with-reg")
                      }
                      className={`min-h-[36px] rounded-xl text-[11px] font-semibold border ${
                        registryFilter === "with-reg"
                          ? "bg-amber-500 text-neutral-950 border-amber-400 font-bold"
                          : "bg-white/[0.04] border-white/[0.08] text-neutral-300"
                      }`}
                    >
                      با رجیستر ({registryCounts.withReg})
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setRegistryFilter(registryFilter === "no-reg" ? "all" : "no-reg")
                      }
                      className={`min-h-[36px] rounded-xl text-[11px] font-semibold border ${
                        registryFilter === "no-reg"
                          ? "bg-emerald-500 text-neutral-950 border-emerald-400 font-bold"
                          : "bg-white/[0.04] border-white/[0.08] text-neutral-300"
                      }`}
                    >
                      بدون رجیستر ({registryCounts.noReg})
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    <button
                      type="button"
                      onClick={() => setSelectedModelFilter("all")}
                      className={`min-h-[36px] px-3 rounded-xl text-xs font-semibold border whitespace-nowrap ${
                        selectedModelFilter === "all"
                          ? "bg-white text-neutral-950 border-white font-bold"
                          : "bg-white/[0.04] border-white/[0.08] text-neutral-300"
                      }`}
                    >
                      همه مدل‌ها
                    </button>
                    {availableModels.map((m) => (
                      <button
                        key={m.name}
                        type="button"
                        dir="ltr"
                        onClick={() =>
                          setSelectedModelFilter(selectedModelFilter === m.name ? "all" : m.name)
                        }
                        className={`min-h-[36px] px-3 rounded-xl text-xs font-semibold border whitespace-nowrap ${
                          selectedModelFilter === m.name
                            ? "bg-white text-neutral-950 border-white font-bold"
                            : "bg-white/[0.04] border-white/[0.08] text-neutral-200"
                        }`}
                      >
                        {m.name} ({m.count})
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedCapacityFilter("all")}
                      className={`min-h-[36px] px-3 rounded-xl text-xs font-semibold border ${
                        selectedCapacityFilter === "all"
                          ? "bg-emerald-500 text-neutral-950 border-emerald-400 font-bold"
                          : "bg-white/[0.04] border-white/[0.08] text-neutral-300"
                      }`}
                    >
                      همه ظرفیت‌ها
                    </button>
                    {availableCapacities.map((cap) => (
                      <button
                        key={cap}
                        type="button"
                        onClick={() =>
                          setSelectedCapacityFilter(selectedCapacityFilter === cap ? "all" : cap)
                        }
                        className={`min-h-[36px] px-3 rounded-xl text-xs font-mono font-semibold border ${
                          selectedCapacityFilter === cap
                            ? "bg-emerald-500 text-neutral-950 border-emerald-400 font-bold"
                            : "bg-white/[0.04] border-white/[0.08] text-neutral-200"
                        }`}
                      >
                        {cap}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    <button
                      type="button"
                      onClick={() => setSelectedColorFilter("all")}
                      className={`min-h-[36px] px-3 rounded-xl text-xs font-semibold border whitespace-nowrap ${
                        selectedColorFilter === "all"
                          ? "bg-white text-neutral-950 border-white font-bold"
                          : "bg-white/[0.04] border-white/[0.08] text-neutral-300"
                      }`}
                    >
                      همه رنگ‌ها
                    </button>
                    {availableColors.map((col) => (
                      <button
                        key={col.name}
                        type="button"
                        onClick={() =>
                          setSelectedColorFilter(selectedColorFilter === col.name ? "all" : col.name)
                        }
                        className={`min-h-[36px] px-3 rounded-xl text-xs font-semibold border flex items-center gap-2 whitespace-nowrap ${
                          selectedColorFilter === col.name
                            ? "bg-white/15 border-emerald-400 text-white"
                            : "bg-white/[0.04] border-white/[0.08] text-neutral-200"
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-white/40 shrink-0"
                          style={{ backgroundColor: col.hex }}
                        />
                        <span>{col.compactName}</span>
                      </button>
                    ))}
                  </div>

                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={resetAllFilters}
                      className="min-h-[38px] w-full rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>پاک کردن همه فیلترها</span>
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* DESKTOP SPLIT ARCHITECTURE (Sticky Sidebar + Multi-Column Product Workspace) */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Desktop Sticky Sidebar Filter Panel (lg+) */}
          <aside
            aria-label="فیلترهای پیشرفته موجودی"
            className="hidden lg:flex flex-col gap-5 w-72 xl:w-80 shrink-0 sticky top-20 rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/[0.10] p-5 max-h-[calc(100dvh-6rem)] overflow-y-auto no-scrollbar"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
                <span>فیلتر موجودی</span>
              </div>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-xs font-semibold text-amber-300 hover:text-amber-200 cursor-pointer inline-flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>پاک کردن</span>
                </button>
              )}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                aria-label="جستجوی مدل، رنگ یا پارت‌نامبر"
                placeholder="جستجو (مثلاً 18، ZA/A، آبی)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full min-h-[42px] py-2 pr-10 pl-9 rounded-xl bg-black/50 border border-white/15 focus:border-emerald-400 text-xs text-white placeholder:text-neutral-500 outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="w-8 h-8 flex items-center justify-center absolute left-1 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white cursor-pointer"
                  aria-label="پاک کردن جستجو"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Registry */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-neutral-300">وضعیت رجیستری</span>
              <div className="flex flex-col gap-1.5">
                {[
                  { id: "all" as const, label: `همه دستگاه‌ها (${items.length})` },
                  { id: "with-reg" as const, label: `با رجیستری رسمی (${registryCounts.withReg})` },
                  { id: "no-reg" as const, label: `بدون رجیستری (${registryCounts.noReg})` },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setRegistryFilter(opt.id);
                      setSelectedModelFilter("all");
                    }}
                    className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-semibold text-right border transition-colors cursor-pointer ${
                      registryFilter === opt.id
                        ? "bg-white text-neutral-950 border-white font-bold"
                        : "bg-white/[0.03] border-white/[0.08] text-neutral-300 hover:bg-white/[0.07]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Series */}
            <div className="flex flex-col gap-2 pt-3 border-t border-white/[0.08]">
              <span className="text-xs font-semibold text-neutral-300">سری آیفون</span>
              <div className="grid grid-cols-2 gap-1.5">
                {(
                  [
                    { id: "all", label: "همه سری‌ها" },
                    { id: "18", label: "سری ۱۸" },
                    { id: "17", label: "سری ۱۷" },
                    { id: "16", label: "سری ۱۶" },
                  ] as const
                ).map((s) => {
                  const active = selectedSeriesFilter === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setSelectedSeriesFilter(active && s.id !== "all" ? "all" : s.id);
                        setSelectedModelFilter("all");
                      }}
                      className={`min-h-[36px] px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                        active
                          ? "bg-white text-neutral-950 border-white font-bold"
                          : "bg-white/[0.03] border-white/[0.08] text-neutral-300 hover:bg-white/[0.07]"
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Models */}
            <div className="flex flex-col gap-2 pt-3 border-t border-white/[0.08]">
              <span className="text-xs font-semibold text-neutral-300">مدل دقیق</span>
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => setSelectedModelFilter("all")}
                  className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-semibold text-right transition-colors cursor-pointer ${
                    selectedModelFilter === "all"
                      ? "bg-white/15 text-white"
                      : "text-neutral-300 hover:bg-white/[0.05]"
                  }`}
                >
                  همه مدل‌ها
                </button>
                {availableModels.map((m) => {
                  const active = selectedModelFilter === m.name;
                  return (
                    <button
                      key={m.name}
                      type="button"
                      onClick={() => setSelectedModelFilter(active ? "all" : m.name)}
                      className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                        active
                          ? "bg-white/15 text-white"
                          : "text-neutral-300 hover:bg-white/[0.05]"
                      }`}
                    >
                      <span dir="ltr">{m.name}</span>
                      <span className="text-[11px] font-mono tabular-nums text-neutral-400">
                        {m.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Capacity */}
            <div className="flex flex-col gap-2 pt-3 border-t border-white/[0.08]">
              <span className="text-xs font-semibold text-neutral-300">ظرفیت حافظه</span>
              <div className="flex flex-wrap gap-1.5">
                {availableCapacities.map((cap) => {
                  const active = selectedCapacityFilter === cap;
                  return (
                    <button
                      key={cap}
                      type="button"
                      onClick={() => setSelectedCapacityFilter(active ? "all" : cap)}
                      className={`min-h-[36px] px-3 py-1 rounded-xl text-xs font-mono font-semibold border transition-colors cursor-pointer ${
                        active
                          ? "bg-emerald-500 text-neutral-950 border-emerald-400 font-bold"
                          : "bg-white/[0.03] border-white/[0.08] text-neutral-300 hover:bg-white/[0.07]"
                      }`}
                    >
                      {cap}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Colors */}
            <div className="flex flex-col gap-2 pt-3 border-t border-white/[0.08]">
              <span className="text-xs font-semibold text-neutral-300">رنگ بدنه</span>
              <div className="flex flex-wrap gap-1.5">
                {availableColors.map((col) => {
                  const active = selectedColorFilter === col.name;
                  return (
                    <button
                      key={col.name}
                      type="button"
                      onClick={() => setSelectedColorFilter(active ? "all" : col.name)}
                      className={`min-h-[34px] px-2.5 py-1 rounded-xl text-[11px] font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${
                        active
                          ? "bg-white/15 border-emerald-400 text-white"
                          : "bg-white/[0.03] border-white/[0.08] text-neutral-300 hover:bg-white/[0.07]"
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-white/40 shrink-0"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span>{col.compactName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Activation Status */}
            <div className="flex flex-col gap-2 pt-3 border-t border-white/[0.08]">
              <span className="text-xs font-semibold text-neutral-300">وضعیت پلمپ</span>
              <div className="grid grid-cols-3 gap-1.5">
                {(
                  [
                    { id: "all", label: "همه" },
                    { id: "not-active", label: "نات‌اکتیو" },
                    { id: "active", label: "اکتیو" },
                  ] as const
                ).map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setActivationFilter(st.id)}
                    className={`min-h-[36px] px-2 py-1 rounded-xl text-[11px] font-semibold border transition-colors cursor-pointer ${
                      activationFilter === st.id
                        ? "bg-white text-neutral-950 border-white font-bold"
                        : "bg-white/[0.03] border-white/[0.08] text-neutral-300 hover:bg-white/[0.07]"
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Catalog Area */}
          <div className="flex-1 min-w-0 w-full flex flex-col gap-4">
            {/* Desktop Toolbar (Result count + View Mode Toggle + Sort) */}
            <div className="hidden md:flex items-center justify-between gap-4 px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
              <div className="flex items-center gap-2 text-xs text-neutral-300 tabular-nums">
                <span className="font-bold text-white">{filteredItems.length}</span>
                <span>کانفیگ موجود</span>
                <span className="text-neutral-600" aria-hidden="true">·</span>
                <span>{groupedByModel.length} مدل آیفون</span>
              </div>

              <div className="flex items-center gap-2">
                {/* Sort Control */}
                <button
                  type="button"
                  onClick={() =>
                    setSortOption((prev) =>
                      prev === "default" ? "price-asc" : prev === "price-asc" ? "price-desc" : "default"
                    )
                  }
                  className="min-h-[38px] px-3 py-1.5 rounded-xl bg-black/40 border border-white/12 text-neutral-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
                  <span>
                    {sortOption === "default"
                      ? "مرتب‌سازی: پرچمدار"
                      : sortOption === "price-asc"
                      ? "مرتب‌سازی: ارزان‌ترین"
                      : "مرتب‌سازی: گران‌ترین"}
                  </span>
                </button>

                {/* View Mode Toggle: Cards vs Comparison Table */}
                <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/12">
                  <button
                    type="button"
                    onClick={() => setViewMode("cards")}
                    aria-label="نمای کارتی"
                    className={`min-h-[32px] px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap ${
                      viewMode === "cards"
                        ? "bg-white text-neutral-950 font-bold"
                        : "text-neutral-300 hover:text-white"
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>کارتی</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("table")}
                    aria-label="نمای جدولی مقایسه‌ای"
                    className={`min-h-[32px] px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap ${
                      viewMode === "table"
                        ? "bg-white text-neutral-950 font-bold"
                        : "text-neutral-300 hover:text-white"
                    }`}
                  >
                    <Table2 className="w-3.5 h-3.5" />
                    <span>جدولی</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Empty State */}
            {groupedByModel.length === 0 ? (
              <div className="flex flex-col items-center text-center py-14 px-4 rounded-3xl bg-white/[0.04] border border-white/[0.08] gap-3 animate-fadeIn">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-neutral-300">
                  <Search className="w-5 h-5" />
                </div>
                <h2 className="text-base font-bold text-white">دستگاهی با این فیلتر یافت نشد</h2>
                <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
                  فیلترها را پاک کنید یا کانفیگ دلخواه خود را در صف انتظار VIP ثبت کنید تا به محض موجود شدن با شما تماس بگیریم.
                </p>
                <div className="flex items-center gap-2.5 mt-2">
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="min-h-[42px] px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold cursor-pointer transition-colors"
                  >
                    نمایش کل موجودی
                  </button>
                  <Link
                    href="/?tab=waitlist#services"
                    className="min-h-[42px] px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold transition-colors inline-flex items-center"
                  >
                    ثبت در صف VIP
                  </Link>
                </div>
              </div>
            ) : viewMode === "table" ? (
              /* DESKTOP COMPARISON TABLE VIEW */
              <div className="hidden md:block w-full rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.10] overflow-hidden animate-fadeIn">
                <div className="overflow-x-auto">
                  <table className="w-full text-right border-collapse">
                    <thead>
                      <tr className="border-b border-white/[0.08] text-[11px] font-semibold text-neutral-400 bg-black/30">
                        <th className="py-3.5 px-4">مدل و رنگ</th>
                        <th className="py-3.5 px-3">ظرفیت</th>
                        <th className="py-3.5 px-3">پارت‌نامبر</th>
                        <th className="py-3.5 px-3">وضعیت پلمپ</th>
                        <th className="py-3.5 px-3">رجیستری</th>
                        <th className="py-3.5 px-3">قیمت نقدی</th>
                        <th className="py-3.5 px-4 text-left">اقدام</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06] text-xs">
                      {filteredItems.map((item) => {
                        const { modelName, extractedColor } = parseModelAndColor(item.model, item.color);
                        const colorMeta = getColorMeta(extractedColor, modelName);
                        const partInfo = getPartCountry(item);
                        const actMeta = getActivationMeta(item.condition);
                        const regMeta = getRegistryMeta(item.registry);
                        const { formatted } = formatPrice(item.price);

                        return (
                          <tr
                            key={item.item_id}
                            onClick={() => setInspectedItem(item)}
                            className="hover:bg-white/[0.05] transition-colors cursor-pointer group"
                          >
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <span
                                  className="w-3 h-3 rounded-full border border-white/30 shrink-0"
                                  style={{ backgroundColor: colorMeta.hex }}
                                />
                                <div className="flex flex-col">
                                  <span className="font-bold text-white" dir="ltr">
                                    {modelName}
                                  </span>
                                  <span className="text-[11px] text-neutral-400">{colorMeta.compactName}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-3 font-mono font-bold text-neutral-200 tabular-nums">
                              {item.capacity}
                            </td>
                            <td className="py-3.5 px-3 text-neutral-300" dir="ltr">
                              <span className="inline-block text-right">
                                {partInfo.flag} {partInfo.code}
                              </span>
                            </td>
                            <td className="py-3.5 px-3">
                              <span className={actMeta.isNotActive ? "text-emerald-300 font-medium" : "text-sky-300 font-medium"}>
                                {actMeta.shortLabel}
                              </span>
                            </td>
                            <td className="py-3.5 px-3">
                              <span className={regMeta.isRegistered ? "text-amber-300 font-medium" : "text-neutral-400"}>
                                {regMeta.shortLabel}
                              </span>
                            </td>
                            <td className="py-3.5 px-3 font-extrabold text-white tabular-nums whitespace-nowrap">
                              {formatted}
                            </td>
                            <td className="py-3.5 px-4 text-left">
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-300 group-hover:text-emerald-200 whitespace-nowrap">
                                <span>بررسی و رزرو</span>
                                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* GROUPED CATALOG: Mobile compact rows (< md) + Desktop 2-3 col Studio Grid (md+) */
              <div className="flex flex-col gap-5">
                {groupedByModel.map((group) => (
                  <article
                    key={group.modelName}
                    className="w-full rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.10] p-4 sm:p-5 flex flex-col gap-4 animate-fadeIn"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex items-center -space-x-2 space-x-reverse shrink-0">
                          {group.previewPhotos.map((src, idx) => (
                            <div
                              key={src}
                              style={{ zIndex: 10 - idx }}
                              className="w-8 h-11 rounded-lg overflow-hidden border border-white/20 bg-neutral-900 shrink-0"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={src}
                                alt={group.modelName}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-col min-w-0">
                          <h2
                            className="text-base sm:text-lg font-extrabold text-white tracking-tight truncate"
                            dir="ltr"
                          >
                            {group.modelName}
                          </h2>
                          <span className="text-xs text-neutral-400 tabular-nums">
                            {group.items.length} کانفیگ آماده تحویل
                          </span>
                        </div>
                      </div>

                      {group.minPrice < Infinity && (
                        <div className="flex flex-col items-end shrink-0">
                          <span className="text-[10px] text-neutral-400">شروع قیمت از</span>
                          <span className="text-xs sm:text-sm font-bold text-emerald-300 tabular-nums">
                            {group.minPrice.toLocaleString("en-US")} تومان
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Mobile rows */}
                    <div className="flex flex-col gap-2 md:hidden">
                      {group.items.map((item) => (
                        <InventoryCard
                          key={item.item_id}
                          item={item}
                          variant="row"
                          onInspect={setInspectedItem}
                        />
                      ))}
                    </div>

                    {/* Desktop 2-3 column Studio Product Cards */}
                    <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-3 gap-3.5">
                      {group.items.map((item) => (
                        <InventoryCard
                          key={item.item_id}
                          item={item}
                          variant="card"
                          onInspect={setInspectedItem}
                        />
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Bottom VIP Bar (Mobile Only) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden" dir="rtl">
        <div className="bg-[#08080a]/92 backdrop-blur-2xl border-t border-white/12 px-4 pt-2.5 pb-safe flex items-center justify-between gap-2 shadow-[0_-8px_28px_rgba(0,0,0,0.65)]">
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-white truncate">مدل خاص دیگری مدنظر دارید؟</span>
            <span className="text-[10.5px] text-amber-300 truncate">ثبت رایگان در صف VIP</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Link
              href="/?tab=waitlist#services"
              className="min-h-[42px] flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold active:scale-95 transition-all whitespace-nowrap touch-manipulation"
            >
              <Target className="w-3.5 h-3.5" />
              <span>صف VIP</span>
            </Link>
            <a
              href={config.contact.telegramExpertUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-[42px] h-[42px] flex items-center justify-center rounded-xl bg-sky-500/15 border border-sky-400/30 text-sky-300 active:scale-95 transition-all touch-manipulation"
              aria-label="ارتباط با کارشناس تلگرام"
            >
              <Send className="w-4 h-4" />
            </a>
            <a
              href={config.contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-[42px] h-[42px] flex items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 active:scale-95 transition-all touch-manipulation"
              aria-label="ارتباط با کارشناس واتساپ"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {inspectedItem && (
          <TechnicalInspectionSheet
            item={inspectedItem}
            onClose={() => setInspectedItem(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
