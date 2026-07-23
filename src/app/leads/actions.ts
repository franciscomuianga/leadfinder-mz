"use server";

// Pesquisas em cidades grandes podem demorar mais que o limite padrão da
// Vercel (10s) — a Overpass API para cidades como Maputo pode levar 15-30s.
export const maxDuration = 60;

import { requireOrganization } from "@/lib/auth";
import { searchBusinesses, googleMapsUrl, type OsmBusiness } from "@/lib/overpass";
import { checkSiteHealth } from "@/lib/site-health-check";
import { revalidatePath } from "next/cache";

export interface SearchResultItem extends OsmBusiness {
  googleMapsUrl: string;
}

export async function searchLeadsAction(
  categoryKey: string,
  areaName: string
): Promise<{ results: SearchResultItem[] } | { error: string }> {
  await requireOrganization(); // garante autenticação antes de gastar pedidos externos

  try {
    const businesses = await searchBusinesses(categoryKey, areaName);
    const results: SearchResultItem[] = businesses.map((b) => ({
      ...b,
      googleMapsUrl: googleMapsUrl(b),
    }));
    return { results };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erro desconhecido na pesquisa." };
  }
}

export async function saveLeadAction(business: SearchResultItem) {
  const { organizationId, supabase } = await requireOrganization();

  const healthResult = await checkSiteHealth(business.website);

  const { data, error } = await supabase
    .from("leads")
    .insert({
      organization_id: organizationId,
      osm_id: business.osmId,
      osm_type: business.osmType,
      name: business.name,
      category: business.category,
      address: business.address,
      city: business.city,
      phone: business.phone,
      existing_website: business.website,
      latitude: business.latitude,
      longitude: business.longitude,
      google_maps_url: business.googleMapsUrl,
      site_health: healthResult.health,
      site_health_notes: healthResult.notes.join(" "),
    })
    .select()
    .single();

  revalidatePath("/dashboard");

  if (error) return { error: error.message };
  return { lead: data };
}

export async function updateLeadStatusAction(leadId: string, status: string) {
  const { supabase } = await requireOrganization();

  const { error } = await supabase
    .from("leads")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", leadId);

  revalidatePath(`/leads/${leadId}`);
  revalidatePath("/dashboard");

  if (error) return { error: error.message };
  return { success: true };
}

export async function updateLeadNotesAction(leadId: string, notes: string) {
  const { supabase } = await requireOrganization();

  const { error } = await supabase
    .from("leads")
    .update({ notes, updated_at: new Date().toISOString() })
    .eq("id", leadId);

  revalidatePath(`/leads/${leadId}`);

  if (error) return { error: error.message };
  return { success: true };
}
