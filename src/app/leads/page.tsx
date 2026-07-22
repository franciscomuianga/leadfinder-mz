import { requireOrganization } from "@/lib/auth";
import { SearchForm } from "@/components/leads/search-form";

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
