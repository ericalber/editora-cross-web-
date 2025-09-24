import Link from "next/link";
import type { News } from "@/data/news";
import { formatNewsDate } from "@/lib/news-format";

interface NewsSidebarProps {
  recommended: News[];
  popular: News[];
  categories: string[];
}

export function NewsSidebar({ recommended, popular, categories }: NewsSidebarProps) {
  return (
    <aside
      className="news-sidebar"
      aria-label="Navegação complementar de notícias"
    >
      <section className="news-sidebar-section">
        <h2 className="news-sidebar-title">Recomendadas</h2>
        <ul className="news-sidebar-list">
          {recommended.map((item) => (
            <li key={item.slug}>
              <Link href={`/noticias/${item.slug}`} className="news-sidebar-link">
                <span className="news-sidebar-link-label">{item.titulo}</span>
                <span className="news-sidebar-link-meta">{formatNewsDate(item.dataISO)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="news-sidebar-section">
        <h2 className="news-sidebar-title">Mais lidas</h2>
        <ol className="news-sidebar-list" type="1">
          {popular.map((item, index) => (
            <li key={item.slug}>
              <Link href={`/noticias/${item.slug}`} className="news-sidebar-link">
                <span className="news-sidebar-link-prefix">{String(index + 1).padStart(2, "0")}</span>
                <span className="news-sidebar-link-label">{item.titulo}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="news-sidebar-section">
        <h2 className="news-sidebar-title">Categorias</h2>
        <div className="news-sidebar-tags">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/noticias?tag=${encodeURIComponent(category)}`}
              className="news-sidebar-tag"
            >
              #{category}
            </Link>
          ))}
        </div>
      </section>
    </aside>
  );
}
