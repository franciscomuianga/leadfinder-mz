import { requireOrganization } from "@/lib/auth";
import { addManualLeadAction } from "@/app/leads/actions";
import { CATEGORIES, CIDADES_MOCAMBIQUE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default async function NewLeadPage() {
  await requireOrganization();

  return (
    <div className="mx-auto max-w-xl">
      <Link href="/leads" className="text-sm text-neutral-400 hover:text-white">
        ← Voltar à pesquisa
      </Link>

      <h1 className="mt-3 text-2xl font-bold text-white">Adicionar lead manualmente</h1>
      <p className="mt-1 text-sm text-neutral-400">
        Para negócios que encontraste no Google Maps ou no terreno e que não apareceram na
        pesquisa automática.
      </p>

      <Card className="mt-6">
        <form action={addManualLeadAction} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-xs font-medium text-neutral-400">
              Nome do negócio *
            </label>
            <Input id="name" name="name" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="category" className="mb-1 block text-xs font-medium text-neutral-400">
                Categoria
              </label>
              <select
                id="category"
                name="category"
                className="w-full rounded-lg border border-brand-border bg-brand-bg px-3.5 py-2.5 text-sm text-neutral-100 focus:border-brand-primary focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="city" className="mb-1 block text-xs font-medium text-neutral-400">
                Cidade
              </label>
              <select
                id="city"
                name="city"
                className="w-full rounded-lg border border-brand-border bg-brand-bg px-3.5 py-2.5 text-sm text-neutral-100 focus:border-brand-primary focus:outline-none"
              >
                {CIDADES_MOCAMBIQUE.map((cidade) => (
                  <option key={cidade} value={cidade}>
                    {cidade}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="address" className="mb-1 block text-xs font-medium text-neutral-400">
              Morada
            </label>
            <Input id="address" name="address" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="phone" className="mb-1 block text-xs font-medium text-neutral-400">
                Telefone
              </label>
              <Input id="phone" name="phone" type="tel" placeholder="84xxxxxxx" />
            </div>
            <div>
              <label htmlFor="whatsapp" className="mb-1 block text-xs font-medium text-neutral-400">
                WhatsApp (se diferente)
              </label>
              <Input id="whatsapp" name="whatsapp" type="tel" placeholder="84xxxxxxx" />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-xs font-medium text-neutral-400">
              Email
            </label>
            <Input id="email" name="email" type="email" />
          </div>

          <div>
            <label htmlFor="opening_hours" className="mb-1 block text-xs font-medium text-neutral-400">
              Horário de funcionamento
            </label>
            <Input id="opening_hours" name="opening_hours" placeholder="Ex: Seg-Sáb 08:00-18:00" />
          </div>

          <div>
            <label htmlFor="social_media" className="mb-1 block text-xs font-medium text-neutral-400">
              Rede social (link)
            </label>
            <Input id="social_media" name="social_media" type="url" placeholder="https://..." />
          </div>

          <div>
            <label htmlFor="existing_website" className="mb-1 block text-xs font-medium text-neutral-400">
              Site existente (se tiver)
            </label>
            <Input id="existing_website" name="existing_website" type="url" placeholder="https://..." />
          </div>

          <div>
            <label htmlFor="google_maps_url" className="mb-1 block text-xs font-medium text-neutral-400">
              Link do Google Maps
            </label>
            <Input
              id="google_maps_url"
              name="google_maps_url"
              type="url"
              placeholder="Cola aqui o link que copiaste do Google Maps"
            />
          </div>

          <Button type="submit" className="w-full">
            Guardar lead
          </Button>
        </form>
      </Card>
    </div>
  );
}
