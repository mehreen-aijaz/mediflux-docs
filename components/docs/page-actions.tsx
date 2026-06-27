"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { resolveDocsPathname } from "@/lib/docs-pathname";
import { ArrowUpRight, Check, ChevronDown, Copy, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BsClaude, BsPerplexity } from "react-icons/bs";
import { TbMarkdown } from "react-icons/tb";


interface PageActionsProps {
  markdownUrl: string;
  className?: string;
}

interface MenuItem {
  title: string;
  description: string;
  icon: ReactNode;
  href?: string;
  external?: boolean;
  onClick?: () => void | Promise<void>;
}

const markdownCache = new Map<string, Promise<string>>();

async function fetchMarkdown(markdownUrl: string) {
  const cached = markdownCache.get(markdownUrl);
  if (cached) return cached;

  const promise = fetch(markdownUrl).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch markdown");
    return res.text();
  });

  markdownCache.set(markdownUrl, promise);
  return promise;
}

function IconBox({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <div
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-md border border-border",
        "bg-background text-foreground",
        className
      )}
    >
      {children}
    </div>
  );
}

function ChatGptIcon() {
  return (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden>
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
    </svg>
  );
}

function ClaudeIcon() {
  return (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden>
      <path d="M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z" />
    </svg>
  );
}

function PerplexityIcon() {
  return (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden>
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 3.6a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4zm-4.8 4.8a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4zm9.6 0a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4zM6 16.8a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4zm12 0a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4zm-6 2.4a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z" />
    </svg>
  );
}

function MarkdownIcon() {
  return (
    <span className="text-[11px] font-semibold leading-none tracking-tight">M↓</span>
  );
}

function MenuItemRow({
  item,
  onSelect,
}: {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
}) {
  const content = (
    <>
      <IconBox className="text-muted-foreground">{item.icon}</IconBox>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-heading">{item.title}</span>
          {item.external && (
            <ArrowUpRight className="size-3 shrink-0 text-muted-foreground" aria-hidden />
          )}
        </div>
        <p className="text-xs leading-snug text-muted-foreground">{item.description}</p>
      </div>
    </>
  );

  const rowClass = cn(
    "flex w-full cursor-pointer items-start gap-3 rounded-lg px-2 py-2.5 text-left transition-colors",
    "hover:bg-accent"
  );

  if (item.href) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noreferrer noopener"
        onClick={() => onSelect(item)}
        className={rowClass}
      >
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={() => onSelect(item)} className={rowClass}>
      {content}
    </button>
  );
}

export function PageActions({ markdownUrl, className }: PageActionsProps) {
  const pathname = usePathname();
  const docsPathname = resolveDocsPathname(pathname);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyMarkdown = useCallback(async () => {
    const text = await fetchMarkdown(markdownUrl);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [markdownUrl]);

  const menuItems = useMemo(() => {
    const pageUrl =
      typeof window === "undefined"
        ? docsPathname
        : new URL(docsPathname, window.location.origin).toString();

    const prompt = `Read ${pageUrl}, I want to ask questions about it.`;

    const items: MenuItem[] = [
      {
        title: "Copy",
        description: "Copy page as Markdown for LLMs",
        icon: <Copy className="size-4" aria-hidden />,
        onClick: copyMarkdown,
      },
      {
        title: "View as Markdown",
        description: "View this page as plain text",
        icon: <TbMarkdown className="h-5 w-5" />,
        href: markdownUrl,
        external: true,
      },
      {
        title: "Open in ChatGPT",
        description: "Ask questions about this page",
        icon: <ChatGptIcon />,
        href: `https://chatgpt.com/?${new URLSearchParams({
          prompt,
          hints: "search",
        })}`,
        external: true,
      },
      {
        title: "Open in Claude",
        description: "Ask questions about this page",
        icon: <BsClaude />,
        href: `https://claude.ai/new?${new URLSearchParams({ q: prompt })}`,
        external: true,
      },
      {
        title: "Open in Perplexity",
        description: "Ask questions about this page",
        icon: <BsPerplexity className="h-5 w-5" />,
        href: `https://www.perplexity.ai/search?q=${encodeURIComponent(prompt)}`,
        external: true,
      },
    ];

    return items;
  }, [copyMarkdown, docsPathname, markdownUrl]);

  const handleMenuSelect = async (item: MenuItem) => {
    if (item.onClick) {
      await item.onClick();
    }
    setOpen(false);
  };

  return (
    <div
      className={cn(
        "flex shrink-0 items-stretch overflow-hidden rounded-lg border border-border bg-background shadow-sm",
        className
      )}
    >
      <button
        type="button"
        onClick={() => copyMarkdown()}
        aria-label={copied ? "Copied" : "Copy page"}
        className={cn(
          "inline-flex items-center gap-1.5 px-2 py-1.5 text-sm font-medium text-foreground sm:gap-2 sm:px-3",
          "hover:bg-accent transition-colors cursor-pointer"
        )}
      >
        {copied ? (
          <Check className="size-3.5 text-primary" aria-hidden />
        ) : (
          <Copy className="size-3.5 text-muted-foreground" aria-hidden />
        )}
        <span>
          {copied ? "Copied!" : "Copy"}
          {!copied && <span className="hidden sm:inline"> page</span>}
        </span>
      </button>

      <div className="w-px self-stretch bg-border" aria-hidden />

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label="Page actions"
            className={cn(
              "inline-flex items-center justify-center px-2 py-1.5 sm:px-2.5",
              "text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer",
              "data-[state=open]:bg-accent data-[state=open]:text-foreground"
            )}
          >
            <ChevronDown
              className={cn("size-4 transition-transform duration-200", open && "rotate-180")}
              aria-hidden
            />
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-[min(100vw-2rem,320px)] p-1.5">
          {menuItems.map((item) => (
            <MenuItemRow key={item.title} item={item} onSelect={handleMenuSelect} />
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
}
