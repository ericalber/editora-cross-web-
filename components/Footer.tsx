import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 bg-gray-900 text-gray-300">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12 md:flex-row md:items-start md:justify-between">
        <div className="space-y-4">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image
              src="/logo-cross.png"
              alt="Editora Cross"
              width={140}
              height={56}
            />
          </Link>
          <p className="max-w-sm text-sm text-gray-400">
            Recursos editoriais que fortalecem a igreja, conectando conteúdo bíblico a contextos reais com excelência e criatividade.
          </p>
        </div>
        <div className="grid flex-1 grid-cols-1 gap-8 sm:grid-cols-2">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
              Contato
            </h3>
            <ul className="space-y-2 text-sm">
              <li>contato@editoracross.com</li>
              <li>+55 (11) 99999-9999</li>
              <li>São Paulo • Brasil</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
              Navegação
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/noticias" className="hover:text-secondary">
                  Notícias
                </Link>
              </li>
              <li>
                <Link href="/livros" className="hover:text-secondary">
                  Livros
                </Link>
              </li>
              <li>
                <Link href="/autores" className="hover:text-secondary">
                  Autores
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="hover:text-secondary">
                  Sobre
                </Link>
              </li>
              <li>
                <Link href="/contato" className="hover:text-secondary">
                  Contato
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Editora Cross. Todos os direitos reservados.
      </div>
    </footer>
  );
}
