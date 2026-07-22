import { requireOrganization } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function DashboardPage() {
  const { organizationId, supabase } = await requireOrganization();

  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false });

  const total = leads?.length ?? 0;
  const porEstado = {
    novo: leads?.filter((l) => l.status === "novo").length ?? 0,
    contactado: leads?.filter((l) => l.status === "contactado").length ?? 0,
    em_negociacao: leads?.filter((l) => l.status === "em_negociacao").length ?? 0,
    vendido: leads?.filter((l) => l.status === "vendido").length ?? 0,
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Visão geral</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
        <Card>
          <p className="text-xs text-neutral-400">Total de leads</p>
          <p className="mt-1 text-2xl font-bold text-white">{total}</p>
        </Card>
        <Card>
          <p className="text-xs text-neutral-400">Novos</p>
          <p className="mt-1 text-2xl font-bold text-blue-400">{porEstado.novo}</p>
        </Card>
        <Card>
          <p className="text-xs text-neutral-400">Contactados</p>
          <p className="mt-1 text-2xl font-bold text-amber-400">{porEstado.contactado}</p>
        </Card>
        <Card>
          <p className="text-xs text-neutral-400">Em negociação</p>
          <p className="mt-1 text-2xl font-bold text-purple-400">{porEstado.em_negociacao}</p>
        </Card>
        <Card>
          <p className="text-xs text-neutral-400">Vendidos</p>
          <p className="mt-1 text-2xl font-bold text-emerald-400">{porEstado.vendido}</p>
        </Card>
      </div>

      <h2 className="mt-8 mb-3 text-lg font-semibold text-white">
        Leads recentes
      </h2>

      {total === 0 ? (
        <Card>
          <p className="text-sm text-neutral-400">
            Ainda não tens leads guardados.{" "}
            <Link href="/leads" className="text-brand-primary-light hover:underline">
              Pesquisa o primeiro
            </Link>
            .
          </p>
        </Card>
      ) : (
        <div className="overflow-hidden rounded-xl border border-brand-border">
          <table className="w-full text-sm">
            <thead className="bg-brand-surface text-left text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Site</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {leads?.map((lead) => (
                <tr key={lead.id} className="hover:bg-brand-surface/50">
                  <td className="px-4 py-3">
                    <Link href={`/leads/${lead.id}`} className="font-medium text-white hover:text-brand-primary-light">
                      {lead.name}
                    </Link>
                    <p className="text-xs text-neutral-500">{lead.city}</p>
                  </td>
                  <td className="px-4 py-3 text-neutral-400">{lead.category}</td>
                  <td className="px-4 py-3">
                    <Badge status={lead.site_health} />
                  </td>
                  <td className="px-4 py-3">
                    <Badge status={lead.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
