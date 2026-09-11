import React, { useState, useRef, useCallback } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";

interface InstagramShowcaseProps {
  images: string[];
}

export default function InstagramShowcase({ images }: InstagramShowcaseProps) {
  if (!images || images.length === 0) return null;

  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const scrollLockRef = useRef(false);

  const total = images.length;

  const nextCard = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevCard = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Mouse wheel scroll navigation (scroll down/right -> next, scroll up/left -> prev)
  const handleWheel = (e: React.WheelEvent) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) < 18) return;

    if (scrollLockRef.current) return;
    scrollLockRef.current = true;

    if (delta > 0) {
      nextCard();
    } else {
      prevCard();
    }

    setTimeout(() => {
      scrollLockRef.current = false;
    }, 360);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextCard();
      else prevCard();
    }
    setTouchStart(null);
  };

  return (
    <section
      id="proyectos"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full bg-[#0a0a0c] py-28 px-4 md:px-12 overflow-hidden select-none border-b border-white/10"
    >
      {/* Background Ambience Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#c7a12b]/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center max-w-2xl mb-12">
          <div className="inline-flex items-center justify-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 bg-[#c7a12b]"></span>
            <span className="text-xs font-mono tracking-[0.25em] text-[#c7a12b] uppercase font-bold">
              PROYECTOS & RESTAURACIONES // GALERÍA
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight font-sans">
            PROYECTOS & <span className="text-[#c7a12b]">TALLER</span>
          </h2>
          <p className="text-xs md:text-sm text-neutral-400 font-medium mt-2">
            Desliza con el scroll del mouse o usa las flechas para explorar nuestros trabajos en el taller.
          </p>
        </div>

        {/* 3D Coverflow Stage */}
        <div
          className="relative w-full h-[540px] sm:h-[580px] md:h-[620px] flex items-center justify-center"
          style={{ perspective: "1300px" }}
        >
          {/* Navigation Arrow Left */}
          <button
            onClick={prevCard}
            type="button"
            aria-label="Anterior"
            className="absolute left-2 sm:left-6 md:left-12 z-40 w-11 h-11 md:w-13 md:h-13 rounded-full bg-black/70 hover:bg-[#c7a12b] border border-white/20 hover:border-[#c7a12b] text-white hover:text-black flex items-center justify-center backdrop-blur-md transition-all duration-200 cursor-pointer shadow-xl"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* Navigation Arrow Right */}
          <button
            onClick={nextCard}
            type="button"
            aria-label="Siguiente"
            className="absolute right-2 sm:right-6 md:right-12 z-40 w-11 h-11 md:w-13 md:h-13 rounded-full bg-black/70 hover:bg-[#c7a12b] border border-white/20 hover:border-[#c7a12b] text-white hover:text-black flex items-center justify-center backdrop-blur-md transition-all duration-200 cursor-pointer shadow-xl"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* Cards Stack */}
          <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
            {images.map((imgSrc, idx) => {
              let offset = idx - activeIndex;
              if (offset < -Math.floor(total / 2)) offset += total;
              if (offset > Math.floor(total / 2)) offset -= total;

              const isCenter = offset === 0;
              const isLeft = offset === -1;
              const isRight = offset === 1;
              const isVisible = Math.abs(offset) <= 2;

              if (!isVisible) return null;

              let xTrans = "0%";
              let rotateY = 0;
              let scale = 1;
              let zIndex = 30;
              let opacity = 1;

              if (isCenter) {
                xTrans = "0%";
                rotateY = 0;
                scale = 1;
                zIndex = 30;
                opacity = 1;
              } else if (isLeft) {
                xTrans = "-68%";
                rotateY = 38;
                scale = 0.85;
                zIndex = 20;
                opacity = 0.65;
              } else if (isRight) {
                xTrans = "68%";
                rotateY = -38;
                scale = 0.85;
                zIndex = 20;
                opacity = 0.65;
              } else if (offset < -1) {
                xTrans = "-115%";
                rotateY = 48;
                scale = 0.72;
                zIndex = 10;
                opacity = 0.2;
              } else if (offset > 1) {
                xTrans = "115%";
                rotateY = -48;
                scale = 0.72;
                zIndex = 10;
                opacity = 0.2;
              }

              const waMsg = `Hola Dynasty Workshop, deseo cotizar un proyecto similar al trabajo #${idx + 1} de su galería de proyectos.`;

              return (
                <motion.div
                  key={imgSrc}
                  onClick={() => setActiveIndex(idx)}
                  animate={{
                    x: xTrans,
                    rotateY,
                    scale,
                    opacity,
                    zIndex
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 26,
                    mass: 0.8
                  }}
                  style={{
                    transformStyle: "preserve-3d",
                    transformOrigin: "center center"
                  }}
                  className={`absolute w-[280px] sm:w-[340px] md:w-[380px] h-[480px] sm:h-[530px] md:h-[560px] rounded-3xl overflow-hidden bg-black border transition-shadow duration-300 cursor-pointer ${
                    isCenter
                      ? "border-[#c7a12b]/60 shadow-[0_25px_60px_rgba(0,0,0,0.9)] ring-1 ring-[#c7a12b]/30"
                      : "border-white/10 hover:border-white/30 shadow-2xl brightness-90"
                  }`}
                >
                  {/* Full Image Covering Whole Card */}
                  <img
                    src={imgSrc}
                    alt={`Proyecto Dynasty #${idx + 1}`}
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      isCenter ? "scale-105" : "scale-100"
                    }`}
                  />

                  {/* Gradient Vignette Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />

                  {/* Badge at Top Right - Kept as requested */}
                  <div className="absolute top-4 right-4 font-mono text-[10px] text-white/80 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded border border-white/15 shadow-md">
                    {idx + 1} / {total}
                  </div>

                  {/* Bottom Blur Overlay: Cotizar Proyecto & Pagination */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 bg-black/60 backdrop-blur-md border-t border-white/10 flex flex-col items-center gap-3">
                    {/* Dots Indicator */}
                    <div className="flex items-center gap-1.5">
                      {images.map((_, dotIdx) => (
                        <span
                          key={dotIdx}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            dotIdx === activeIndex
                              ? "w-5 bg-[#c7a12b]"
                              : "w-1.5 bg-white/30"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Action Link: Cotizar Proyecto */}
                    <a
                      href={`https://wa.me/18294627157?text=${encodeURIComponent(waMsg)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="btn-squared w-full inline-flex items-center justify-center gap-2 py-3 bg-[#c7a12b] hover:bg-[#dfb93e] text-black font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(199,161,43,0.3)] hover:shadow-[0_0_20px_rgba(199,161,43,0.5)]"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>COTIZAR PROYECTO</span>
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
