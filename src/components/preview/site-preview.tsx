interface SitePreviewProps {
  name: string;
  category: string | null;
  address: string | null;
  city: string | null;
  phone: string | null;
}

const CATEGORY_LABELS: Record<string, string> = {
  restaurante: "Restaurante",
  cafe: "Café",
  loja: "Loja",
  escritorio: "Escritório",
  farmacia: "Farmácia",
  hotel: "Hotel",
  salao_beleza: "Salão de Beleza",
  oficina_auto: "Oficina Automóvel",
};

/**
 * Preview de site gerado automaticamente, mostrado dentro da própria
 * aplicação — sem deploy nenhum. Só depois de venderes é que o site
 * real é publicado (com domínio e conteúdo definitivo do cliente).
 */
export function SitePreview({ name, category, address, city, phone }: SitePreviewProps) {
  const categoryLabel = category ? CATEGORY_LABELS[category] ?? category : "Negócio";

  return (
    <div className="overflow-hidden rounded-xl border border-brand-border bg-white text-neutral-900">
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 px-8 py-16 text-center text-white">
        <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
          {categoryLabel}
        </p>
        <h1 className="mt-2 text-3xl font-bold">{name}</h1>
        <p className="mt-3 text-white/80">{address ?? city ?? "Moçambique"}</p>
        <button className="mt-6 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-indigo-600">
          Contactar
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 p-8 sm:grid-cols-3">
        <div className="text-center">
          <p className="text-sm font-semibold text-neutral-900">Localização</p>
          <p className="mt-1 text-sm text-neutral-500">{address ?? "A confirmar"}</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-neutral-900">Contacto</p>
          <p className="mt-1 text-sm text-neutral-500">{phone ?? "A confirmar"}</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-neutral-900">Horário</p>
          <p className="mt-1 text-sm text-neutral-500">A confirmar com o negócio</p>
        </div>
      </div>

      <div className="border-t border-neutral-200 px-8 py-6 text-center text-xs text-neutral-400">
        Protótipo gerado automaticamente — conteúdo final a confirmar com o cliente.
      </div>
    </div>
  );
}
