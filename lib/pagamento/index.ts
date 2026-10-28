import "server-only";
import { criarPreferenciaCheckoutPro } from "./mercado-pago";
import {
  criarAssinaturaPendente,
  getAssinaturaAtiva,
  getPlanoPorSlug,
} from "./queries";

/**
 * Abstração de provedor de pagamento. Hoje só Mercado Pago; o dia que entrar Asaas,
 * trocamos aqui dentro sem mexer nas rotas.
 */
export async function iniciarCheckout(input: {
  userId: string;
  email: string;
  nome: string | null;
  planoSlug: string;
  urlBase: string;
}) {
  // 1. Já tem assinatura ativa? Então não cria outra.
  const ativa = await getAssinaturaAtiva(input.userId);
  if (ativa) {
    return {
      jaAssinante: true as const,
      assinatura: ativa,
    };
  }

  // 2. Plano existe?
  const plano = await getPlanoPorSlug(input.planoSlug);
  if (!plano) {
    throw new Error(`Plano "${input.planoSlug}" não encontrado ou inativo.`);
  }

  // 3. Cria assinatura pendente (fica como aguardando_pagamento).
  const assinatura = await criarAssinaturaPendente({
    userId: input.userId,
    planoId: plano.id,
    provedor: "mercado_pago",
  });

  // 4. Cria preferência no MP e retorna URL de checkout.
  const { redirectUrl, preferenceId } = await criarPreferenciaCheckoutPro({
    assinaturaId: assinatura.id,
    userId: input.userId,
    email: input.email,
    nome: input.nome,
    valorCentavos: plano.precoCentavos,
    tituloPlano: plano.nome,
    urlBase: input.urlBase,
  });

  return {
    jaAssinante: false as const,
    assinaturaId: assinatura.id,
    preferenceId,
    redirectUrl,
  };
}

export { getAssinaturaAtiva, getPlanoPorSlug } from "./queries";
