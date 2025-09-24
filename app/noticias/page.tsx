import type { Metadata } from "next";
import Link from "next/link";
import { SectionTitle } from "@/components/SectionTitle";
import { NewsGrid } from "@/components/NewsGrid";
import { NewsSidebar } from "@/components/NewsSidebar";
import { ScrollReveal } from "@/components/ScrollReveal";
import { getNews, getTopNews } from "@/lib/news";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Notícias",
  description:
    "Acompanhe boletins, eventos e iniciativas missionais da Editora Cross com reportagens exclusivas e análises sobre o mercado editorial cristão.",
  path: "/noticias",
});

const PER_PAGE = 6;

interface NewsPageProps {
  searchParams?: {
    page?: string;
    tag?: string;
  };
}

export default function NewsPage({ searchParams }: NewsPageProps) {
  const currentPage = Math.max(Number(searchParams?.page ?? "1"), 1);
  const tagFilter = searchParams?.tag?.toLowerCase().trim();
  const fullNews = getNews();
  const allNews = fullNews.filter((item) => {
    if (!tagFilter) {
      return true;
    }
    return item.tags.some((tag) => tag.toLowerCase() === tagFilter);
  });
  const start = (currentPage - 1) * PER_PAGE;
  const pageItems = allNews.slice(start, start + PER_PAGE);
  const totalPages = Math.max(Math.ceil(allNews.length / PER_PAGE), 1);

  const recommended = getTopNews(3);
  const recommendedSlugs = new Set(recommended.map((item) => item.slug));
  const popular = fullNews.filter((item) => !recommendedSlugs.has(item.slug)).slice(0, 5);
  const categories = Array.from(
    new Set(fullNews.flatMap((item) => item.tags)).values(),
  ).slice(0, 10);

  return (
    <main className="bg-background pb-16 pt-28">
      <div className="mx-auto max-w-6xl space-y-10 px-4 sm:px-6">
        <SectionTitle title="Notícias" subtitle="Acompanhe as últimas novidades da Editora Cross." />

        <div className="grid gap-8 md:grid-cols-[2fr_0.85fr]">
          <ScrollReveal>
            <NewsGrid posts={pageItems} />
          </ScrollReveal>
          <ScrollReveal as="div">
            <NewsSidebar recommended={recommended} popular={popular} categories={categories} />
          </ScrollReveal>
        </div>

        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-muted-foreground">
            Página {currentPage} de {totalPages}
          </span>
          <div className="flex items-center gap-3">
            <Link
              href={currentPage > 1 ? `/noticias?page=${currentPage - 1}` : "#"}
              aria-disabled={currentPage === 1}
              className={`rounded-full border px-4 py-2 font-semibold transition ${
                currentPage === 1
                  ? "cursor-not-allowed border-border/40 text-muted-foreground"
                  : "border-primary/30 text-primary hover:bg-primary/10"
              }`}
            >
              Anterior
            </Link>
            <Link
              href={currentPage < totalPages ? `/noticias?page=${currentPage + 1}` : "#"}
              aria-disabled={currentPage === totalPages}
              className={`rounded-full border px-4 py-2 font-semibold transition ${
                currentPage === totalPages
                  ? "cursor-not-allowed border-border/40 text-muted-foreground"
                  : "border-primary/30 text-primary hover:bg-primary/10"
              }`}
            >
              Próxima
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
