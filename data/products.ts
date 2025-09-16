export type Product = {
  slug: string;
  titulo: string;
  autorSlug: string;
  preco: number;
  desconto?: number;
  categoria: string;
  cover: string;
  imagens: string[];
  sinopse: string;
  isbn: string;
  paginas: number;
  createdAt: string;
  tags?: string[];
};

export const products: Product[] = [
  {
    slug: "teologia-da-esperanca",
    titulo: "Teologia da Esperança",
    autorSlug: "joao-pereira",
    preco: 69.9,
    desconto: 20,
    categoria: "Teologia",
    cover: "/next.svg",
    imagens: ["/next.svg", "/next.svg"],
    sinopse:
      "Uma análise acessível sobre como a esperança influencia a prática cristã em contextos urbanos e missionais.",
    isbn: "978-65-900001-01-0",
    paginas: 320,
    createdAt: "2025-02-14",
    tags: ["bestseller", "esperanca"],
  },
  {
    slug: "comentario-salmos-devocional",
    titulo: "Comentário Devocional dos Salmos",
    autorSlug: "ana-paula-souza",
    preco: 54.5,
    categoria: "Devocional",
    cover: "/next.svg",
    imagens: ["/next.svg"],
    sinopse:
      "Reflexões diárias com perguntas e aplicações para pequenos grupos, abordando cinquenta salmos selecionados.",
    isbn: "978-65-900001-02-7",
    paginas: 256,
    createdAt: "2024-12-20",
    tags: ["bestseller", "devocional"],
  },
  {
    slug: "fundamentos-da-fe-reformada",
    titulo: "Fundamentos da Fé Reformada",
    autorSlug: "marcos-lima",
    preco: 42.9,
    categoria: "Doutrina",
    cover: "/next.svg",
    imagens: ["/next.svg", "/next.svg"],
    sinopse:
      "Os cinco solas explicados de forma pastoral, com sugestões de estudos em grupo e recursos multimídia.",
    isbn: "978-65-900001-03-4",
    paginas: 190,
    createdAt: "2025-01-05",
    tags: ["lancamento"],
  },
  {
    slug: "vidas-transformadas",
    titulo: "Vidas Transformadas",
    autorSlug: "equipa-editora",
    preco: 59.9,
    desconto: 10,
    categoria: "Testemunhos",
    cover: "/next.svg",
    imagens: ["/next.svg", "/next.svg", "/next.svg"],
    sinopse:
      "Histórias reais de graça radical acompanhadas de roteiros para discipulado e grupos caseiros.",
    isbn: "978-65-900001-04-1",
    paginas: 540,
    createdAt: "2025-02-01",
    tags: ["bestseller", "discipulado"],
  },
  {
    slug: "mentoria-para-lideres",
    titulo: "Mentoria para Líderes Cristãos",
    autorSlug: "ricardo-menezes",
    preco: 64.9,
    categoria: "Liderança",
    cover: "/next.svg",
    imagens: ["/next.svg", "/next.svg"],
    sinopse:
      "Ferramentas práticas para mentorear líderes emergentes com fundamentos bíblicos e estudo de casos reais.",
    isbn: "978-65-900001-05-8",
    paginas: 288,
    createdAt: "2025-01-18",
    tags: ["lideranca"],
  },
  {
    slug: "manual-professor-biblico",
    titulo: "Manual do Professor Bíblico",
    autorSlug: "claudia-pires",
    preco: 37.9,
    categoria: "Educação Cristã",
    cover: "/next.svg",
    imagens: ["/next.svg"],
    sinopse:
      "Planejamento criativo e ferramentas para escolas bíblicas, com planos de aula e recursos digitais.",
    isbn: "978-65-900001-06-5",
    paginas: 180,
    createdAt: "2024-11-25",
    tags: ["educacao"],
  },
  {
    slug: "atlas-biblico-interativo",
    titulo: "Atlas Bíblico Interativo",
    autorSlug: "helena-barreto",
    preco: 109.9,
    desconto: 5,
    categoria: "Referência",
    cover: "/next.svg",
    imagens: ["/next.svg", "/next.svg"],
    sinopse:
      "Viagens visuais pela narrativa bíblica com QR Codes para experiências imersivas e comentários arqueológicos.",
    isbn: "978-65-900001-07-2",
    paginas: 400,
    createdAt: "2025-02-10",
    tags: ["lancamento"],
  },
  {
    slug: "comentario-pentateuco",
    titulo: "Comentário Exegético do Pentateuco",
    autorSlug: "equipe-academica",
    preco: 124.9,
    categoria: "Acadêmico",
    cover: "/next.svg",
    imagens: ["/next.svg", "/next.svg"],
    sinopse:
      "Notas técnicas, análises e aplicações pastorais para cada passagem do Pentateuco.",
    isbn: "978-65-900001-08-9",
    paginas: 680,
    createdAt: "2025-01-30",
    tags: ["bestseller", "academico"],
  },
  {
    slug: "devocional-joao-40-dias",
    titulo: "40 Dias no Evangelho de João",
    autorSlug: "sonia-cavalcanti",
    preco: 29.9,
    categoria: "Devocional",
    cover: "/next.svg",
    imagens: ["/next.svg"],
    sinopse:
      "Devocional prático com perguntas para conversa, orações guiadas e desafios missionais.",
    isbn: "978-65-900001-09-6",
    paginas: 160,
    createdAt: "2024-10-15",
    tags: ["bestseller", "devocional"],
  },
  {
    slug: "guia-estudos-atos",
    titulo: "Guia de Estudos em Atos",
    autorSlug: "eduardo-nascimento",
    preco: 48.9,
    categoria: "Estudos Bíblicos",
    cover: "/next.svg",
    imagens: ["/next.svg", "/next.svg"],
    sinopse:
      "Mapas, atividades e planos de aula para estudar Atos em comunidade, com material multimídia.",
    isbn: "978-65-900001-10-2",
    paginas: 210,
    createdAt: "2024-12-05",
    tags: ["estudos"],
  },
  {
    slug: "discipulado-urbano",
    titulo: "Discipulado Urbano",
    autorSlug: "joao-pereira",
    preco: 58.0,
    categoria: "Missão",
    cover: "/next.svg",
    imagens: ["/next.svg", "/next.svg"],
    sinopse:
      "Estratégias missionais para grandes cidades com histórias de comunidades em transformação.",
    isbn: "978-65-900001-11-9",
    paginas: 240,
    createdAt: "2025-02-20",
    tags: ["lancamento"],
  },
  {
    slug: "familias-em-oracao",
    titulo: "Famílias em Oração",
    autorSlug: "ana-paula-souza",
    preco: 44.0,
    desconto: 15,
    categoria: "Família",
    cover: "/next.svg",
    imagens: ["/next.svg", "/next.svg", "/next.svg"],
    sinopse:
      "Planos devocionais semanais para fortalecer a oração em família com atividades interativas.",
    isbn: "978-65-900001-12-6",
    paginas: 200,
    createdAt: "2025-01-25",
    tags: ["familia", "bestseller"],
  },
];
