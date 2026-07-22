"use client";

import { useState, useTransition } from "react";
import { updateLeadStatusAction, updateLeadNotesAction } from "@/app/leads/actions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const STATUS_OPTIONS = [
  { value: "novo", label: "Novo" },
  { value: "contactado", label: "Contactado" },
  { value: "em_negociacao", label: "Em negociação" },
  { value: "vendido", label: "Vendido" },
  { value: "descartado", label: "Descartado" },
];

export function LeadStatusPanel({
  leadId,
  initialStatus,
  initialNotes,
}: {
  leadId: string;
  initialStatus: string;
  initialNotes: string | null;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleStatusChange(newStatus: string) {
    setStatus(newStatus);
    startTransition(async () => {
      await updateLeadStatusAction(leadId, newStatus);
    });
  }

  function handleSaveNotes() {
    startTransition(async () => {
      await updateLeadNotesAction(leadId, notes);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <Card>
      <label className="mb-1 block text-xs font-medium text-neutral-400">Estado</label>
      <select
        value={status}
        onChange={(e) => handleStatusChange(e.target.value)}
        disabled={isPending}
        className="w-full rounded-lg border border-brand-border bg-brand-bg px-3.5 py-2.5 text-sm text-neutral-100 focus:border-brand-primary focus:outline-none"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <label className="mb-1 mt-4 block text-xs font-medium text-neutral-400">Notas</label>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={5}
        placeholder="Ex: falei com o gerente, disse para ligar depois das 15h..."
        className="w-full rounded-lg border border-brand-border bg-brand-bg px-3.5 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-brand-primary focus:outline-none"
      />
      <Button size="sm" className="mt-2" onClick={handleSaveNotes} disabled={isPending}>
        {saved ? "Guardado ✓" : "Guardar notas"}
      </Button>
    </Card>
  );
}
