import { ImageResponse } from "next/og";
import { portfolio } from "@/data/portfolio";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 96,
          background: "#0B0F17",
          border: "8px solid #F97316",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#F97316",
          fontWeight: 800,
          borderRadius: 36,
          fontFamily: "system-ui, sans-serif",
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
