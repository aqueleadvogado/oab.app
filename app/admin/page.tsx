import Link from "next/link";
import { listarBlocosPorStatus } from "@/lib/admin/queries";
import { Card, CardBody } from "@/components/ui/card";

export const instant = false;

export default async function AdminHome() {
  const emRevisao = await listarBlocosPorStatus(["em_revisao", "aprovado"]);
  const rascunho = await listarBlocosPorStatus(["rascunho"]);
  const publicados = await listarBlocosPorStatus(["publicado"]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-3xl">Painel administrativo</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/blocos" className="block">
          <Card className="hover:border-blue transition-colors">
            <CardBody>
              <p className="font-mono text-xs text-muted uppercase tracking-widest">
                Em revisão
              </p>
              <p className="text-4xl font-display font-bold text-blue mt-1">
                {emRevisao.length}
              </p>
              <p className="text-sm text-muted mt-1">
                blocos aguardando aprovação
              </p>
            </CardBody>
          </Card>
        </Link>
        <Card>
          <CardBody>
            <p className="font-mono text-xs text-muted uppercase tracking-widest">
              Rascunhos
            </p>
            <p className="text-4xl font-display font-bold text-muted mt-1">
              {rascunho.length}
            </p>
            <p className="text-sm text-muted mt-1">não aparecem para alunos</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="font-mono text-xs text-muted uppercase tracking-widest">
              Publicados
            </p>
            <p className="text-4xl font-display font-bold text-mint mt-1">
              {publicados.length}
            </p>
            <p className="text-sm text-muted mt-1">visíveis aos alunos</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
