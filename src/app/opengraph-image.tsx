import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const alt = "Streambe | Portfolio de proyectos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Imagen que se ve al compartir el link por WhatsApp, LinkedIn, etc.
 * Se genera sola con la marca de Streambe (1200x630).
 */
export default async function OpengraphImage() {
  let logoSrc: string | null = null;
  try {
    const svg = await readFile(path.join(process.cwd(), "public", "streambe-logo.svg"));
    logoSrc = `data:image/svg+xml;base64,${svg.toString("base64")}`;
  } catch {
    logoSrc = null; // si no se encuentra el logo, usamos texto
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #10192B 0%, #0B2A6B 58%, #0253E8 100%)",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex" }}>
          {logoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoSrc} width={186} height={64} alt="" />
          ) : (
            <div style={{ display: "flex", fontSize: 52, fontWeight: 700 }}>Streambe</div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 92, fontWeight: 700, lineHeight: 1.05 }}>
            Better tech.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 92,
              fontWeight: 700,
              lineHeight: 1.05,
              color: "#2FB1FE",
            }}
          >
            Better future.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 32,
              fontSize: 32,
              color: "rgba(255,255,255,0.78)",
            }}
          >
            Portfolio de proyectos de Streambe
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
