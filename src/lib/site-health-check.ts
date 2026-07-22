/**
 * Avaliação automática e honesta do estado de um site existente.
 * Não é uma auditoria profissional — é um sinal rápido para priorizar
 * quais leads vale mais a pena contactar primeiro.
 */

export type SiteHealth = "sem_site" | "site_fraco" | "site_ok" | "nao_avaliado";

export interface SiteHealthResult {
  health: SiteHealth;
  notes: string[];
}

export async function checkSiteHealth(url: string | null): Promise<SiteHealthResult> {
  if (!url) {
    return { health: "sem_site", notes: ["Nenhum website encontrado nos dados."] };
  }

  const notes: string[] = [];
  let score = 0;

  try {
    const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;
    const response = await fetch(normalizedUrl, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      notes.push(`O site respondeu com erro (código ${response.status}).`);
      return { health: "site_fraco", notes };
    }

    if (normalizedUrl.startsWith("https://")) {
      score += 1;
    } else {
      notes.push("Site sem HTTPS (não seguro).");
    }

    const html = await response.text();

    if (/<meta[^>]+viewport/i.test(html)) {
      score += 1;
    } else {
      notes.push("Sem meta tag 'viewport' — provavelmente não é responsivo em mobile.");
    }

    if (html.length > 2000) {
      score += 1;
    } else {
      notes.push("Página muito simples/pequena — pode ser uma página de estacionamento de domínio.");
    }

    if (/wix\.com|godaddy|sites\.google\.com|blogspot/i.test(html)) {
      notes.push("Construído numa plataforma gratuita/genérica — boa oportunidade de upgrade.");
    } else {
      score += 1;
    }

    if (score >= 3) {
      return { health: "site_ok", notes: notes.length > 0 ? notes : ["Site parece funcional."] };
    }
    return { health: "site_fraco", notes };
  } catch {
    notes.push("Não foi possível aceder ao site (pode estar em baixo ou o domínio expirou).");
    return { health: "site_fraco", notes };
  }
}
