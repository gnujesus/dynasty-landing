import React, { useState, useMemo, useEffect } from "react";
import type { Part } from "../lib/types";
import { Search, Filter, MessageSquare, Check, X, Car, Calendar, Tag, ArrowUpDown, ChevronRight } from "lucide-react";

interface CatalogTableProps {
  initialParts: Part[];
  initialMake?: string;
}

const DEFAULT_PART_IMAGE = "/assets/dynasty-logo.png";

export default function CatalogTable({ initialParts, initialMake = "" }: CatalogTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [previewPart, setPreviewPart] = useState<Part | null>(null);
  const [selectedMake, setSelectedMake] = useState<string>(() => {
    if (initialMake && initialMake.trim()) return initialMake.trim().toUpperCase();
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search).get("make");
      return p ? p.trim().toUpperCase() : "all";
    }
    return "all";
  });
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Handle ESC key to close image preview modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreviewPart(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Keep selectedMake in sync with window.location.search on client
  useEffect(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search).get("make");
      if (p && p.trim()) {
        setSelectedMake(p.trim().toUpperCase());
      }
    }
  }, []);

  const handleMakeChange = (newMake: string) => {
    const val = newMake === "all" ? "all" : newMake.toUpperCase();
    setSelectedMake(val);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (val && val !== "all") {
        url.searchParams.set("make", val);
      } else {
        url.searchParams.delete("make");
      }
      window.history.replaceState({}, "", url.toString());
    }
  };

  // Extract all unique vehicle makes and guarantee all core lineage brands are present
  const makesList = useMemo(() => {
    const set = new Set<string>();
    const coreBrands = [
      "AUDI",
      "BMW",
      "CHEVROLET",
      "FORD",
      "HONDA",
      "LINCOLN",
      "MERCEDES-BENZ",
      "PORSCHE",
      "TOYOTA"
    ];
    coreBrands.forEach(b => set.add(b));

    initialParts.forEach(p => {
      p.fitments?.forEach(f => {
        if (f.make) set.add(f.make.toUpperCase());
      });
    });

    if (selectedMake && selectedMake !== "all") {
      set.add(selectedMake.toUpperCase());
    }

    return Array.from(set).sort();
  }, [initialParts, selectedMake]);

  // Extract all unique categories
  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    initialParts.forEach(p => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set).sort();
  }, [initialParts]);

  // Extract unique years
  const yearsList = useMemo(() => {
    const set = new Set<number>();
    initialParts.forEach(p => {
      p.fitments?.forEach(f => {
        if (f.yearFrom) set.add(f.yearFrom);
        if (f.yearTo) set.add(f.yearTo);
      });
    });
    return Array.from(set).sort((a, b) => b - a);
  }, [initialParts]);

  // Filtered Parts
  const filteredParts = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const yearNum = selectedYear !== "all" ? parseInt(selectedYear, 10) : null;

    return initialParts.filter(part => {
      // Vehicle Make filter with robust matching
      if (selectedMake && selectedMake !== "all") {
        const target = selectedMake.trim().toUpperCase();
        const matchesMake = (part.fitments || []).some(f => {
          if (!f.make) return false;
          const fm = f.make.trim().toUpperCase();
          if (fm === target) return true;
          if (fm.includes(target) || target.includes(fm)) return true;
          if (fm.includes("MERCEDES") && target.includes("MERCEDES")) return true;
          return false;
        });
        if (!matchesMake) return false;
      }

      // Year filter
      if (yearNum !== null) {
        const matchesYear = (part.fitments || []).some(f => {
          const from = f.yearFrom ?? 1900;
          const to = f.yearTo ?? 2099;
          return yearNum >= from && yearNum <= to;
        });
        if (!matchesYear) return false;
      }

      // Category filter
      if (selectedCategory !== "all") {
        if ((part.category || "").toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
      }

      // Universal search: name, sku, id, oeNumber, manufacturerNumber, barcode, brand, category, fitments, notes
      if (q) {
        const nameMatch = (part.name || "").toLowerCase().includes(q);
        const skuMatch = (part.sku || "").toLowerCase().includes(q);
        const idMatch = (part.id || "").toLowerCase().includes(q);
        const oeMatch = (part.oeNumber || "").toLowerCase().includes(q);
        const mfgMatch = (part.manufacturerNumber || "").toLowerCase().includes(q);
        const barcodeMatch = (part.barcode || "").toLowerCase().includes(q);
        const brandMatch = (part.brand || "").toLowerCase().includes(q);
        const categoryMatch = (part.category || "").toLowerCase().includes(q);
        const notesMatch = (part.notes || "").toLowerCase().includes(q);

        const fitmentMatch = (part.fitments || []).some(f =>
          (f.make || "").toLowerCase().includes(q) ||
          (f.model || "").toLowerCase().includes(q) ||
          (f.chassis || "").toLowerCase().includes(q) ||
          (f.engine || "").toLowerCase().includes(q)
        );

        return (
          nameMatch ||
          skuMatch ||
          idMatch ||
          oeMatch ||
          mfgMatch ||
          barcodeMatch ||
          brandMatch ||
          categoryMatch ||
          notesMatch ||
          fitmentMatch
        );
      }

      return true;
    });
  }, [initialParts, searchTerm, selectedMake, selectedYear, selectedCategory]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedMake("all");
    setSelectedYear("all");
    setSelectedCategory("all");
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("make");
      window.history.replaceState({}, "", url.toString());
    }
  };

  const hasActiveFilters =
    searchTerm !== "" ||
    (selectedMake !== "" && selectedMake.toLowerCase() !== "all") ||
    selectedYear !== "all" ||
    selectedCategory !== "all";

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Search & Filter Toolbar */}
      <div className="bg-[#121215] border border-white/10 p-5 md:p-6 card-squared">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Universal Search Bar (Works for name, ID, sku, OE, anything) */}
          <div className="md:col-span-5 relative">
            <label className="block text-[10px] font-mono uppercase tracking-widest text-[#c7a12b] mb-1.5 font-bold">
              Búsqueda Inteligente (Nombre, SKU, ID, OE, Modelo...)
            </label>
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Ej. Filtro aceite, B48, 11428583898, Brembo..."
                className="w-full pl-9 pr-8 py-2.5 bg-[#18181c] border border-white/15 focus:border-[#c7a12b] text-white text-xs md:text-sm placeholder:text-neutral-500 transition-colors btn-squared outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 text-neutral-400 hover:text-white p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Vehicle Make Filter */}
          <div className="md:col-span-3">
            <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1.5 font-bold">
              Marca del Vehículo
            </label>
            <select
              value={!selectedMake || selectedMake.toLowerCase() === "all" ? "all" : selectedMake.toUpperCase()}
              onChange={e => handleMakeChange(e.target.value)}
              className="w-full py-2.5 px-3 bg-[#18181c] border border-white/15 focus:border-[#c7a12b] text-white text-xs md:text-sm btn-squared outline-none cursor-pointer"
            >
              <option value="all">Todas las Marcas</option>
              {makesList.map(m => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Vehicle Year Filter */}
          <div className="md:col-span-2">
            <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1.5 font-bold">
              Año
            </label>
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
              className="w-full py-2.5 px-3 bg-[#18181c] border border-white/15 focus:border-[#c7a12b] text-white text-xs md:text-sm btn-squared outline-none cursor-pointer"
            >
              <option value="all">Todos los Años</option>
              {yearsList.map(y => (
                <option key={y} value={y.toString()}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="md:col-span-2">
            <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1.5 font-bold">
              Categoría
            </label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full py-2.5 px-3 bg-[#18181c] border border-white/15 focus:border-[#c7a12b] text-white text-xs md:text-sm btn-squared outline-none cursor-pointer"
            >
              <option value="all">Todas las Categorías</option>
              {categoriesList.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-white/10 text-xs font-mono text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#c7a12b]"></span>
            <span>
              Mostrando <strong className="text-white">{filteredParts.length}</strong> repuestos disponibles
            </span>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 text-[#c7a12b] hover:text-[#dfb93e] underline font-bold cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Limpiar filtros</span>
            </button>
          )}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block w-full overflow-x-auto border border-white/10 bg-[#101013] card-squared shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-[#151519] text-[10px] font-mono uppercase tracking-widest text-neutral-400">
              <th className="py-3.5 px-5">Pieza / Fabricante</th>
              <th className="py-3.5 px-4">Identificadores</th>
              <th className="py-3.5 px-4">Compatibilidad</th>
              <th className="py-3.5 px-4">Disponibilidad</th>
              <th className="py-3.5 px-4 text-right">Precio Ref.</th>
              <th className="py-3.5 px-5 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-xs">
            {filteredParts.length > 0 ? (
              filteredParts.map(part => {
                const waMessage = `¡Hola Dynasty Workshop! Deseo ordenar la siguiente pieza del catálogo: ${part.name} (SKU: ${part.sku}, OE: ${part.oeNumber || "N/A"}). Precio: RD$ ${part.price.toLocaleString()}. ¿Tienen disponibilidad inmediata?`;
                const waLink = `https://wa.me/18294627157?text=${encodeURIComponent(waMessage)}`;

                return (
                  <tr
                    key={part.id}
                    className="hover:bg-[#18181d] transition-colors group"
                  >
                    {/* Part Image, Name & Quality */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3.5">
                        <button
                          type="button"
                          onClick={() => setPreviewPart(part)}
                          className="relative w-12 h-12 rounded-lg bg-[#141417] border border-white/10 hover:border-[#c7a12b] p-1 flex items-center justify-center shrink-0 overflow-hidden transition-all group/img cursor-pointer"
                          title="Click para ver imagen de la pieza"
                        >
                          <img
                            src={part.imageUrl || part.image_url || DEFAULT_PART_IMAGE}
                            alt={part.name}
                            className="w-full h-full object-contain transition-transform duration-200 group-hover/img:scale-105"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = DEFAULT_PART_IMAGE;
                            }}
                            loading="lazy"
                          />
                        </button>
                        <div className="min-w-0">
                          <div className="font-bold text-white text-sm group-hover:text-[#c7a12b] transition-colors">
                            {part.name}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] text-neutral-400 font-semibold font-mono">
                              {part.brand || "Dynasty Autoparts"}
                            </span>
                            {part.quality && (
                              <span className="px-1.5 py-0.5 text-[9px] font-mono tracking-wider bg-[#c7a12b]/15 text-[#c7a12b] border border-[#c7a12b]/30">
                                {part.quality}
                              </span>
                            )}
                            {part.category && (
                              <span className="text-[10px] text-neutral-500">
                                • {part.category}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Identifiers */}
                    <td className="py-4 px-4 font-mono">
                      <div className="text-neutral-300 font-semibold">
                        SKU: <span className="text-white">{part.sku}</span>
                      </div>
                      {part.oeNumber && (
                        <div className="text-[11px] text-neutral-400 mt-0.5">
                          OE: <span className="text-[#c7a12b]">{part.oeNumber}</span>
                        </div>
                      )}
                      {part.manufacturerNumber && (
                        <div className="text-[10px] text-neutral-500">
                          MFG: {part.manufacturerNumber}
                        </div>
                      )}
                    </td>

                    {/* Fitment info from DB */}
                    <td className="py-4 px-4">
                      {part.fitments && part.fitments.length > 0 ? (
                        <div className="space-y-1">
                          {part.fitments.slice(0, 2).map((f, i) => (
                            <div key={i} className="text-[11px] text-neutral-300">
                              <span className="font-bold text-white">{f.make}</span> {f.model}{" "}
                              {f.chassis && <span className="text-neutral-400">({f.chassis})</span>}{" "}
                              {f.yearFrom && (
                                <span className="text-[10px] font-mono text-[#c7a12b]">
                                  [{f.yearFrom}{f.yearTo ? `-${f.yearTo}` : ""}]
                                </span>
                              )}
                              {f.engine && (
                                <span className="text-[10px] text-neutral-400 block font-mono">
                                  {f.engine}
                                </span>
                              )}
                            </div>
                          ))}
                          {part.fitments.length > 2 && (
                            <span className="text-[10px] font-mono text-neutral-500">
                              +{part.fitments.length - 2} aplicaciones más
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-neutral-500 text-[11px] italic">
                          Aplicación universal / consultar
                        </span>
                      )}
                    </td>

                    {/* Stock & Location */}
                    <td className="py-4 px-4 font-mono">
                      {part.onHand > 0 ? (
                        <div className="inline-flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          <span>EN STOCK ({part.onHand})</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 text-amber-400 font-bold text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                          <span>BAJO PEDIDO</span>
                        </div>
                      )}
                      <div className="text-[10px] text-neutral-500 mt-0.5">
                        Almacén {part.warehouse || "Principal"}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-4 px-4 text-right font-mono">
                      <div className="text-base font-extrabold text-white">
                        RD$ {part.price.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        USD ${(part.price / 60.5).toFixed(2)} aprox
                      </div>
                    </td>

                    {/* Get Now Button -> WhatsApp */}
                    <td className="py-4 px-5 text-right">
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-squared inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#c7a12b] hover:bg-[#dfb93e] text-black font-extrabold text-xs tracking-wider uppercase transition-all duration-150 shadow-[0_0_15px_rgba(199,161,43,0.3)] hover:shadow-[0_0_20px_rgba(199,161,43,0.5)] whitespace-nowrap cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>GET NOW</span>
                      </a>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center text-neutral-400">
                  <div className="max-w-md mx-auto space-y-3">
                    <p className="text-base font-semibold text-white">
                      No encontramos repuestos que coincidan con tu búsqueda.
                    </p>
                    <p className="text-xs text-neutral-400">
                      Podemos conseguir cualquier pieza para tu vehículo directamente de fábrica.
                    </p>
                    <a
                      href="https://wa.me/18294627157?text=Hola%20Dynasty%20Workshop,%20busco%20una%20pieza%20que%20no%20encontr%C3%A9%20en%20el%20cat%C3%A1logo.%20%C2%BFMe%20pueden%20ayudar?"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-squared inline-flex items-center gap-2 px-5 py-2.5 bg-[#18181c] border border-[#c7a12b] text-[#c7a12b] hover:bg-[#c7a12b] hover:text-black font-bold text-xs tracking-wider uppercase transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>CONSULTAR POR WHATSAPP</span>
                    </a>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="md:hidden space-y-4">
        {filteredParts.length > 0 ? (
          filteredParts.map(part => {
            const waMessage = `¡Hola Dynasty Workshop! Deseo ordenar la siguiente pieza del catálogo: ${part.name} (SKU: ${part.sku}, OE: ${part.oeNumber || "N/A"}). Precio: RD$ ${part.price.toLocaleString()}. ¿Tienen disponibilidad inmediata?`;
            const waLink = `https://wa.me/18294627157?text=${encodeURIComponent(waMessage)}`;

            return (
              <div
                key={part.id}
                className="bg-[#121215] border border-white/10 p-5 card-squared flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono text-[#c7a12b] font-bold bg-[#c7a12b]/15 px-2 py-0.5 border border-[#c7a12b]/30">
                      {part.quality || "OE"}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {part.onHand > 0 ? `EN STOCK (${part.onHand})` : "BAJO PEDIDO"}
                    </span>
                  </div>

                  <div className="flex items-start gap-3.5 mb-3">
                    <button
                      type="button"
                      onClick={() => setPreviewPart(part)}
                      className="w-16 h-16 rounded-lg bg-[#18181d] border border-white/10 hover:border-[#c7a12b] p-1 flex items-center justify-center shrink-0 overflow-hidden cursor-pointer transition-colors"
                      title="Click para ver imagen de la pieza"
                    >
                      <img
                        src={part.imageUrl || part.image_url || DEFAULT_PART_IMAGE}
                        alt={part.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = DEFAULT_PART_IMAGE;
                        }}
                        loading="lazy"
                      />
                    </button>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-bold text-white mb-1 leading-snug">
                        {part.name}
                      </h3>
                      <div className="text-xs font-mono text-neutral-400">
                        {part.brand} • SKU: <span className="text-white">{part.sku}</span>
                        {part.oeNumber && <span> • OE: {part.oeNumber}</span>}
                      </div>
                    </div>
                  </div>

                  {part.fitments && part.fitments.length > 0 && (
                    <div className="text-xs text-neutral-300 bg-[#18181d] p-2.5 border border-white/5 mb-3 font-mono">
                      <span className="text-neutral-500 block text-[10px]">APLICACIÓN:</span>
                      {part.fitments.map((f, idx) => (
                        <div key={idx}>
                          {f.make} {f.model} {f.chassis} ({f.yearFrom}-{f.yearTo || "Actual"})
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono text-neutral-500 block">PRECIO</span>
                    <span className="text-lg font-black text-white font-mono">
                      RD$ {part.price.toLocaleString()}
                    </span>
                  </div>

                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-squared inline-flex items-center gap-2 px-5 py-2.5 bg-[#c7a12b] text-black font-extrabold text-xs tracking-wider uppercase shadow-lg"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>GET NOW</span>
                  </a>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-[#121215] border border-white/10 p-8 text-center text-neutral-400 card-squared">
            <p className="text-sm font-semibold text-white mb-2">No se encontraron piezas</p>
            <p className="text-xs text-neutral-500 mb-4">Pregúntanos por WhatsApp para asistirte de inmediato.</p>
            <a
              href="https://wa.me/18294627157?text=Hola%20Dynasty%20Workshop,%20busco%20una%20pieza%20para%20mi%20auto."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-squared inline-flex items-center gap-2 px-4 py-2 bg-[#c7a12b] text-black font-bold text-xs"
            >
              <span>WHATSAPP DIRECTO</span>
            </a>
          </div>
        )}
      </div>

      {/* Image Preview Lightbox Modal */}
      {previewPart && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setPreviewPart(null)}
        >
          <div
            className="relative w-full max-w-lg bg-[#121215] border border-[#c7a12b]/40 card-squared p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewPart(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1.5 border border-white/10 hover:border-white/30 rounded bg-[#18181c] transition-colors cursor-pointer"
              aria-label="Cerrar vista previa"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4 pr-10">
              <div className="inline-flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#c7a12b] font-bold">
                  {previewPart.brand || "Dynasty Autoparts"}
                </span>
                {previewPart.quality && (
                  <span className="px-1.5 py-0.5 text-[9px] font-mono tracking-wider bg-[#c7a12b]/15 text-[#c7a12b] border border-[#c7a12b]/30">
                    {previewPart.quality}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-white leading-snug">
                {previewPart.name}
              </h3>
            </div>

            <div className="w-full h-64 sm:h-72 rounded-xl bg-[#0a0a0c] border border-white/10 p-4 flex items-center justify-center overflow-hidden mb-4">
              <img
                src={previewPart.imageUrl || previewPart.image_url || DEFAULT_PART_IMAGE}
                alt={previewPart.name}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DEFAULT_PART_IMAGE;
                }}
              />
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-2 gap-2 bg-[#18181d] p-3 border border-white/5 text-neutral-300">
                <div>
                  <span className="text-neutral-500 block text-[10px]">SKU:</span>
                  <span className="text-white font-bold">{previewPart.sku}</span>
                </div>
                {previewPart.oeNumber && (
                  <div>
                    <span className="text-neutral-500 block text-[10px]">OE NUMBER:</span>
                    <span className="text-[#c7a12b] font-bold">{previewPart.oeNumber}</span>
                  </div>
                )}
                <div>
                  <span className="text-neutral-500 block text-[10px]">DISPONIBILIDAD:</span>
                  <span className={previewPart.onHand > 0 ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                    {previewPart.onHand > 0 ? `EN STOCK (${previewPart.onHand})` : "BAJO PEDIDO"}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">PRECIO:</span>
                  <span className="text-white font-bold">RD$ {previewPart.price.toLocaleString()}</span>
                </div>
              </div>

              <a
                href={`https://wa.me/18294627157?text=${encodeURIComponent(`¡Hola Dynasty Workshop! Me interesa la pieza: ${previewPart.name} (SKU: ${previewPart.sku}, OE: ${previewPart.oeNumber || "N/A"}). Precio: RD$ ${previewPart.price.toLocaleString()}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-squared w-full inline-flex items-center justify-center gap-2 py-3 bg-[#c7a12b] hover:bg-[#dfb93e] text-black font-extrabold text-xs tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(199,161,43,0.3)] cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>ORDENAR POR WHATSAPP</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
