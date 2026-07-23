import { requireOrganization } from "@/lib/auth";
import { SearchForm } from "@/components/leads/search-form";

// Pesquisas em cidades grandes podem demorar mais que o limite padrão da
// Vercel (10s) — a Overpass API para cidades como Maputo pode levar 15-30s.
export const maxDuration = 60;

export default async function LeadsPage() {
  await requireOrganization();

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Pesquisar leads</h1>
      <p className="mt-1 text-sm text-neutral-400">
        Escolhe uma categoria e uma cidade/zona de Moçambique para encontrar negócios sem site.
      </p>

      <div className="mt-6">
        <SearchForm />
      </div>
    </div>
  );
}
