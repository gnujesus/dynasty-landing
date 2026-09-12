import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ShieldCheck, Wrench, RotateCcw } from "lucide-react";

export default function Hero() {
  const [showLogo, setShowLogo] = useState(false);
  const [showLine, setShowLine] = useState(false);
  const [showText, setShowText] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startAnimationSequence = () => {
    setShowLogo(false);
    setShowLine(false);
    setShowText(false);

    // 1. 4 seconds after video appears: Logo appears in the center
    const t1 = setTimeout(() => {
      setShowLogo(true);
    }, 4000);

    // 2. 0.8s after logo appears (t=4.8s): Vertical line animates top-to-bottom on the right of the logo
    const t2 = setTimeout(() => {
      setShowLine(true);
    }, 4850);

    // 3. 0.7s after line appears (t=5.55s): Text emerges out of the vertical line, pushing logo to the left
    const t3 = setTimeout(() => {
      setShowText(true);
    }, 5550);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  };

  useEffect(() => {
    const cleanup = startAnimationSequence();
    return cleanup;
  }, []);

  return (
    <section className="relative w-full h-screen min-h-[660px] max-h-[1080px] aspect-[16/9] overflow-hidden bg-black flex items-center justify-center select-none">
      {/* Background Video (Seamless cut 00:54-01:03 followed by 00:39-00:54) */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-75 scale-105 transition-transform duration-1000 ease-out"
          src="/videos/hero-video.mp4"
        />
        {/* Dark Cinematic Vignette & Radial Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-black/45 to-black/75" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/50 to-[#0a0a0c]/90" />
        {/* Fine Technical Grid Texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* Top Bar Indicators */}
      <div className="absolute top-6 left-6 md:left-12 z-20 flex items-center gap-3">
        <span className="inline-block w-2.5 h-2.5 bg-[#c7a12b] animate-pulse" />
        <span className="text-[11px] font-mono tracking-[0.25em] text-[#c7a12b] uppercase font-bold">
          DYNASTY WORKSHOP // ALTO DESEMPEÑO & ASESORÍA
        </span>
      </div>

      <div className="absolute top-6 right-6 md:right-12 z-20 flex items-center gap-3">
        {/* Replay Animation Trigger */}
        <button
          onClick={startAnimationSequence}
          type="button"
          title="Repetir animación del logo"
          className="p-2 border border-white/20 hover:border-[#c7a12b] text-white/60 hover:text-[#c7a12b] bg-black/60 backdrop-blur-md transition-all cursor-pointer btn-squared"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Hero Center Unit - Controlled Flex Centering without FLIP distortion */}
      <div className="relative z-10 w-full max-w-6xl px-4 md:px-12 flex items-center justify-center">
        <AnimatePresence>
          {showLogo && (
            <div className="flex flex-row items-center justify-center transition-all duration-700 ease-out">
              {/* 1. LOGO: Appears at center, stays 100% rigid with NO layout distortion */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, filter: "blur(12px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                className="flex-shrink-0 relative select-none"
              >
                <div className="relative p-3 sm:p-4 md:p-6 bg-black/85 border border-[#c7a12b]/40 backdrop-blur-xl shadow-[0_0_50px_rgba(199,161,43,0.22)] w-24 h-24 sm:w-32 sm:h-32 md:w-44 md:h-44 flex items-center justify-center">
                  <img
                    src="/assets/dynasty-logo.png"
                    alt="Dynasty Workshop Logo"
                    className="w-full h-full object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.85)] filter brightness-105 contrast-110"
                  />
                  {/* Subtle Corner Accents */}
                  <div className="absolute -top-[1px] -left-[1px] w-2.5 h-2.5 border-t-2 border-l-2 border-[#c7a12b]" />
                  <div className="absolute -top-[1px] -right-[1px] w-2.5 h-2.5 border-t-2 border-r-2 border-[#c7a12b]" />
                  <div className="absolute -bottom-[1px] -left-[1px] w-2.5 h-2.5 border-b-2 border-l-2 border-[#c7a12b]" />
                  <div className="absolute -bottom-[1px] -right-[1px] w-2.5 h-2.5 border-b-2 border-r-2 border-[#c7a12b]" />
                </div>
              </motion.div>

              {/* 2. VERTICAL LINE: Animates from TOP to BOTTOM on the RIGHT of the logo */}
              <div className="flex items-center justify-center flex-shrink-0 mx-3 sm:mx-4 md:mx-7 h-28 sm:h-36 md:h-48 overflow-hidden">
                {showLine && (
                  <motion.div
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: 1 }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transformOrigin: "top" }}
                    className="w-[2px] h-full bg-gradient-to-b from-transparent via-[#c7a12b] to-transparent shadow-[0_0_15px_#c7a12b]"
                  />
                )}
              </div>

              {/* 3. TEXT: Emerges out of the vertical line from right to left, pushing logo to the left */}
              {showText && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden flex-shrink-0"
                >
                  <motion.div
                    initial={{ x: -50, opacity: 0, filter: "blur(6px)" }}
                    animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
                    transition={{ duration: 0.75, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="w-[260px] sm:w-[380px] md:w-[520px] text-left pr-2 flex flex-col justify-center"
                  >
                    <div className="inline-flex items-center gap-2 mb-2">
                      <span className="h-[1px] w-5 bg-[#c7a12b]" />
                      <span className="text-[10px] md:text-[11px] font-mono uppercase tracking-[0.25em] text-[#c7a12b] font-semibold">
                        PRECISIÓN, REPUESTOS & ASESORÍA AUTOMOTRIZ
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-[0.95] mb-2 md:mb-3 font-sans">
                      DYNASTY <span className="text-[#c7a12b]">WORKSHOP</span>
                    </h1>

                    {/* Short & Catchy Slogan */}
                    <p className="text-xs sm:text-sm md:text-base text-neutral-300 font-medium leading-relaxed mb-4 md:mb-6 max-w-md">
                      Ingeniería de precisión, reparaciones especializadas, repuestos certificados y asesoría técnica para la venta de vehículos.
                    </p>

                    {/* Squared Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3">
                      <a
                        href="/catalog"
                        className="btn-squared inline-flex items-center justify-center gap-2.5 px-5 sm:px-7 py-3 bg-[#c7a12b] hover:bg-[#dfb93e] text-black font-extrabold text-[11px] md:text-xs tracking-widest uppercase transition-all duration-200 shadow-[0_0_25px_rgba(199,161,43,0.45)] hover:shadow-[0_0_35px_rgba(199,161,43,0.65)] hover:-translate-y-0.5"
                      >
                        <span>VER CATÁLOGO</span>
                        <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </a>

                      <a
                        href="https://wa.me/18294627157?text=Hola%20Dynasty%20Workshop,%20deseo%20m%C3%A1s%20informaci%C3%B3n%20sobre%20sus%20servicios,%20repuestos%20y%20asesor%C3%ADa%20de%20veh%C3%ADculos."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-squared hidden sm:inline-flex items-center justify-center gap-2 px-5 py-3 border border-white/20 hover:border-[#c7a12b] text-white hover:text-[#c7a12b] bg-black/60 backdrop-blur-md font-bold text-xs tracking-widest uppercase transition-all duration-200"
                      >
                        <Wrench className="w-3.5 h-3.5 text-[#c7a12b]" />
                        <span>CONSULTA</span>
                      </a>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Sub-bar Indicator */}
      <div className="absolute bottom-6 left-6 md:left-12 right-6 md:right-12 z-20 flex items-center justify-between border-t border-white/10 pt-4 text-[11px] font-mono text-neutral-400 tracking-wider">
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-neutral-500">VEHÍCULOS:</span>
          <span className="text-white font-medium">JAPONESES</span>
          <span className="text-neutral-600">/</span>
          <span className="text-white font-medium">AMERICANOS</span>
          <span className="text-neutral-600">/</span>
          <span className="text-white font-medium">EUROPEOS</span>
        </div>
        <div className="flex items-center gap-2 text-[#c7a12b]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-mono tracking-widest">CALIDAD OE GARANTIZADA</span>
        </div>
      </div>
    </section>
  );
}
