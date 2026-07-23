/**
 * Pontuação de "maturidade comercial" — uma aproximação honesta de
 * quão estabelecido um negócio parece, a partir dos dados disponíveis
 * no OpenStreetMap.
 *
 * IMPORTANTE: isto NÃO é uma classificação de clientes (o OpenStreetMap
 * não tem avaliações/estrelas, ao contrário do Google Maps). É apenas um
 * sinal de organização do negócio — útil para priorizar contactos, não
 * uma medida de qualidade ou reputação.
 */

export interface PriorityInput {
  phone: string | null;
  address: string | null;
  openingHours: string | null;
}

export type PriorityLabel = "baixa" | "media" | "alta";

export interface PriorityResult {
  score: number; // 0-3
  label: PriorityLabel;
}

export function calculatePriority(input: PriorityInput): PriorityResult {
  let score = 0;
  if (input.phone) score += 1;
  if (input.openingHours) score += 1;
  if (input.address) score += 1;

  const label: PriorityLabel = score >= 3 ? "alta" : score >= 1 ? "media" : "baixa";

  return { score, label };
}
