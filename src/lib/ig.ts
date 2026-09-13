import fs from "node:fs";
import path from "node:path";

const DEFAULT_IG_IMAGES = [
  "/assets/ig/1.jpg",
  "/assets/ig/2.jpg",
  "/assets/ig/3.jpg",
  "/assets/ig/4.jpg",
  "/assets/ig/5.jpg",
  "/assets/ig/6.jpg",
  "/assets/ig/7.jpg",
  "/assets/ig/8.jpg"
];

export function getInstagramImages(): string[] {
  // 1. Try build-time Vite glob import (works across Cloudflare / SSR / client)
  try {
    const globFiles = import.meta.glob(
      "../../public/assets/ig/*.{jpg,jpeg,png,webp,avif}",
      { eager: true }
    );
    const keys = Object.keys(globFiles);
    if (keys.length > 0) {
      return keys
        .map(key => {
          const filename = key.split("/").pop();
          return `/assets/ig/${filename}`;
        })
        .sort((a, b) => {
          const numA = parseInt(a.split("/").pop() || "", 10);
          const numB = parseInt(b.split("/").pop() || "", 10);
          if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
          return a.localeCompare(b);
        });
    }
  } catch {
    // Ignore in non-Vite environments
  }

  // 2. Try Node.js fs if available
  try {
    const dirs = [
      path.resolve(process.cwd(), "public/assets/ig"),
      path.resolve(process.cwd(), "src/assets/ig")
    ];

    for (const dir of dirs) {
      if (typeof fs !== "undefined" && typeof fs.existsSync === "function" && fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        const images = files
          .filter(f => /\.(jpe?g|png|webp|avif)$/i.test(f))
          .sort((a, b) => {
            const numA = parseInt(a, 10);
            const numB = parseInt(b, 10);
            if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
            return a.localeCompare(b);
          })
          .map(f => `/assets/ig/${f}`);

        if (images.length > 0) {
          return images;
        }
      }
    }
  } catch {
    // Ignore in sandboxed runtimes
  }

  // 3. Fallback ensuring the gallery is never empty
  return DEFAULT_IG_IMAGES;
}
