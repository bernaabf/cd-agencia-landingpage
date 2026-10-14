import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.role} | ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const photo = await readFile(join(process.cwd(), "public/images/hero-carolina.jpg"));
  const src = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#3d2521",
          color: "#fbf8f4",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 64px",
            width: 640,
          }}
        >
          <div style={{ fontSize: 22, letterSpacing: 6, color: "#c8b4a0", textTransform: "uppercase" }}>
            {`${site.role} | ${site.tagline}`}
          </div>
          <div style={{ fontSize: 72, marginTop: 28, lineHeight: 1.08, letterSpacing: 2, fontWeight: 300 }}>
            A SUÍÇA ALÉM DO ROTEIRO.
          </div>
          <div style={{ fontSize: 28, marginTop: 36, letterSpacing: 4, color: "#e6dbd0" }}>
            {site.name.toUpperCase()}
          </div>
        </div>
        <img
          src={src}
          alt=""
          width={560}
          height={630}
          style={{ width: 560, height: 630, objectFit: "cover", objectPosition: "45% 20%" }}
        />
      </div>
    ),
    size,
  );
}
