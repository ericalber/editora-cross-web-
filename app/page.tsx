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
import { ScrollReveal } from "@/components/ScrollReveal";

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
    "william-barros",
    "elias-soares",
    "cezar-cavalcantes",
  ];
  const autores = featuredAuthorSlugs
    .map((slug) => getAuthorBySlug(slug))
    .filter(
      (author): author is NonNullable<ReturnType<typeof getAuthorBySlug>> => Boolean(author),
    );

  const worshipVideoUrl =
    process.env.NEXT_PUBLIC_WORSHIP_VIDEO_URL ??
    "https://www.youtube.com/embed/?rel=0&listType=search&list=Julliany%20Souza%20Quem%20%C3%89%20Esse";

  return (
    <main className="bg-background pb-16 pt-28">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6">
        <div className="glass-panel glass-panel--hero">
          <HeroSlider />
        </div>

        <ScrollReveal as="section" className="glass-panel space-y-6">
          <SectionTitle title="Notícias em Destaque" viewAllHref="/noticias" />
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <NewsGrid posts={news} />
            </div>
            <NewsTicker items={tickerItems} />
          </div>
        </ScrollReveal>

        <ScrollReveal as="section" className="glass-panel space-y-6">
          <SectionTitle title="Lançamentos" viewAllHref="/livros?filtro=lancamentos" />
          <ProductsCarousel data={releases} />
        </ScrollReveal>

        <ScrollReveal as="section" className="glass-panel space-y-6">
          <SectionTitle title="Mais Vendidos" viewAllHref="/livros?filtro=mais-vendidos" />
          <ProductsCarousel data={bestSellers} />
        </ScrollReveal>

        <ScrollReveal as="section" className="glass-panel space-y-6">
          <SectionTitle title="Autores em Destaque" viewAllHref="/autores" />
          <AuthorCarousel autores={autores} />
        </ScrollReveal>

        <ScrollReveal as="section" className="glass-panel space-y-4">
          <SectionTitle title="Vídeo" />
          <div className="glass-card aspect-video w-full overflow-hidden">
            <iframe
              className="h-full w-full"
              src={worshipVideoUrl}
              title="Julliany Souza - Quem é Esse?"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Se o vídeo não carregar, <a
              href="https://www.youtube.com/results?search_query=Julliany+Souza+Quem+é+Esse"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary underline"
            >assista diretamente no YouTube</a>.
          </p>
        </ScrollReveal>
      </div>
    </main>
  );
}
