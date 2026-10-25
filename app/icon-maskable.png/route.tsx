import { ImageResponse } from "next/og";

/**
 * Ícone "maskable": conteúdo útil fica na "safe zone" central (80% do canvas),
 * para o launcher do Android poder recortar em círculo, squircle etc.
 */
export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#4168ee",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 200,
            fontWeight: 800,
            letterSpacing: "-0.05em",
          }}
        >
          OB
        </div>
      </div>
    ),
    { width: 512, height: 512 },
  );
}
