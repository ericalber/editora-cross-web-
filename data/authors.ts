import autoresJson from "@/conteudo/autores.json";

export type Author = {
  id: string;
  slug: string;
  nome: string;
  miniBio: string;
  curiosidade: string;
  avatar: string;
};

const autoresData: Author[] = autoresJson;

export const authors = autoresData;
