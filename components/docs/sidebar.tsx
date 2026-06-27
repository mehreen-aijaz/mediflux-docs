"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, icons } from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveDocsPathname } from "@/lib/docs-pathname";
import type { Root, Node, Folder, Item } from "fumadocs-core/page-tree";

interface SidebarProps {
  tree: Root;
  iconMap: Record<string, string>;
}

function LucideIcon({ name, className }: { name: string; className?: string }) {
  const Icon = icons[name as keyof typeof icons];
  if (!Icon) return null;
  return <Icon className={className} />;
}

export function Sidebar({ tree, iconMap }: SidebarProps) {
  const filtered = filterRedundantSeparators(tree.children);

  return (
    <nav className="flex flex-col py-4 text-sm" aria-label="Documentation sidebar">
      <SidebarNodes nodes={filtered} level={0} iconMap={iconMap} />
    </nav>
  );
}

function filterRedundantSeparators(nodes: Node[]): Node[] {
  const result: Node[] = [];
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.type === "separator") {
      const next = nodes[i + 1];
      if (
        next &&
        next.type === "folder" &&
        normalizeStr(String(node.name)) === normalizeStr(String(next.name))
      ) {
        continue;
      }
    }
    result.push(node);
  }
  return result;
}

function normalizeStr(s: string): string {
  return s.replace(/---/g, "").trim().toLowerCase();
}

/** Top-level group + direct children share one line; deeper nesting indents. */
function sidebarPaddingLeft(level: number): number {
  const base = 8;
  if (level <= 1) return base;
  return base + (level - 1) * 12;
}

function SidebarNodes({ nodes, level, iconMap }: { nodes: Node[]; level: number; iconMap: Record<string, string> }) {
  return (
    <>
      {nodes.map((node, i) => (
        <SidebarNode key={i} node={node} level={level} iconMap={iconMap} />
      ))}
    </>
  );
}

function SidebarNode({ node, level, iconMap }: { node: Node; level: number; iconMap: Record<string, string> }) {
  if (node.type === "separator") {
    return (
      <div
        className={cn(
          "px-2 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
          level === 0 && "mt-4 first:mt-0"
        )}
      >
        {node.name}
      </div>
    );
  }

  if (node.type === "folder") {
    return <SidebarFolder node={node} level={level} iconMap={iconMap} />;
  }

  return <SidebarItem node={node} level={level} iconMap={iconMap} />;
}

function isIndexPage(child: Node, folder: Folder): boolean {
  if (child.type !== "page") return false;
  const item = child as Item;

  if (folder.index) {
    if (item.url === folder.index.url) return true;
    if (item === folder.index) return true;
  }

  const itemUrl = item.url.replace(/\/$/, "");
  const folderSegments = itemUrl.split("/");
  const lastSegment = folderSegments[folderSegments.length - 1];
  if (lastSegment === "index") return true;

  const folderName = normalizeStr(String(folder.name));
  const childName = normalizeStr(String(item.name));
  if (folderName === childName) return true;

  return false;
}

function getFolderUrl(node: Folder): string | undefined {
  if (node.index) return node.index.url;
  const indexChild = node.children.find((c) => isIndexPage(c, node));
  if (indexChild && indexChild.type === "page") return (indexChild as Item).url;
  return undefined;
}

function SidebarFolder({
  node,
  level,
  iconMap,
}: {
  node: Folder;
  level: number;
  iconMap: Record<string, string>;
}) {
  const pathname = resolveDocsPathname(usePathname());
  const folderUrl = getFolderUrl(node);
  const isActive = !!(folderUrl && pathname === folderUrl);
  const isChildActive = hasActiveChild(node, pathname);
  const iconName = folderUrl ? iconMap[folderUrl] : undefined;

  const displayName = String(node.name).toUpperCase();
  const visibleChildren = node.children.filter(
    (child) => !isIndexPage(child, node)
  );

  const HeadingTag = folderUrl ? Link : "div";
  const headingProps = folderUrl ? { href: folderUrl } : {};

  return (
    <div className={cn(level === 0 && "mt-2 pt-2 border-t border-border/40 first:mt-0 first:pt-0 first:border-0")}>
      <HeadingTag
        {...headingProps as any}
        className={cn(
          "flex items-center gap-2 rounded-md py-1.5 mt-0.5 cursor-pointer transition-colors duration-150",
          "text-sm font-semibold uppercase tracking-wide px-2 pr-3",
          isActive
            ? "bg-primary-light text-primary"
            : isChildActive
              ? "text-foreground hover:bg-accent"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
        )}
        style={{ paddingLeft: `${sidebarPaddingLeft(level)}px` }}
      >
        {iconName && <LucideIcon name={iconName} className="h-4 w-4 shrink-0" />}
        <span className="truncate">{displayName}</span>
      </HeadingTag>
      {visibleChildren.length > 0 && (
        <SidebarNodes nodes={visibleChildren} level={level + 1} iconMap={iconMap} />
      )}
    </div>
  );
}

function resolveItemIcon(node: Item, iconMap: Record<string, string>) {
  if (iconMap[node.url]) return iconMap[node.url];
  if (typeof node.icon === "string") return node.icon;
  return undefined;
}

function SidebarItem({
  node,
  level,
  iconMap,
}: {
  node: Item;
  level: number;
  iconMap: Record<string, string>;
}) {
  const pathname = resolveDocsPathname(usePathname());
  const isExternal =
    node.external ??
    (node.url.startsWith("http://") || node.url.startsWith("https://"));
  const isActive = !isExternal && pathname === node.url;
  const iconName = resolveItemIcon(node, iconMap);

  const className = cn(
    "flex items-center gap-2 rounded-md px-2 py-1.5 mt-0.5 transition-colors duration-150",
    isActive
      ? "bg-primary/15 font-medium !text-primary"
      : "hover:bg-accent hover:text-foreground",
      isExternal ? "text-[15px] hover:text-primary group hover:bg-primary/10": "text-muted-foreground"
  );
  const style = { paddingLeft: `${sidebarPaddingLeft(level)}px` };

  const content = (
    <>
      {iconName && <LucideIcon name={iconName} className={cn("h-3.5 w-3.5 shrink-0", isExternal ? "h-6 w-6 text-muted-foreground bg-gray-200/70 border border-gray-200 rounded-sm p-1 group-hover:text-primary transition-colors duration-200 group-hover:bg-white dark:bg-gray-800 dark:border-gray-700" : "h-3.5 w-3.5")} />}
      <span className="truncate">{node.name}</span>
      {isExternal && (
        <ArrowUpRight
          className="h-3.5 w-3.5 shrink-0 group-hover:text-primary transition-colors duration-200"
          aria-hidden
        />
      )}
    </>
  );

  if (isExternal) {
    return (
      <a
        href={node.url}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={style}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={node.url}
      className={className}
      style={style}
      aria-current={isActive ? "page" : undefined}
    >
      {content}
    </Link>
  );
}

function hasActiveChild(node: Folder, pathname: string): boolean {
  return node.children.some((child) => {
    if (child.type === "page") return pathname === child.url;
    if (child.type === "folder") {
      if (child.index && pathname === child.index.url) return true;
      return hasActiveChild(child, pathname);
    }
    return false;
  });
}
