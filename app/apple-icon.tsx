import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * Apple Touch Icon — ícone usado quando o usuário adiciona o PWA
 * à tela inicial do iPhone/iPad.
 */
export default function AppleIcon() {
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
    size,
  );
}
