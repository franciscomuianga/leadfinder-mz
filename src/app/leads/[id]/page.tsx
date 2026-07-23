import { requireOrganization } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LeadStatusPanel } from "@/components/leads/lead-status-panel";
import { SitePreview } from "@/components/preview/site-preview";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { organizationId, supabase } = await requireOrganization();

  const { data: lead } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .eq("organization_id", organizationId)
    .single();

  if (!lead) notFound();

  return (
    <div>
      <Link href="/dashboard" className="text-sm text-neutral-400 hover:text-white">
        ← Voltar
      </Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{lead.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge status={lead.site_health} />
            <Badge status={lead.priority_label ?? "baixa"} />
            <Badge status={lead.status} />
          </div>
        </div>
        {lead.google_maps_url && (
          <a
            href={lead.google_maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-brand-primary-light hover:underline"
          >
            Ver no Google Maps →
          </a>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          <Card>
            <h2 className="mb-3 text-sm font-semibold text-white">Dados do negócio</h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-xs text-neutral-500">Categoria</dt>
                <dd className="text-neutral-200">{lead.category ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-neutral-500">Morada</dt>
                <dd className="text-neutral-200">{lead.address ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-neutral-500">Cidade</dt>
                <dd className="text-neutral-200">{lead.city ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-neutral-500">Telefone</dt>
                <dd className="text-neutral-200">{lead.phone ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-neutral-500">Horário de funcionamento</dt>
                <dd className="text-neutral-200">{lead.opening_hours ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-neutral-500">Site existente</dt>
                <dd className="text-neutral-200">
                  {lead.existing_website ? (
                    <a href={lead.existing_website} target="_blank" rel="noopener noreferrer" className="text-brand-primary-light hover:underline">
                      {lead.existing_website}
                    </a>
                  ) : (
                    "Nenhum"
                  )}
                </dd>
              </div>
              {lead.site_health_notes && (
                <div>
                  <dt className="text-xs text-neutral-500">Avaliação automática</dt>
                  <dd className="text-neutral-400">{lead.site_health_notes}</dd>
                </div>
              )}
            </dl>
          </Card>

          <LeadStatusPanel leadId={lead.id} initialStatus={lead.status} initialNotes={lead.notes} />
        </div>

        <div className="lg:col-span-2">
          <h2 className="mb-3 text-sm font-semibold text-white">
            Preview do site (protótipo, sem deploy)
          </h2>
          <SitePreview
            name={lead.name}
            category={lead.category}
            address={lead.address}
            city={lead.city}
            phone={lead.phone}
          />
        </div>
      </div>
    </div>
  );
}
