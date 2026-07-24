"use client";

import { useState, useTransition } from "react";
import { updateLeadServicesAction } from "@/app/leads/actions";
import { whatsappLink, smsLink, PITCH_MESSAGES } from "@/lib/contact-links";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SERVICES = [
  { value: "site", label: "Site profissional" },
  { value: "fiado_facil", label: "Fiado Fácil" },
  { value: "gmb", label: "Atualizar Google Meu Negócio" },
];

export function LeadContactPanel({
  leadId,
  phone,
  initialServices,
}: {
  leadId: string;
  phone: string | null;
  initialServices: string[];
}) {
  const [services, setServices] = useState<string[]>(initialServices ?? []);
  const [isPending, startTransition] = useTransition();

  function toggleService(value: string) {
    const next = services.includes(value)
      ? services.filter((s) => s !== value)
      : [...services, value];
    setServices(next);
    startTransition(async () => {
      await updateLeadServicesAction(leadId, next);
    });
  }

  const primaryService = services[0] ?? "fiado_facil";
  const pitchMessage = PITCH_MESSAGES[primaryService];

  return (
    <Card>
      <h2 className="mb-3 text-sm font-semibold text-white">Serviços a oferecer</h2>
      <div className="space-y-2">
        {SERVICES.map((service) => (
          <label key={service.value} className="flex items-center gap-2 text-sm text-neutral-300">
            <input
              type="checkbox"
              checked={services.includes(service.value)}
              onChange={() => toggleService(service.value)}
              disabled={isPending}
              className="rounded border-brand-border bg-brand-bg text-brand-primary focus:ring-brand-primary"
            />
            {service.label}
          </label>
        ))}
      </div>

      {phone ? (
        <div className="mt-4 flex flex-col gap-2 border-t border-brand-border pt-4">
          <p className="text-xs text-neutral-500">
            Mensagem sugerida com base no 1º serviço selecionado:
          </p>
          <a href={whatsappLink(phone, pitchMessage)} target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-500">
              Enviar WhatsApp
            </Button>
          </a>
          <a href={smsLink(phone, pitchMessage)}>
            <Button size="sm" variant="secondary" className="w-full">
              Enviar SMS
            </Button>
          </a>
        </div>
      ) : (
        <p className="mt-4 border-t border-brand-border pt-4 text-xs text-neutral-500">
          Sem telefone disponível para contacto direto.
        </p>
      )}
    </Card>
  );
}
