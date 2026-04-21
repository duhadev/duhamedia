import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Duha Media — CRO & Web Design for Shopify Brands";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadIBMPlexSans(weight: 400 | 700): Promise<ArrayBuffer> {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@${weight}&display=swap`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    }
  ).then((r) => r.text());

  const fontUrl = css.match(/src: url\(([^)]+)\) format\('woff2'\)/)?.[1];
  if (!fontUrl) throw new Error("IBM Plex Sans font URL not found");
  return fetch(fontUrl).then((r) => r.arrayBuffer());
}

export default async function OGImage() {
  const [bold, regular] = await Promise.all([
    loadIBMPlexSans(700),
    loadIBMPlexSans(400),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#0F172A",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "72px 80px",
          fontFamily: "'IBM Plex Sans', sans-serif",
          position: "relative",
        }}
      >
        {/* Left content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            flex: 1,
          }}
        >
          {/* Logo mark + wordmark */}
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {/* Four-band circle */}
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                flexShrink: 0,
              }}
            >
              <div style={{ flex: 1, background: "#fce588" }} />
              <div style={{ flex: 1, background: "#f5c842" }} />
              <div style={{ flex: 1, background: "#e82561" }} />
              <div style={{ flex: 1, background: "#c20e59" }} />
            </div>
            <span
              style={{
                color: "#FFFFFF",
                fontSize: 38,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1,
                fontFamily: "'IBM Plex Sans', sans-serif",
              }}
            >
              duha media
            </span>
          </div>

          {/* Tagline */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <p
              style={{
                color: "rgba(255,255,255,0.9)",
                fontSize: 44,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
                margin: 0,
                maxWidth: 680,
                fontFamily: "'IBM Plex Sans', sans-serif",
              }}
            >
              CRO & Web Design for Shopify Brands
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: 22,
                fontWeight: 400,
                margin: 0,
                letterSpacing: "0.01em",
                fontFamily: "'IBM Plex Sans', sans-serif",
              }}
            >
              Documented. Measured. Proven.
            </p>
          </div>

          {/* URL label */}
          <p
            style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: 16,
              fontWeight: 400,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              margin: 0,
              fontFamily: "'IBM Plex Sans', sans-serif",
            }}
          >
            duhamedia.com
          </p>
        </div>

        {/* Right decorative bars */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            height: "100%",
            alignItems: "stretch",
          }}
        >
          {(
            [
              ["#fce588", "100%"],
              ["#f5c842", "72%"],
              ["#e82561", "52%"],
              ["#c20e59", "36%"],
            ] as [string, string][]
          ).map(([color, height], i) => (
            <div
              key={i}
              style={{
                width: 18,
                height,
                background: color,
                borderRadius: 3,
                alignSelf: "flex-end",
              }}
            />
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "IBM Plex Sans", data: bold, weight: 700, style: "normal" },
        { name: "IBM Plex Sans", data: regular, weight: 400, style: "normal" },
      ],
    }
  );
}
