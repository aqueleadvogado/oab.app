import { ComponentProps } from "react";

type Tom = "neutro" | "sucesso" | "aviso" | "info" | "disciplina";

type TagProps = ComponentProps<"span"> & {
  tom?: Tom;
  cor?: string; // nome do token de cor (ex.: "etica") quando tom === "disciplina"
};

const tons: Record<Exclude<Tom, "disciplina">, string> = {
  neutro: "bg-lavender text-navy",
  sucesso: "bg-mint text-navy",
  aviso: "bg-amber-100 text-amber-900",
  info: "bg-blue text-white",
};

export function Tag({
  tom = "neutro",
  cor,
  className = "",
  children,
  style,
  ...props
}: TagProps) {
  const base =
    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold font-display tracking-wide uppercase";

  if (tom === "disciplina" && cor) {
    // Inline style — classes dinâmicas tipo `bg-${cor}` não sobrevivem ao build do Tailwind 4.
    return (
      <span
        className={`${base} text-navy ${className}`}
        style={{ background: `var(--color-${cor})`, ...style }}
        {...props}
      >
        {children}
      </span>
    );
  }

  const tomFinal = tom === "disciplina" ? "neutro" : tom;
  return (
    <span
      className={`${base} ${tons[tomFinal]} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </span>
  );
}
