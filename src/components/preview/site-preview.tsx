import { whatsappLink } from "@/lib/contact-links";

interface SitePreviewProps {
  name: string;
  category: string | null;
  address: string | null;
  city: string | null;
  phone: string | null;
  openingHours?: string | null;
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
  mercearia: "Mercearia",
};

const CATEGORY_TAGLINES: Record<string, string> = {
  restaurante: "Sabor autêntico, todos os dias.",
  cafe: "O teu momento de pausa.",
  loja: "Tudo o que precisas, num só lugar.",
  escritorio: "Profissionalismo em cada detalhe.",
  farmacia: "A tua saúde em primeiro lugar.",
  hotel: "Sente-te em casa, longe de casa.",
  salao_beleza: "Realça a tua melhor versão.",
  oficina_auto: "O teu carro em boas mãos.",
  mercearia: "Frescura e confiança, perto de ti.",
};

/**
 * Preview de site gerado automaticamente, mostrado dentro da própria
 * aplicação — sem deploy nenhum. Só depois de venderes é que o site
 * real é publicado (com domínio e conteúdo definitivo do cliente).
 */
export function SitePreview({ name, category, address, city, phone, openingHours }: SitePreviewProps) {
  const categoryLabel = category ? CATEGORY_LABELS[category] ?? category : "Negócio";
  const tagline = category ? CATEGORY_TAGLINES[category] ?? "" : "";

  return (
    <div className="overflow-hidden rounded-xl border border-brand-border bg-white text-neutral-900 shadow-2xl">
      {/* Barra de navegação simulada */}
      <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
        <p className="font-semibold text-neutral-900">{name}</p>
        <div className="hidden gap-5 text-sm text-neutral-500 sm:flex">
          <span>Início</span>
          <span>Sobre</span>
          <span>Contacto</span>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-600 to-purple-700 px-8 py-20 text-center text-white">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
          {categoryLabel}
        </p>
        <h1 className="mx-auto mt-3 max-w-lg text-4xl font-bold leading-tight">{name}</h1>
        {tagline && <p className="mt-3 text-lg text-white/85">{tagline}</p>}
        <p className="mt-2 text-sm text-white/70">{address ?? city ?? "Moçambique"}</p>

        {phone ? (
          <a
            href={whatsappLink(phone, `Olá! Vi o site do ${name} e gostava de saber mais.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-indigo-700 shadow-lg"
          >
            Falar no WhatsApp
          </a>
        ) : (
          <button className="mt-8 rounded-full bg-white px-7 py-3 text-sm font-semibold text-indigo-700 shadow-lg">
            Contactar
          </button>
        )}
      </div>

      {/* Secção de informação */}
      <div className="grid grid-cols-1 gap-8 border-b border-neutral-100 px-8 py-12 sm:grid-cols-3">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Localização</p>
          <p className="mt-2 text-sm text-neutral-600">{address ?? "A confirmar com o negócio"}</p>
        </div>
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Contacto</p>
          <p className="mt-2 text-sm text-neutral-600">{phone ?? "A confirmar com o negócio"}</p>
        </div>
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Horário</p>
          <p className="mt-2 text-sm text-neutral-600">{openingHours ?? "A confirmar com o negócio"}</p>
        </div>
      </div>

      {/* Secção "sobre" ilustrativa */}
      <div className="px-8 py-12 text-center">
        <h2 className="text-xl font-bold text-neutral-900">Sobre o {name}</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-neutral-500">
          Este é um espaço reservado para a história e os valores do negócio — texto e
          imagens reais a confirmar diretamente com o cliente antes da publicação final.
        </p>
      </div>

      <div className="border-t border-neutral-100 bg-neutral-50 px-8 py-6 text-center text-xs text-neutral-400">
        Protótipo gerado automaticamente — conteúdo e imagens finais a confirmar com o cliente.
      </div>
    </div>
  );
}
