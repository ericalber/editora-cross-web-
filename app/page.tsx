import type { Metadata } from "next";
import { HeroSlider } from "@/components/HeroSlider";
import { SectionTitle } from "@/components/SectionTitle";
import { NewsGrid } from "@/components/NewsGrid";
import { NewsTicker } from "@/components/NewsTicker";
import { ProductsCarousel } from "@/components/ProductsCarousel";
import { AuthorCarousel } from "@/components/AuthorCarousel";
import { getAuthorBySlug, getBestSellers, getNewReleases } from "@/lib/store";
import { getNews, getTopNews } from "@/lib/news";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Início",
  description:
    "Portal da Editora Cross com notícias, lançamentos editoriais, catálogo de livros e experiências digitais para igrejas e comunidades cristãs.",
  path: "/",
});

export default function Home() {
  const news = getNews().slice(0, 6);
  const tickerItems = getTopNews(10).map((item) => ({
    slug: item.slug,
    titulo: item.titulo,
  }));
  const releases = getNewReleases();
  const bestSellers = getBestSellers();
  const featuredAuthorSlugs = [
    "eric-alberto",
    "walter-bastos",
    "jamiel-lopes",
    "josue-brandao",
    "denilson-lima",
    "bispa-gi",
    "elias-soares",
    "cezar-cavalcantes",
  ];
  const autores = featuredAuthorSlugs
    .map((slug) => getAuthorBySlug(slug))
    .filter(
      (author): author is NonNullable<ReturnType<typeof getAuthorBySlug>> => Boolean(author),
    );

  return (
    <main className="bg-gray-50 pb-16 pt-28">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6">
        <HeroSlider />

        <section className="space-y-6">
          <SectionTitle title="Notícias em Destaque" viewAllHref="/noticias" />
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <NewsGrid posts={news} />
            </div>
            <NewsTicker items={tickerItems} />
          </div>
        </section>

        <section className="space-y-6">
          <SectionTitle title="Lançamentos" viewAllHref="/livros?filtro=lancamentos" />
          <ProductsCarousel data={releases} />
        </section>

        <section className="space-y-6">
          <SectionTitle title="Mais Vendidos" viewAllHref="/livros?filtro=mais-vendidos" />
          <ProductsCarousel data={bestSellers} />
        </section>

        <section className="space-y-6">
          <SectionTitle title="Autores em Destaque" viewAllHref="/autores" />
          <AuthorCarousel autores={autores} />
        </section>

        <section className="space-y-4">
          <SectionTitle title="Vídeo" />
          <div className="aspect-video w-full overflow-hidden rounded-3xl shadow-xl">
            <iframe
              className="h-full w-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Vídeo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </section>
      </div>
    </main>
  );
}
