import sharp from "sharp";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const directory = path.join(root, "public/images/paisagens");
const sources = JSON.parse(await readFile(path.join(root, "src/data/paisagens-fontes.json"), "utf8"));
const generated = {};
const widths = [480, 768, 1080, 1600, 2400];
await mkdir(directory, { recursive: true });
for (const photo of sources) {
  // Pass --preparar /path/to/downloaded/originals once to retain a 2400px local master.
  const prepare = process.argv.indexOf("--preparar");
  const master = path.join(directory, `${photo.id}.jpg`);
  if (prepare !== -1) {
    await sharp(path.join(process.argv[prepare + 1], `${photo.id}.jpg`)).rotate()
      .resize({ width: 2400, withoutEnlargement: true }).jpeg({ quality: 92, mozjpeg: true }).toFile(master);
  }
  const metadata = await sharp(master).metadata();
  const blur = await sharp(master).resize({ width: 24 }).jpeg({ quality: 45 }).toBuffer();
  generated[photo.id] = { largura: metadata.width, altura: metadata.height, blurDataURL: `data:image/jpeg;base64,${blur.toString("base64")}` };
  for (const width of widths) {
    const pipeline = sharp(master).resize({ width, withoutEnlargement: true });
    // Keep mobile delivery <=150KB per image, adjusting quality only when needed.
    for (const [format, initialQuality] of [["avif", 58], ["webp", 78], ["jpeg", 80]]) {
      let quality = initialQuality;
      let buffer;
      do {
        buffer = await pipeline.clone().toFormat(format, { quality, ...(format === "jpeg" ? { mozjpeg: true } : {}) }).toBuffer();
        if (width > 1080 || buffer.length <= 150 * 1024) break;
        quality -= 5;
      } while (quality >= 30);
      if (width <= 1080 && buffer.length > 150 * 1024) throw new Error(`Mobile budget exceeded: ${photo.id} ${width} ${format}`);
      await writeFile(path.join(directory, `${photo.id}-${width}.${format === "jpeg" ? "jpg" : format}`), buffer);
    }
  }
  console.log(`✓ ${photo.id}`);
}
await writeFile(path.join(root, "src/data/paisagens-geradas.json"), JSON.stringify(generated, null, 2) + "\n");
