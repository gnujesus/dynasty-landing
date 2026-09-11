import fs from "node:fs";
import path from "node:path";

export function getInstagramImages(): string[] {
  const dirs = [
    path.resolve(process.cwd(), "public/assets/ig"),
    path.resolve(process.cwd(), "src/assets/ig")
  ];

  for (const dir of dirs) {
    if (fs.existsSync(dir)) {
      try {
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
      } catch (err) {
        console.error("Error reading IG images directory:", err);
      }
    }
  }

  return [];
}
