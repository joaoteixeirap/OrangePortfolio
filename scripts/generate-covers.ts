// Gera as capas dos projetos do seed em supabase/seed/covers/<slug>.jpg.
// Uso: pnpm seed:covers  (só é preciso rodar de novo se mudar os templates)

import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { PEOPLE } from "./seed-data";
import { H, W } from "./covers/templates";

const OUT = path.join(process.cwd(), "supabase", "seed", "covers");

async function main() {
  await mkdir(OUT, { recursive: true });
  for (const person of PEOPLE) {
    for (const project of person.projects) {
      const file = path.join(OUT, `${project.slug}.jpg`);
      // Renderiza em 2x e reduz para bordas suaves.
      await sharp(Buffer.from(project.cover()), { density: 144 })
        .resize(W, H)
        .jpeg({ quality: 86, mozjpeg: true })
        .toFile(file);
      console.log("✓", path.relative(process.cwd(), file));
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
