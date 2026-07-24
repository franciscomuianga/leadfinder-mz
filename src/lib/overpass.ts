/**
 * Overpass API — pesquisa de negócios no OpenStreetMap.
 *
 * Gratuito, sem chave de API, sem limite rígido de pedidos (só pede uso
 * responsável — não fazer pesquisas em massa demasiado frequentes).
 * Dados sob licença ODbL: podem ser guardados/reutilizados, desde que
 * mantida a atribuição "© OpenStreetMap contributors" na interface.
 */

const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];

// Mapeia as categorias em português (usadas na UI) para tags OSM reais.
export const CATEGORY_TAGS: Record<string, string> = {
  restaurante: "amenity=restaurant",
  cafe: "amenity=cafe",
  loja: "shop",
  escritorio: "office",
  farmacia: "amenity=pharmacy",
  hotel: "tourism=hotel",
  salao_beleza: "shop=hairdresser",
  oficina_auto: "shop=car_repair",
  mercearia: "shop=convenience",
};

export interface OsmBusiness {
  osmId: string;
  osmType: "node" | "way" | "relation";
  name: string;
  category: string;
  address: string | null;
  city: string | null;
  phone: string | null;
  website: string | null;
  openingHours: string | null;
  email: string | null;
  whatsapp: string | null;
  socialMedia: string | null;
  latitude: number;
  longitude: number;
}

interface OverpassElement {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

type BBox = [south: number, west: number, north: number, east: number];

/**
 * Pesquisa negócios de uma categoria dentro de uma área (definida por
 * um nome de cidade, resolvido via Nominatim — também gratuito).
 *
 * Usa uma caixa delimitadora (bounding box) em vez do polígono completo
 * da cidade: é uma pesquisa muito mais rápida no servidor Overpass —
 * o cálculo do polígono exato de cidades grandes (ex: Maputo, Matola)
 * era a causa dos timeouts (504) que estávamos a ter.
 */
export async function searchBusinesses(
  categoryKey: string,
  areaName: string
): Promise<OsmBusiness[]> {
  const tag = CATEGORY_TAGS[categoryKey];
  if (!tag) throw new Error(`Categoria desconhecida: ${categoryKey}`);

  const bbox = await resolveBoundingBox(areaName);
  const [key, value] = tag.split("=");
  const tagFilter = value ? `["${key}"="${value}"]` : `["${key}"]`;
  const bboxStr = bbox.join(",");

  const query = `
    [out:json][timeout:20];
    (
      node${tagFilter}(${bboxStr});
      way${tagFilter}(${bboxStr});
    );
    out center tags 80;
  `;

  let response: Response | null = null;
  let lastError = "";

  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const attempt = await fetch(endpoint, {
        method: "POST",
        body: query,
        headers: {
          "Content-Type": "text/plain",
          "User-Agent": "LeadFinderMZ/1.0 (ferramenta interna de prospecao)",
          Accept: "*/*",
        },
        signal: AbortSignal.timeout(25000),
      });
      if (attempt.ok) {
        response = attempt;
        break;
      }
      lastError = `${endpoint} respondeu ${attempt.status}`;
    } catch (err) {
      lastError = `${endpoint} falhou: ${err instanceof Error ? err.message : "erro de rede"}`;
    }
  }

  if (!response) {
    throw new Error(`Todos os servidores Overpass falharam. Último erro: ${lastError}`);
  }

  const data: { elements: OverpassElement[] } = await response.json();

  return data.elements
    .filter((el) => el.tags?.name)
    .map((el) => {
      const lat = el.lat ?? el.center?.lat ?? 0;
      const lon = el.lon ?? el.center?.lon ?? 0;
      const tags = el.tags ?? {};
      const addressParts = [tags["addr:street"], tags["addr:housenumber"]].filter(Boolean);

      return {
        osmId: String(el.id),
        osmType: el.type,
        name: tags.name!,
        category: categoryKey,
        address: addressParts.length > 0 ? addressParts.join(", ") : null,
        city: tags["addr:city"] ?? areaName,
        phone: tags.phone ?? tags["contact:phone"] ?? null,
        website: tags.website ?? tags["contact:website"] ?? null,
        openingHours: tags.opening_hours ?? null,
        email: tags.email ?? tags["contact:email"] ?? null,
        whatsapp: tags["contact:whatsapp"] ?? null,
        socialMedia: tags["contact:facebook"] ?? tags["contact:instagram"] ?? null,
        latitude: lat,
        longitude: lon,
      };
    });
}

/** Resolve o nome de uma área (ex: "Maputo") para uma caixa delimitadora [sul,oeste,norte,este]. */
async function resolveBoundingBox(areaName: string): Promise<BBox> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    areaName + ", Moçambique"
  )}&format=json&limit=1&countrycodes=mz`;

  const response = await fetch(url, {
    headers: { "User-Agent": "LeadFinderMZ/1.0" }, // exigido pela política do Nominatim
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) throw new Error("Não foi possível localizar essa área.");

  const results: { boundingbox: [string, string, string, string] }[] = await response.json();
  if (results.length === 0) throw new Error(`Área "${areaName}" não encontrada.`);

  const [south, north, west, east] = results[0].boundingbox.map(Number);
  return [south, west, north, east];
}

/** Gera um link direto do Google Maps a partir de coordenadas/nome — sem API, sem custo. */
export function googleMapsUrl(business: Pick<OsmBusiness, "name" | "latitude" | "longitude">): string {
  const query = encodeURIComponent(business.name);
  return `https://www.google.com/maps/search/?api=1&query=${query}@${business.latitude},${business.longitude}`;
}
