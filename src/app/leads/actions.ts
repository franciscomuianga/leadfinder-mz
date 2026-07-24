"use server";

import { requireOrganization } from "@/lib/auth";
import { searchBusinesses, googleMapsUrl, type OsmBusiness } from "@/lib/overpass";
import { checkSiteHealth } from "@/lib/site-health-check";
import { calculatePriority } from "@/lib/priority-score";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
  const priority = calculatePriority({
    phone: business.phone,
    address: business.address,
    openingHours: business.openingHours,
  });

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
      opening_hours: business.openingHours,
      email: business.email,
      whatsapp: business.whatsapp,
      social_media: business.socialMedia,
      latitude: business.latitude,
      longitude: business.longitude,
      google_maps_url: business.googleMapsUrl,
      site_health: healthResult.health,
      site_health_notes: healthResult.notes.join(" "),
      priority_score: priority.score,
      priority_label: priority.label,
    })
    .select()
    .single();

  revalidatePath("/dashboard");

  if (error) return { error: error.message };
  return { lead: data };
}

export async function saveManualLeadAction(formData: FormData) {
  const { organizationId, supabase } = await requireOrganization();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "O nome é obrigatório." };

  const phone = String(formData.get("phone") ?? "").trim() || null;
  const address = String(formData.get("address") ?? "").trim() || null;
  const city = String(formData.get("city") ?? "").trim() || null;
  const category = String(formData.get("category") ?? "").trim() || null;
  const email = String(formData.get("email") ?? "").trim() || null;
  const whatsapp = String(formData.get("whatsapp") ?? "").trim() || null;
  const openingHours = String(formData.get("opening_hours") ?? "").trim() || null;
  const existingWebsite = String(formData.get("existing_website") ?? "").trim() || null;

  const healthResult = await checkSiteHealth(existingWebsite);
  const priority = calculatePriority({ phone, address, openingHours });

  const { data, error } = await supabase
    .from("leads")
    .insert({
      organization_id: organizationId,
      osm_id: null,
      osm_type: null,
      name,
      category,
      address,
      city,
      phone,
      existing_website: existingWebsite,
      opening_hours: openingHours,
      email,
      whatsapp,
      google_maps_url: null,
      site_health: healthResult.health,
      site_health_notes: "Adicionado manualmente — sem avaliação automática de morada/coordenadas.",
      priority_score: priority.score,
      priority_label: priority.label,
    })
    .select()
    .single();

  revalidatePath("/dashboard");
  revalidatePath("/leads");

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

export async function updateLeadServicesAction(leadId: string, services: string[]) {
  const { supabase } = await requireOrganization();

  const { error } = await supabase
    .from("leads")
    .update({ services_offered: services, updated_at: new Date().toISOString() })
    .eq("id", leadId);

  revalidatePath(`/leads/${leadId}`);

  if (error) return { error: error.message };
  return { success: true };
}

export async function addManualLeadAction(formData: FormData) {
  const { organizationId, supabase } = await requireOrganization();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    return { error: "O nome do negócio é obrigatório." };
  }

  const phone = String(formData.get("phone") ?? "").trim() || null;
  const address = String(formData.get("address") ?? "").trim() || null;
  const openingHours = String(formData.get("opening_hours") ?? "").trim() || null;

  const priority = calculatePriority({ phone, address, openingHours });

  const { data, error } = await supabase
    .from("leads")
    .insert({
      organization_id: organizationId,
      osm_id: null,
      osm_type: null,
      name,
      category: String(formData.get("category") ?? "") || null,
      address,
      city: String(formData.get("city") ?? "") || null,
      phone,
      email: String(formData.get("email") ?? "").trim() || null,
      whatsapp: String(formData.get("whatsapp") ?? "").trim() || null,
      social_media: String(formData.get("social_media") ?? "").trim() || null,
      existing_website: String(formData.get("existing_website") ?? "").trim() || null,
      opening_hours: openingHours,
      google_maps_url: String(formData.get("google_maps_url") ?? "").trim() || null,
      site_health: "nao_avaliado",
      priority_score: priority.score,
      priority_label: priority.label,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  redirect(`/leads/${data.id}`);
}
