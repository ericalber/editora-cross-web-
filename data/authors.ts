export type Author = {
  slug: string;
  nome: string;
  avatar: string;
  bio: string;
};

export const authors: Author[] = [
  {
    slug: "joao-pereira",
    nome: "João Pereira",
    avatar: "/next.svg",
    bio: "Pastor e pesquisador em teologia bíblica, atua no desenvolvimento de cursos e redes de discipulado urbano.",
  },
  {
    slug: "ana-paula-souza",
    nome: "Ana Paula Souza",
    avatar: "/next.svg",
    bio: "Escritora e líder de pequenos grupos, coordena iniciativas de formação espiritual para famílias e ministérios femininos.",
  },
  {
    slug: "marcos-lima",
    nome: "Marcos Lima",
    avatar: "/next.svg",
    bio: "Professor de história da igreja e conferencista, com foco em teologia reformada e missão integral.",
  },
  {
    slug: "claudia-pires",
    nome: "Cláudia Pires",
    avatar: "/next.svg",
    bio: "Educadora cristã responsável por projetos de capacitação docente e design de experiências de aprendizagem.",
  },
  {
    slug: "ricardo-menezes",
    nome: "Ricardo Menezes",
    avatar: "/next.svg",
    bio: "Mentor de líderes e consultor ministerial, acompanha igrejas em processos de transição e planejamento visionário.",
  },
  {
    slug: "helena-barreto",
    nome: "Helena Barreto",
    avatar: "/next.svg",
    bio: "Arqueóloga bíblica e comunicadora digital que conecta descobertas históricas à leitura devocional cotidiana.",
  },
  {
    slug: "equipe-academica",
    nome: "Equipe Acadêmica Cross",
    avatar: "/next.svg",
    bio: "Time interdisciplinar de professores, pesquisadores e editores dedicados a produzir materiais exegéticos e acadêmicos.",
  },
  {
    slug: "equipa-editora",
    nome: "Equipe Editora Cross",
    avatar: "/next.svg",
    bio: "Colegiado editorial responsável por curadoria de testemunhos, recursos devocionais e boxes temáticos.",
  },
];
