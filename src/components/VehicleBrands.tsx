import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Phone, Mail, ArrowUpRight } from "lucide-react";
import { WhatsAppIcon, InstagramIcon, YouTubeIcon, LinktreeIcon } from "./SocialIcons";

interface BrandItem {
  id: string;
  name: string;
  category: string;
  subtitle: string;
  description: string;
  origin: "Alemania" | "Japón" | "EE.UU.";
}

const BRANDS: BrandItem[] = [
  {
    id: "ford",
    name: "FORD",
    category: "American",
    subtitle: "EcoBoost & Heavy-Duty Powertrain",
    description: "Especialistas en tren motriz americano, turbos EcoBoost y calibración electrónica certificada.",
    origin: "EE.UU."
  },
  {
    id: "bmw",
    name: "BMW",
    category: "German",
    subtitle: "M-Power & Precision Bavarian Engineering",
    description: "Ingeniería bávara M-Power: diagnóstico ISTA, repuestos OE Supplier y puesta a punto de alta precisión.",
    origin: "Alemania"
  },
  {
    id: "lincoln",
    name: "LINCOLN",
    category: "American Luxury",
    subtitle: "Luxury Craftsmanship & Advanced Dynamics",
    description: "Servicio exclusivo para SUV y sedanes Lincoln: confort supremo, suspensión adaptativa y refacciones genuinas.",
    origin: "EE.UU."
  },
  {
    id: "mercedes",
    name: "MERCEDES-BENZ",
    category: "German Luxury",
    subtitle: "AMG & Luxury Touring Vehicles",
    description: "Diagnóstico computarizado de concesionario para estrellas AMG, suspensión Airmatic y transmisiones 9G-Tronic.",
    origin: "Alemania"
  },
  {
    id: "toyota",
    name: "TOYOTA",
    category: "Japanese",
    subtitle: "Enduring Reliability & Genuine OE Parts",
    description: "Mantenimiento integral y piezas originales para Land Cruiser, 4Runner, Hilux, Tacoma y Corolla con máxima longevidad.",
    origin: "Japón"
  },
  {
    id: "porsche",
    name: "PORSCHE",
    category: "German High Performance",
    subtitle: "Stuttgart Motorsport Heritage",
    description: "Mecánica de alto rendimiento para 911, Cayenne, Macan y Panamera: mantenimiento preventivo y calibración PDK.",
    origin: "Alemania"
  },
  {
    id: "chevrolet",
    name: "CHEVROLET",
    category: "American",
    subtitle: "V8 Small-Block & Heavy-Duty Muscle",
    description: "Potencia americana para Silverado, Tahoe, Suburban y Camaro: refacciones de suspensión, motor y transmisión.",
    origin: "EE.UU."
  },
  {
    id: "honda",
    name: "HONDA",
    category: "Japanese",
    subtitle: "VTEC & Earth Dreams Technology",
    description: "Afinamiento VTEC de alta precisión, Civic, Accord y CR-V: repuestos con tolerancias milimétricas de fábrica.",
    origin: "Japón"
  },
  {
    id: "audi",
    name: "AUDI",
    category: "German",
    subtitle: "Quattro All-Wheel Drive & TFSI",
    description: "Tracción quattro, turbocompresores TFSI y componentes de suspensión deportiva con certificación OE de nivel concesionario.",
    origin: "Alemania"
  }
];

// Video configuration - easily updated per user request
const DEFAULT_VIDEO_URL = "/videos/hero-video.mp4";

