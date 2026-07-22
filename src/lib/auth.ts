import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function requireOrganization() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: membership } = await supabase
    .from("memberships")
    .select("organization_id")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (!membership) {
    // Não devia acontecer (criamos a organização no signUpAction), mas
    // protege contra estados inconsistentes em vez de rebentar a página.
    redirect("/login?error=Conta sem organização associada. Contacta o suporte.");
  }

  return { user, organizationId: membership.organization_id, supabase };
}
