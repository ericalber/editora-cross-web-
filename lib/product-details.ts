import type { Product } from "@/data/products";

type ProductExtras = {
  formato?: string;
  acabamento?: string;
  idioma?: string;
  sumario?: string[];
};

const DEFAULT_EXTRAS: Required<Pick<ProductExtras, "formato" | "acabamento" | "idioma">> = {
  formato: "Brochura",
  acabamento: "Capa flexível",
  idioma: "Português (Brasil)",
};

const PRODUCT_EXTRAS: Record<string, ProductExtras> = {
  "teologia-da-esperanca": {
    sumario: [
      "Parte 1 · Fundamentos bíblicos para comunidades resilientes",
      "Parte 2 · Estudos de caso com indicadores de transformação",
      "Parte 3 · Roteiros de esperança para pequenos grupos",
    ],
  },
  "comentario-salmos-devocional": {
    formato: "Capa dura",
    sumario: [
      "Ciclos sazonais de devoção nos Salmos",
      "Trilhas semanais com perguntas e roteiros solidários",
      "Apêndice · Cartas e depoimentos dos leitores",
    ],
  },
  "fundamentos-da-fe-reformada": {
    sumario: [
      "Capítulo 1 · Credos clássicos e vocação contemporânea",
      "Capítulo 2 · Catequese em comunidades multiétnicas",
      "Capítulo 3 · Planos de discipulado para ministérios urbanos",
    ],
  },
  "atlas-biblico-interativo": {
    formato: "Espiral premium",
    acabamento: "Papel resistente + QR Codes interativos",
    sumario: [
      "Mapas cronológicos com leituras guiadas",
      "Rotas missionárias com camadas interativas",
      "Guia de estudos para classes e retiros",
    ],
  },
  "mentoria-para-lideres": {
    sumario: [
      "Sessão 1 · Diagnóstico rápido de equipes ministeriais",
      "Sessão 2 · Planos de cuidado emocional contínuo",
      "Sessão 3 · Calendário de mentorias trimestrais",
    ],
  },
  "familias-em-oracao": {
    formato: "Brochura com abas",
    acabamento: "Encadernação com bolso para fichas",
    sumario: [
      "Semana 1 · Ritmos de oração doméstica",
      "Semana 2 · Atividades multigeracionais",
      "Semana 3 · Encontros comunitários e acompanhamento",
    ],
  },
};

export function getProductExtras(slug: string): ProductExtras {
  return {
    ...DEFAULT_EXTRAS,
    ...PRODUCT_EXTRAS[slug],
  };
}

export function buildBookMetadata(product: Product) {
  const extras = getProductExtras(product.slug);
  const metadata = [
    { label: "Formato", value: extras.formato },
    { label: "Acabamento", value: extras.acabamento },
    { label: "Idioma", value: extras.idioma },
    { label: "Páginas", value: `${product.paginas}` },
    { label: "ISBN", value: product.isbn },
    { label: "Categoria", value: product.categoria },
  ];

  return metadata.filter((item) => Boolean(item.value));
}

export function getProductSummary(product: Product) {
  const extras = PRODUCT_EXTRAS[product.slug];
  return extras?.sumario ?? null;
}
