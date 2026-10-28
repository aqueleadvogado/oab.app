import "server-only";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function enviarBoasVindasPagamento(input: {
  email: string;
  nome: string | null;
}) {
  const nome = input.nome ?? "Estudante";

  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM || "noreply@oab.app.br",
      to: input.email,
      subject: "Bem-vindo ao OAB em Blocos! 🎓",
      html: `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; color: #333; line-height: 1.6;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1>Oi, ${nome}!</h1>
    <p>Sua assinatura foi confirmada com sucesso. Bem-vindo ao <strong>OAB em Blocos</strong>.</p>

    <p>Você agora tem acesso a:</p>
    <ul>
      <li>Trilha completa das 13 disciplinas da 1ª fase</li>
      <li>Blocos de 10 a 25 minutos com cronômetro visível</li>
      <li>Revisão espaçada por algoritmo SM-2</li>
      <li>Questões reais da FGV classificadas por tópico</li>
      <li>Modo adaptativo por nível de energia</li>
    </ul>

    <p>
      <a href="https://oab.app.br/trilha" style="display: inline-block; padding: 10px 20px; background-color: #0066cc; color: white; text-decoration: none; border-radius: 6px;">
        Começar a estudar agora
      </a>
    </p>

    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">

    <p style="font-size: 12px; color: #666;">
      OAB em Blocos é plataforma independente, sem vínculo com CFOAB ou FGV.
      <br/>
      Dúvidas? Responda este e-mail ou fale com a gente em suporte@oab.app.br
    </p>
  </div>
</body>
</html>
      `,
    });

    if (result.error) {
      console.warn("[Resend] falha ao enviar boas-vindas:", result.error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("[Resend] erro ao enviar boas-vindas:", err);
    return false;
  }
}
