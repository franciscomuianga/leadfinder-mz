import { requireOrganization } from "@/lib/auth";
import { SearchForm } from "@/components/leads/search-form";
import Link from "next/link";

// Pesquisas em cidades grandes podem demorar mais que o limite padrão da
// Vercel (10s) — a Overpass API para cidades como Maputo pode levar 15-30s.
export const maxDuration = 60;

export default async function LeadsPage() {
  await requireOrganization();

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Pesquisar leads</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Escolhe uma categoria e uma cidade/zona de Moçambique para encontrar negócios sem site.
          </p>
        </div>
        <Link
          href="/leads/new"
          className="rounded-lg border border-brand-border px-4 py-2 text-sm font-medium text-neutral-300 hover:border-brand-primary hover:text-white"
        >
          + Adicionar manualmente
        </Link>
      </div>

      <div className="mt-6">
        <SearchForm />
      </div>
    </div>
  );
}
