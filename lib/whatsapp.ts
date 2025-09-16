import { whatsappLink } from "@/lib/store";

export function buildWhatsAppPurchaseLink(productTitle: string): string {
  return whatsappLink(productTitle);
}