export default function VehicleBrands() {
  const [activeBrandId, setActiveBrandId] = useState<string>("lincoln");
  const [videoHovered, setVideoHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const activeBrand = BRANDS.find(b => b.id === activeBrandId) || BRANDS[2];

  return (
    <section
      id="marcas"
      className="relative w-full min-h-screen bg-[#0a0a0c] text-white py-16 px-4 md:px-12 flex flex-col justify-between overflow-hidden select-none border-t border-b border-white/10"
    >
      {/* Background 3D Globe / Visual Sphere & Ambient Video Display */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0 opacity-40">
        {/* Globe Silhouette / Radial automotive globe glow */}
        <div className="relative w-[340px] md:w-[650px] lg:w-[820px] aspect-square rounded-full border border-white/10 shadow-[0_0_120px_rgba(199,161,43,0.15)] flex items-center justify-center overflow-hidden bg-black/50">
          {/* Internal Video Projection (Playing YouTube video cuts seamlessly) */}
          <video
            ref={videoRef}
            src={DEFAULT_VIDEO_URL}
            autoPlay
            loop
            muted
            playsInline
            className={`w-full h-full object-cover filter contrast-125 transition-all duration-700 ${
              videoHovered ? "opacity-95 scale-105 saturate-125" : "opacity-60 scale-100 grayscale-[40%]"
            }`}
          />
          {/* Radial mask creating the sphere silhouette from the reference image */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,#0a0a0c_90%)]" />
          <div className="absolute inset-0 border border-white/15 rounded-full" />
        </div>
      </div>

      {/* Top Section Rail */}
      <div className="relative z-10 flex items-center justify-between pb-8 border-b border-white/10">
        <div className="flex items-center gap-3">
          <img
            src="/assets/dynasty-logo.png"
            alt="Dynasty Workshop"
            className="w-9 h-9 object-contain filter drop-shadow-[0_2px_8px_rgba(199,161,43,0.5)]"
          />
          <span className="font-mono text-xs tracking-[0.2em] text-[#c7a12b] font-bold uppercase">
            DYNASTY // LINEAJE DE VEHÍCULOS
          </span>
        </div>

        <nav className="flex items-center gap-5 md:gap-8 font-mono text-[11px] tracking-widest uppercase">
          <a href="#nosotros" className="text-white/60 hover:text-white transition-colors">
            NOSOTROS
          </a>
          <a href="#servicios" className="text-white/60 hover:text-white transition-colors">
            SERVICIOS
          </a>
          <a href="#asesoria" className="text-white/60 hover:text-[#c7a12b] transition-colors">
            ASESORÍA
          </a>
          <a href="/catalog" className="text-[#c7a12b] hover:text-[#dfb93e] font-bold transition-colors">
            CATÁLOGO
          </a>
          <a href="#contacto" className="text-white/60 hover:text-white transition-colors">
            CONTACTO
          </a>
        </nav>
      </div>

      {/* Main Content Area with Left Rail + Brand List */}
      <div className="relative z-10 grid grid-cols-12 gap-4 my-auto py-8 items-center">
        {/* Left Social & Contact Rail (Exact replica of reference image) */}
        <aside className="col-span-1 hidden lg:flex flex-col items-center justify-center gap-7 text-white/40">
          <a
            href="https://wa.me/18298126993"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:text-[#c7a12b] hover:scale-110 transition-all"
            title="WhatsApp Dynasty"
          >
            <WhatsAppIcon className="w-4 h-4" />
          </a>
          <a
            href="https://www.instagram.com/dynasty_autoparts"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:text-[#c7a12b] hover:scale-110 transition-all"
            title="Instagram Dynasty Auto Parts (@dynasty_autoparts)"
          >
            <InstagramIcon className="w-4 h-4" />
          </a>
          <a
            href="https://linktr.ee/carspartssolutions"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:text-[#c7a12b] hover:scale-110 transition-all"
            title="Linktree Cars Parts Solutions"
          >
            <LinktreeIcon className="w-4 h-4" />
          </a>
          <a
            href="https://www.youtube.com/watch?v=2-r8A3A8YKA"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:text-[#c7a12b] hover:scale-110 transition-all"
            title="Video Reel YouTube"
          >
            <YouTubeIcon className="w-4 h-4" />
          </a>
          <a
            href="mailto:dynastyrm18@gmail.com"
            className="p-2 hover:text-[#c7a12b] hover:scale-110 transition-all"
            title="Email"
          >
            <Mail className="w-4 h-4" />
          </a>
          <a
            href="tel:+18298126993"
            className="p-2 hover:text-[#c7a12b] hover:scale-110 transition-all"
            title="Llamar"
          >
            <Phone className="w-4 h-4" />
          </a>
        </aside>

        {/* Brand Typographic Rows (Replicating Image Layout) */}
        <div className="col-span-12 lg:col-span-11 flex flex-col w-full">
          {BRANDS.map((brand, idx) => {
            const isActive = activeBrandId === brand.id;

            return (
              <div
                key={brand.id}
                onMouseEnter={() => {
                  setActiveBrandId(brand.id);
                  setVideoHovered(true);
                }}
                onMouseLeave={() => setVideoHovered(false)}
                className="relative group cursor-pointer border-t border-white/10 last:border-b"
              >
                {/* Gold Highlight Bar that sweeps from Left to Right on Hover */}
                {isActive && (
                  <motion.div
                    layoutId="activeBrandHighlight"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 32,
                      mass: 0.7
                    }}
                    style={{ transformOrigin: "left" }}
                    className="absolute inset-0 bg-[#c7a12b] z-0"
                  />
                )}

                {/* Brand Row Content */}
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between px-4 md:px-8 py-3.5 md:py-4 transition-colors duration-200">
                  {/* Big Bold Typographic Brand Name */}
                  <div className="flex items-baseline gap-4">
                    <span
                      className={`text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight font-sans transition-colors duration-150 ${
                        isActive ? "text-[#0a0a0c]" : "text-white/80 group-hover:text-white"
                      }`}
                    >
                      {brand.name}
                    </span>
                    <span
                      className={`text-[10px] font-mono uppercase tracking-widest hidden sm:inline ${
                        isActive ? "text-black/70 font-bold" : "text-white/30"
                      }`}
                    >
                      [{brand.origin}]
                    </span>
                  </div>

                  {/* Right Side Info: Shows details when row is active */}
                  <div className="mt-2 md:mt-0 flex items-center gap-6">
                    {isActive ? (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col md:flex-row md:items-center gap-4 text-left md:text-right max-w-xl"
                      >
                        <p className="text-xs md:text-sm font-semibold text-[#0a0a0c] leading-snug">
                          {brand.description}
                        </p>
                        <a
                          href={`/catalog?make=${encodeURIComponent(brand.name)}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0a0a0c] text-[#c7a12b] hover:text-white text-[11px] font-mono tracking-wider font-bold whitespace-nowrap btn-squared transition-colors"
                        >
                          <span>VER PIEZAS</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      </motion.div>
                    ) : (
                      <span className="text-[11px] font-mono text-white/20 uppercase tracking-widest hidden md:inline">
                        {brand.subtitle}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Rail: Brand slogan */}
      <div className="relative z-10 flex items-center justify-between pt-6 border-t border-white/10 text-[11px] font-mono text-white/50 tracking-widest">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#c7a12b] animate-ping" />
          <span className="text-neutral-400">PASIÓN POR EL MOTOR // REPUESTOS GENUINOS</span>
        </div>
        <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest hidden sm:block">
          ALTO DESEMPEÑO AUTOMOTRIZ
        </div>
      </div>
    </section>
  );
}
