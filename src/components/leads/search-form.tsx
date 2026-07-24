"use client";

import { useState, useTransition } from "react";
import { searchLeadsAction, saveLeadAction, type SearchResultItem } from "@/app/leads/actions";
import { calculatePriority } from "@/lib/priority-score";
import { CATEGORIES, CIDADES_MOCAMBIQUE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function SearchForm() {
  const [category, setCategory] = useState("restaurante");
  const [area, setArea] = useState("Maputo");
  const [results, setResults] = useState<SearchResultItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const response = await searchLeadsAction(category, area);
      if ("error" in response) {
        setError(response.error);
        setResults(null);
      } else {
        setResults(response.results);
      }
    });
  }

  function handleSave(business: SearchResultItem) {
    startTransition(async () => {
      const response = await saveLeadAction(business);
      if (!("error" in response)) {
        setSavedIds((prev) => new Set(prev).add(business.osmId));
      }
    });
  }

  const semSite = results?.filter((r) => !r.website) ?? [];
  const comSite = results?.filter((r) => r.website) ?? [];

  const sortedResults = results
    ? [...results].sort(
        (a, b) =>
          calculatePriority({ phone: b.phone, address: b.address, openingHours: b.openingHours })
            .score -
          calculatePriority({ phone: a.phone, address: a.address, openingHours: a.openingHours })
            .score
      )
    : [];

  return (
    <div>
      <form onSubmit={handleSearch} className="flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-400">Categoria</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-brand-border bg-brand-bg px-3.5 py-2.5 text-sm text-neutral-100 focus:border-brand-primary focus:outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-400">Cidade / zona</label>
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="rounded-lg border border-brand-border bg-brand-bg px-3.5 py-2.5 text-sm text-neutral-100 focus:border-brand-primary focus:outline-none"
          >
            {CIDADES_MOCAMBIQUE.map((cidade) => (
              <option key={cidade} value={cidade}>
                {cidade}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "A pesquisar..." : "Pesquisar"}
        </Button>
      </form>

      {error && (
        <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>
      )}

      {results && (
        <div className="mt-6">
          <p className="mb-4 text-sm text-neutral-400">
            {results.length} negócios encontrados — <span className="text-red-400">{semSite.length} sem site</span>,{" "}
            {comSite.length} com site (ainda por avaliar)
          </p>

          <div className="space-y-3">
            {sortedResults.map((business) => {
              const priority = calculatePriority({
                phone: business.phone,
                address: business.address,
                openingHours: business.openingHours,
              });
              return (
                <Card key={business.osmId} className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">{business.name}</p>
                    <p className="text-xs text-neutral-500">
                      {business.address ?? "Morada não disponível"} · {business.phone ?? "sem telefone"}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <Badge status={business.website ? "nao_avaliado" : "sem_site"} />
                      <Badge status={priority.label} />
                      <a
                        href={business.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-brand-primary-light hover:underline"
                      >
                        Ver no Google Maps
                      </a>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={savedIds.has(business.osmId) ? "secondary" : "primary"}
                    disabled={savedIds.has(business.osmId) || isPending}
                    onClick={() => handleSave(business)}
                  >
                    {savedIds.has(business.osmId) ? "Guardado ✓" : "Guardar como lead"}
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Atribuição obrigatória — licença ODbL do OpenStreetMap */}
      <p className="mt-8 text-xs text-neutral-600">
        Dados de negócios: © colaboradores do{" "}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          OpenStreetMap
        </a>
        .
      </p>
    </div>
  );
}
