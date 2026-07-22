import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  novo: "bg-blue-500/15 text-blue-400",
  contactado: "bg-amber-500/15 text-amber-400",
  em_negociacao: "bg-purple-500/15 text-purple-400",
  vendido: "bg-emerald-500/15 text-emerald-400",
  descartado: "bg-neutral-500/15 text-neutral-400",
  sem_site: "bg-red-500/15 text-red-400",
  site_fraco: "bg-amber-500/15 text-amber-400",
  site_ok: "bg-emerald-500/15 text-emerald-400",
  nao_avaliado: "bg-neutral-500/15 text-neutral-400",
};

const STATUS_LABELS: Record<string, string> = {
  novo: "Novo",
  contactado: "Contactado",
  em_negociacao: "Em negociação",
  vendido: "Vendido",
  descartado: "Descartado",
  sem_site: "Sem site",
  site_fraco: "Site fraco",
  site_ok: "Site OK",
  nao_avaliado: "Não avaliado",
};

export function Badge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        STATUS_STYLES[status] ?? "bg-neutral-500/15 text-neutral-400"
      )}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
