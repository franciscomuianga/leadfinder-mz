/**
 * Links de contacto direto — abrem o WhatsApp/SMS já com o número e uma
 * mensagem pré-escrita, prontos a enviar (o utilizador só confirma).
 */

function normalizePhone(phone: string): string {
  // Remove espaços, traços, parênteses. Assume Moçambique (+258) se não
  // tiver indicativo internacional já incluído.
  const digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits.slice(1);
  if (digits.startsWith("258")) return digits;
  return `258${digits.replace(/^0/, "")}`;
}

export function whatsappLink(phone: string, message: string): string {
  const normalized = normalizePhone(phone);
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

export function smsLink(phone: string, message: string): string {
  return `sms:${phone}?body=${encodeURIComponent(message)}`;
}

export const PITCH_MESSAGES: Record<string, string> = {
  site: "Olá! Notei que o seu negócio ainda não tem um site — posso mostrar-lhe um exemplo pronto, sem compromisso?",
  fiado_facil:
    "Olá! Sou representante do Fiado Fácil, uma app simples para gerir o fiado dos seus clientes sem confusões de caderno. Posso explicar melhor?",
  gmb: "Olá! Notei que a ficha do seu negócio no Google podia estar mais completa/atualizada — posso ajudar a melhorá-la?",
};
