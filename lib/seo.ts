import type { Metadata } from "next";

const SITE_NAME = "Editora Cross";
const DEFAULT_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://editoracross.com";
const DEFAULT_IMAGE = "/images/og-default.svg";

export function absoluteUrl(path: string) {
  if (path.startsWith("http")) {
    return path;
  }
  return new URL(path, DEFAULT_BASE_URL).toString();
}

interface MetadataInput {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  type?: "website" | "article" | "book";
}

export function buildMetadata({ title, description, path, ogImage, type = "website" }: MetadataInput): Metadata {
  const imageUrl = absoluteUrl(ogImage ?? DEFAULT_IMAGE);
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${title} | ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
