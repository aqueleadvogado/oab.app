import { ImageResponse } from "next/og";

/**
 * PNG 192x192 para o manifest PWA (Android/Chrome).
 * Rota: /icon-192.png
 */
export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#4168ee",
          color: "white",
          fontSize: 96,
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
    { width: 192, height: 192 },
  );
}
