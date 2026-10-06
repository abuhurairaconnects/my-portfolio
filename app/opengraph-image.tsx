import { ImageResponse } from "next/og";
import { getPortfolioData } from "@/lib/server/portfolio";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const alt = "Abu Huraira — Full-Stack Web Developer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image(): Promise<ImageResponse> {
  const portfolio = getPortfolioData();

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0B0F17",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
          border: "2px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "8px",
              background: "#F97316",
              color: "#0B0F17",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            {portfolio.person.monogram}
          </div>
          <div
            style={{
              color: "#F8FAFC",
              fontSize: "26px",
              fontWeight: 600,
              letterSpacing: "-0.5px",
              display: "flex",
            }}
          >
            {portfolio.person.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              color: "#F97316",
              fontSize: "20px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            {portfolio.person.role}
          </div>
          <div
            style={{
              color: "#F8FAFC",
              fontSize: "44px",
              fontWeight: 700,
              lineHeight: 1.2,
              maxWidth: "960px",
              display: "flex",
            }}
          >
            {portfolio.person.tagline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: "24px",
            color: "#94A3B8",
            fontSize: "18px",
          }}
        >
          <div style={{ display: "flex" }}>{portfolio.person.location}</div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#22C55E" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "5px", background: "#22C55E" }} />
            <span>{portfolio.availability.label}</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
