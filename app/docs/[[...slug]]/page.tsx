import { source } from "@/lib/source";
import { notFound } from "next/navigation";
import { findNeighbour } from "fumadocs-core/page-tree";
import { Breadcrumbs } from "@/components/docs/breadcrumbs";
import { PageActions } from "@/components/docs/page-actions";
import { Toc } from "@/components/docs/toc";
import { TocBottomBar } from "@/components/docs/toc-bottom-bar";
import { cn } from "@/lib/utils";
import { PrevNext } from "@/components/docs/prev-next";
import { estimateReadingTime } from "@/lib/utils";
import { getMdxComponents } from "@/lib/mdx-components";
import { OG_IMAGES } from "@/lib/og";
import { SITE_URL } from "@/lib/site";
import { Clock } from "lucide-react";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function DocsPage({ params }: PageProps) {
  const { slug } = await params;
  const page = source.getPage(slug);

  if (!page) notFound();

  const MDXContent = page.data.body;
  const toc = Array.isArray(page.data.toc) ? page.data.toc : [];
  const showToc = page.data.enableToc !== false && toc.length > 0;

  const { previous, next } = findNeighbour(source.pageTree, page.url);

  const breadcrumbs = getBreadcrumbs(slug || []);

  const readingTime = estimateReadingTime(
    page.data.body.toString?.() || ""
  );

  return (
    <div className={cn("docs-page", showToc && "has-toc")}>
      <article
        className={cn(
          "docs-article py-6 sm:py-8 sm:px-4 xl:px-8 xl:py-10",
          showToc && "pb-24 xl:pb-10"
        )}
      >
        <Breadcrumbs items={breadcrumbs} />

        <div className="mb-6">
          <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
            <h1 className="min-w-0 max-w-full break-words text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              {page.data.title}
            </h1>
            <PageActions
              markdownUrl={`${page.url}.md`}
              className="shrink-0"
            />
          </div>
          {page.data.description && (
            <p className="mt-2 text-lg text-muted-foreground">
              {page.data.description}
            </p>
          )}
          <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {readingTime} min read
            </span>
          </div>
        </div>

        <div className="mdx-content min-w-0 max-w-full">
          <MDXContent components={getMdxComponents()} />
        </div>

        <PrevNext
          previous={
            previous
              ? { name: previous.name as string, url: previous.url }
              : undefined
          }
          next={
            next
              ? { name: next.name as string, url: next.url }
              : undefined
          }
        />
      </article>

      {showToc && (
        <aside className="docs-toc-aside docs-scrollbar hidden w-[var(--docs-toc-width)] shrink-0 py-8 pl-2 pr-6 xl:block">
          <Toc toc={toc} />
        </aside>
      )}
      {showToc && <TocBottomBar toc={toc} />}
    </div>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) return {};

  const title = page.data.title;
  const description = page.data.description;
  const url = `${SITE_URL}${page.url}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      siteName: "MediFlux Docs",
      locale: "en_IN",
      title,
      description,
      url,
      images: OG_IMAGES,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: OG_IMAGES,
    },
  };
}

function getBreadcrumbs(slugParts: string[]) {
  const items: { name: string; url?: string }[] = [];
  let currentPath = "/docs";

  for (let i = 0; i < slugParts.length; i++) {
    currentPath += `/${slugParts[i]}`;
    const page = source.getPage(slugParts.slice(0, i + 1));
    items.push({
      name:
        page?.data.title ||
        slugParts[i]
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()),
      url: currentPath,
    });
  }

  // Skip the current page — its title is already shown as the H1 below.
  return items.slice(0, -1);
}
