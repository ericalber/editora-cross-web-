export type News = {
  slug: string;
  titulo: string;
  resumo: string;
  capa: string;
  dataISO: string;
  tags: string[];
};

export const news: News[] = [
  {
    slug: "conferencia-cross-2025",
    titulo: "Conferência Editora Cross 2025 abre inscrições",
    resumo:
      "Evento celebra dez anos da editora com trilhas sobre formação espiritual, inovação editorial e missão urbana.",
    capa: "/images/news/conferencia-cross-2025.svg",
    dataISO: "2025-02-02",
    tags: ["eventos", "formacao"],
  },
  {
    slug: "parceria-plataforma-ebooks",
    titulo: "Catálogo digital ganha distribuição internacional",
    resumo:
      "Parceria com plataforma de e-books ampliará o alcance de obras devocionais e acadêmicas em três idiomas.",
    capa: "/images/news/parceria-plataforma-ebooks.svg",
    dataISO: "2025-01-28",
    tags: ["mercado", "ebooks"],
  },
  {
    slug: "lancamento-atlas-interativo",
    titulo: "Atlas bíblico interativo chega às livrarias",
    resumo:
      "Projeto integra realidade aumentada, mapas comentados e roteiros devocionais para grupos de estudo.",
    capa: "/images/news/lancamento-atlas-interativo.svg",
    dataISO: "2025-02-10",
    tags: ["lancamentos", "referencia"],
  },
  {
    slug: "curso-hermeneutica-online",
    titulo: "Curso de hermenêutica abre turma especial",
    resumo:
      "Material acompanha o lançamento do Comentário Exegético do Pentateuco e oferece mentoria ao vivo.",
    capa: "/images/news/curso-hermeneutica-online.svg",
    dataISO: "2025-02-05",
    tags: ["educacao", "formacao"],
  },
  {
    slug: "projeto-leitura-nordeste",
    titulo: "Projeto de leitura alcança 200 igrejas no Nordeste",
    resumo:
      "Mutirão distribuiu 12 mil exemplares da série Vidas Transformadas em comunidades sertanejas.",
    capa: "/images/news/projeto-leitura-nordeste.svg",
    dataISO: "2025-01-20",
    tags: ["missoes", "discipulado"],
  },
  {
    slug: "podcast-esperanca-temporada",
    titulo: "Podcast estreia temporada sobre esperança cristã",
    resumo:
      "Serão doze episódios com entrevistas, devocionais guiados e materiais de apoio gratuitos.",
    capa: "/images/news/podcast-esperanca-temporada.svg",
    dataISO: "2025-02-12",
    tags: ["midia", "podcast"],
  },
  {
    slug: "premio-ana-paula-souza",
    titulo: "Ana Paula Souza recebe prêmio nacional",
    resumo:
      "Autora do Comentário Devocional dos Salmos ganha destaque em premiação de literatura cristã.",
    capa: "/images/news/premio-ana-paula-souza.svg",
    dataISO: "2025-01-15",
    tags: ["premios", "autores"],
  },
  {
    slug: "campanha-bibliotecas-comunitarias",
    titulo: "Campanha solidária equipa bibliotecas comunitárias",
    resumo:
      "Iniciativa arrecadou mais de dois mil livros para projetos sociais em cinco estados.",
    capa: "/images/news/campanha-bibliotecas-comunitarias.svg",
    dataISO: "2024-12-20",
    tags: ["responsabilidade", "impacto"],
  },
  {
    slug: "app-leitura-guiada",
    titulo: "Aplicativo de leitura guiada chega às lojas",
    resumo:
      "Ferramenta oferece planos devocionais, lembretes e trilhas colaborativas para grupos de igreja.",
    capa: "/images/news/app-leitura-guiada.svg",
    dataISO: "2025-01-30",
    tags: ["tecnologia", "devocional"],
  },
  {
    slug: "seminario-lideranca-local",
    titulo: "Seminário para liderança local reúne 800 participantes",
    resumo:
      "Encontro apresentou ferramentas do livro Mentoria para Líderes Cristãos e estudos de caso regionais.",
    capa: "/images/news/seminario-lideranca-local.svg",
    dataISO: "2025-02-18",
    tags: ["lideranca", "eventos"],
  },
  {
    slug: "devocional-familias-lancamento",
    titulo: "Devocional Famílias em Oração ganha versão ampliada",
    resumo:
      "Nova edição inclui trilhas semanais para adolescentes e crianças com desafios criativos.",
    capa: "/images/news/devocional-familias-lancamento.svg",
    dataISO: "2025-01-25",
    tags: ["familia", "lancamentos"],
  },
  {
    slug: "clube-leitura-virtual",
    titulo: "Clube de leitura virtual abre novas vagas",
    resumo:
      "Comunidade on-line oferece encontros mensais com autores e acesso antecipado a capítulos inéditos.",
    capa: "/images/news/clube-leitura-virtual.svg",
    dataISO: "2025-02-08",
    tags: ["comunidade", "leitura"],
  },
];
