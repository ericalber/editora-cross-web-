import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionTitle } from "@/components/SectionTitle";
import { getAuthors } from "@/lib/store";
import { buildMetadata } from "@/lib/seo";

const autores = getAuthors();

export const metadata: Metadata = buildMetadata({
  title: "Autores",
  description:
    "Conheça os autores, pesquisadores e mentores da Editora Cross com mini-bios, curiosidades e links para obras no catálogo.",
  path: "/autores",
});

export default function AuthorsPage() {
  return (
    <main className="bg-gray-50 pb-16 pt-28">
      <div className="mx-auto max-w-5xl space-y-10 px-4 sm:px-6">
        <SectionTitle
          title="Autores Editora Cross"
          subtitle="Conheça os ministérios que colaboram nos nossos projetos editoriais."
        />
        <div className="grid gap-6 sm:grid-cols-2">
          {autores.map((autor) => (
            <Link
              key={autor.slug}
              href={`/autores/${autor.slug}`}
              className="group flex items-center gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-20 w-20 overflow-hidden rounded-full ring-2 ring-primary/20">
                <Image
                  src={autor.avatar}
                  alt={`Retrato do autor ${autor.nome}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                  loading="lazy"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary">
                  {autor.nome}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3">{autor.miniBio}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
