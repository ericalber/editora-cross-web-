import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Entre em contato com a Editora Cross para informações sobre catálogo, parcerias, eventos e suporte ao cliente.",
};

function ContactForm() {
  return (
    <form className="space-y-4" name="contato-editora-cross" action="#" method="post">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="contato-nome" className="text-sm font-medium text-gray-700">
            Nome
          </label>
          <input
            id="contato-nome"
            name="nome"
            type="text"
            autoComplete="name"
            required
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="Seu nome completo"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="contato-email" className="text-sm font-medium text-gray-700">
            E-mail
          </label>
          <input
            id="contato-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="voce@exemplo.com"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="contato-assunto" className="text-sm font-medium text-gray-700">
          Assunto
        </label>
        <input
          id="contato-assunto"
          name="assunto"
          type="text"
          required
          className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="Sobre o que você quer falar?"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="contato-mensagem" className="text-sm font-medium text-gray-700">
          Mensagem
        </label>
        <textarea
          id="contato-mensagem"
          name="mensagem"
          rows={5}
          required
          className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="Escreva sua mensagem"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="sr-only" htmlFor="contato-canal-preferido">
          Canal preferido
        </label>
        <select
          id="contato-canal-preferido"
          name="canal"
          className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-600 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          defaultValue=""
        >
          <option value="" disabled>
            Como prefere ser contatado?
          </option>
          <option value="email">E-mail</option>
          <option value="telefone">Telefone</option>
          <option value="whatsapp">WhatsApp</option>
        </select>
      </div>
      <div className="flex items-center justify-between flex-col gap-3 sm:flex-row">
        <p className="text-sm text-gray-500">
          Responderemos o quanto antes. Preferência por WhatsApp? Use o botão no topo ou o link direto abaixo.
        </p>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/40"
        >
          Enviar mensagem
        </button>
      </div>
    </form>
  );
}

export default function ContactPage() {
  return (
    <main className="bg-gray-50 pb-16 pt-28">
      <div className="mx-auto max-w-5xl space-y-12 px-4 sm:px-6">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="text-primary hover:text-primary/80">
                Início
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li className="text-gray-400">Contato</li>
          </ol>
        </nav>

        <div className="space-y-4 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.4em] text-secondary">Contato</span>
          <h1 className="text-4xl font-semibold text-gray-900">Fale com a Editora Cross</h1>
          <p className="text-sm text-gray-600 md:text-base">
            Estamos disponíveis para apoiar igrejas, livreiros e leitores. Preencha o formulário ou utilize os canais diretos abaixo.
          </p>
        </div>

        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Envie sua mensagem</h2>
            <p className="mb-6 text-sm text-gray-500">
              Dúvidas sobre catálogo, pedidos corporativos, eventos ou suporte? Conte para a gente.
            </p>
            <Suspense fallback={<div className="h-32 rounded-2xl bg-gray-100" />}>
              <ContactForm />
            </Suspense>
          </div>

          <aside className="space-y-6 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-gray-900">Canais diretos</h2>
              <p className="text-sm text-gray-500">
                Segunda a sexta, 9h às 18h (horário de Brasília).
              </p>
            </div>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <strong className="text-gray-900">E-mail:</strong> contato@editoracross.com
              </p>
              <p>
                <strong className="text-gray-900">Telefone:</strong> +55 (11) 99999-9999
              </p>
              <p>
                <strong className="text-gray-900">Endereço:</strong> Avenida Central, 1234 — São Paulo, SP
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-secondary">Outros canais</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/noticias" className="text-primary hover:text-primary/80">
                    Últimas notícias
                  </Link>
                </li>
                <li>
                  <Link href="/livros" className="text-primary hover:text-primary/80">
                    Catálogo de livros
                  </Link>
                </li>
                <li>
                  <a
                    href="https://wa.me/5511999999999"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80"
                  >
                    Atendimento via WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
