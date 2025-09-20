import { products } from "@/data/products";
import { authors } from "@/data/authors";

export const getProducts = () => products;

export const getNewReleases = (n = 8) =>
  [...products]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, n);

export const getBestSellers = (n = 8) =>
  products.filter((product) => product.tags?.includes("bestseller")).slice(0, n);

export const getProductBySlug = (slug: string) =>
  products.find((product) => product.slug === slug);

export const getProductsByAuthor = (authorSlug: string) => {
  const author = authors.find((item) => item.slug === authorSlug);
  if (!author) {
    return [];
  }
  return products.filter((product) => product.autorId === author.id);
};

export const getAuthors = () => authors;

export const getAuthorBySlug = (slug: string) =>
  authors.find((author) => author.slug === slug);

export const getAuthorById = (id: string) =>
  authors.find((author) => author.id === id);

export function whatsappLink(titulo: string) {
  const msg = `Quero o livro ${titulo}`;
  return `https://wa.me/5511999999999?text=${encodeURIComponent(msg)}`;
}

export const getProductSlugs = () => products.map((product) => product.slug);

export const getAuthorSlugs = () => authors.map((author) => author.slug);

export const getProductCategories = () =>
  Array.from(new Set(products.map((product) => product.categoria)));
