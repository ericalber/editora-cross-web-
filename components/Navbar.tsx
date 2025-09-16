"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "Início" },
  { href: "/noticias", label: "Notícias" },
  { href: "/livros", label: "Livros" },
  { href: "/autores", label: "Autores" },
  { href: "/contato", label: "Contato" },
];

const WHATSAPP_CONTACT =
  "https://wa.me/5511999999999?text=Ol%C3%A1%21%20Gostaria%20de%20falar%20com%20a%20Editora%20Cross.";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleToggle = () => setOpen((prev) => !prev);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    const [base, query] = href.split("?");
    const matchesPath = pathname === base || pathname.startsWith(`${base}/`);

    if (!query) {
      return matchesPath;
    }

    if (!matchesPath) {
      return false;
    }

    const queryParams = new URLSearchParams(query);
    for (const [key, value] of queryParams.entries()) {
      if (searchParams?.get(key) !== value) {
        return false;
      }
    }
    return true;
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Image
              src="/logo-cross.png"
              alt="Editora Cross"
              width={150}
              height={60}
              priority
            />
          </motion.div>
        </Link>
        <div className="hidden items-center gap-10 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold transition ${
                isActive(link.href)
                  ? "text-primary"
                  : "text-gray-700 hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={WHATSAPP_CONTACT}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Fale no WhatsApp
          </a>
        </div>
        <button
          type="button"
          aria-label="Abrir menu"
          aria-expanded={open}
          onClick={handleToggle}
          className="inline-flex items-center justify-center rounded-full border border-primary/30 p-2 text-primary transition hover:bg-primary/10 lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="border-t border-gray-200 bg-white px-6 pb-6 lg:hidden"
          >
            <div className="flex flex-col gap-3 pt-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-xl px-4 py-3 text-base font-semibold transition ${
                    isActive(link.href)
                      ? "bg-primary/10 text-primary"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={WHATSAPP_CONTACT}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full"
                onClick={() => setOpen(false)}
              >
                Fale no WhatsApp
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </nav>
  );
}
