import { ImageResponse } from "next/og";
import { portfolio } from "@/data/portfolio";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 18,
          background: "#F97316",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#0B0F17",
          fontWeight: 800,
          borderRadius: 6,
          fontFamily: "system-ui, sans-serif",
          letterSpacing: "-0.5px",
        }}
      >
        {portfolio.person.monogram}
      </div>
    ),
    {
      ...size,
    }
  );
}
