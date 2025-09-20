import fs from "node:fs";
import path from "node:path";
import type { News } from "@/data/news";
import { news } from "@/data/news";

const NEWS_DIR = path.join(process.cwd(), "conteudo", "noticias");

export type NewsArticle = News & {
  categoria?: string;
  seoDescription?: string;
  conteudo?: string;
  dataPublicacao?: string;
};

type Frontmatter = Record<string, string>;

const cache = new Map<string, { frontmatter: Frontmatter; markdown: string; html: string }>();

export const getNews = (): NewsArticle[] =>
  mergeNewsWithContent(news).sort((a, b) => b.dataISO.localeCompare(a.dataISO));

export const getTopNews = (n = 10) => getNews().slice(0, n);

export const getNewsBySlug = (slug: string) =>
  mergeNewsWithContent(news).find((item) => item.slug === slug);

export const getNewsSlugs = () => news.map((item) => item.slug);

function mergeNewsWithContent(base: News[]): NewsArticle[] {
  return base.map((item) => {
    const content = loadNewsArticle(item.slug);
    if (!content) {
      return { ...item };
    }
    return {
      ...item,
      conteudo: content.html,
      categoria: content.frontmatter.category ?? content.frontmatter.categoria,
      seoDescription: content.frontmatter.seoDescription,
      dataPublicacao: content.frontmatter.date,
    };
  });
}

function loadNewsArticle(slug: string) {
  if (cache.has(slug)) {
    return cache.get(slug)!;
  }
  const filePath = path.join(NEWS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const raw = fs.readFileSync(filePath, "utf8");
  const { frontmatter, markdown } = extractFrontmatter(raw);
  const html = markdownToHtml(markdown);
  const payload = { frontmatter, markdown, html };
  cache.set(slug, payload);
  return payload;
}

function extractFrontmatter(input: string) {
  const FRONTMATTER_REGEX = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = input.match(FRONTMATTER_REGEX);
  if (!match) {
    return { frontmatter: {}, markdown: input };
  }
  const [, frontmatterRaw, markdown] = match;
  const frontmatter: Frontmatter = {};
  frontmatterRaw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      const separatorIndex = line.indexOf(":");
      if (separatorIndex === -1) {
        return;
      }
      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim();
      frontmatter[key] = stripQuotes(value);
    });
  return { frontmatter, markdown };
}

function stripQuotes(value: string) {
  if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

function markdownToHtml(markdown: string) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const htmlParts: string[] = [];
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) {
      return;
    }
    htmlParts.push(`<p>${escapeHtml(paragraph.join(" "))}</p>`);
    paragraph = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      continue;
    }
    if (line.startsWith("## ")) {
      flushParagraph();
      htmlParts.push(`<h2>${escapeHtml(line.slice(3).trim())}</h2>`);
      continue;
    }
    paragraph.push(line);
  }
  flushParagraph();
  return htmlParts.join("\n");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
