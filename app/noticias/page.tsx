import Link from "next/link";
import { SectionTitle } from "@/components/SectionTitle";
import { NewsGrid } from "@/components/NewsGrid";
import { NewsTicker } from "@/components/NewsTicker";
import { getNews, getTopNews } from "@/lib/store";

const PER_PAGE = 6;

interface NewsPageProps {
  searchParams?: {
    page?: string;
  };
}

export default function NewsPage({ searchParams }: NewsPageProps) {
  const currentPage = Math.max(Number(searchParams?.page ?? "1"), 1);
  const allNews = getNews();
  const start = (currentPage - 1) * PER_PAGE;
  const pageItems = allNews.slice(start, start + PER_PAGE);
  const totalPages = Math.max(Math.ceil(allNews.length / PER_PAGE), 1);

  const tickerItems = getTopNews(10).map((item) => ({ slug: item.slug, titulo: item.titulo }));

  return (
    <main className="bg-gray-50 pb-16 pt-28">
      <div className="mx-auto max-w-6xl space-y-10 px-4 sm:px-6">
        <SectionTitle title="Notícias" subtitle="Acompanhe as últimas novidades da Editora Cross." />

        <div className="grid gap-8 md:grid-cols-[2fr_0.9fr]">
          <NewsGrid posts={pageItems} />
          <NewsTicker items={tickerItems} />
        </div>

        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-gray-500">
            Página {currentPage} de {totalPages}
          </span>
          <div className="flex items-center gap-3">
            <Link
              href={currentPage > 1 ? `/noticias?page=${currentPage - 1}` : "#"}
              aria-disabled={currentPage === 1}
              className={`rounded-full border px-4 py-2 font-semibold transition ${
                currentPage === 1
                  ? "cursor-not-allowed border-gray-200 text-gray-300"
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
                  ? "cursor-not-allowed border-gray-200 text-gray-300"
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
