import livrosJson from "@/conteudo/livros.json";

export type Product = {
  id: string;
  slug: string;
  titulo: string;
  subtitulo: string;
  sinopse: string;
  preco: number;
  desconto?: number;
  categoria: string;
  autorId: string;
  capa: string;
  galeria: string[];
  isbn: string;
  paginas: number;
  createdAt: string;
  tags?: string[];
};

const livrosData: Product[] = livrosJson;

export const products = livrosData;
