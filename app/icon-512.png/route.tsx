import { ImageResponse } from "next/og";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#4168ee",
          color: "white",
          fontSize: 260,
          fontWeight: 800,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          letterSpacing: "-0.05em",
        }}
      >
        OB
      </div>
    ),
    { width: 512, height: 512 },
  );
}
