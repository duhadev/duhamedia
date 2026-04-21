import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Duha Media — CRO & Web Design for Shopify Brands";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
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
          fontFamily: "sans-serif",
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
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            {/* Four-band circle */}
            <div
              style={{
                width: 72,
                height: 72,
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
                fontSize: 42,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              Duha Media
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
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              margin: 0,
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
            paddingTop: 0,
            paddingBottom: 0,
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
    size
  );
}
