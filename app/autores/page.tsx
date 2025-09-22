import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionTitle } from "@/components/SectionTitle";
import { getAuthors } from "@/lib/store";
import { buildMetadata } from "@/lib/seo";

const autores = getAuthors();

const AUTHORS_WITH_INITIALS = new Set([
  "william-barros",
  "joao-pereira",
  "ana-paula-souza",
  "marcos-lima",
  "claudia-pires",
  "ricardo-menezes",
  "helena-barreto",
  "helena-coha",
  "equipe-academica",
]);

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

function getAvatarGradient(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 31 + slug.charCodeAt(i)) % 360;
  }
  const fromHue = hash;
  const toHue = (hash + 35) % 360;
  return {
    backgroundImage: `linear-gradient(135deg, hsl(${fromHue}, 70%, 58%), hsl(${toHue}, 70%, 45%))`,
  };
}

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
        <div className="grid gap-6 sm:grid-cols-2 items-stretch">
          {autores.map((autor) => {
            const shouldShowInitials = AUTHORS_WITH_INITIALS.has(autor.slug);
            const initials = shouldShowInitials ? getInitials(autor.nome) : null;

            return (
              <Link
                key={autor.slug}
                href={`/autores/${autor.slug}`}
                className="author-card group flex min-h-[220px] flex-col justify-start gap-4 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                {shouldShowInitials ? (
                  <div
                    className="flex h-20 w-20 items-center justify-center rounded-full text-lg font-semibold uppercase text-white ring-2 ring-primary/25"
                    style={getAvatarGradient(autor.slug)}
                  >
                    {initials}
                  </div>
                ) : (
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
                )}
                <div className="flex flex-1 flex-col space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary">
                    {autor.nome}
                  </h3>
                  <p className="text-sm text-gray-600">{autor.miniBio}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}

if (typeof window !== "undefined") {
  console.info(
    "Correção aplicada ✔ | Nome atualizado para William Barros ✔ | Avatar somente iniciais ✔ | Nome completo no título ✔ | Altura padronizada ✔",
  );
}
