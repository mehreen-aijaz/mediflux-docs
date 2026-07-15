import { llms } from "fumadocs-core/source";
import { source } from "@/lib/source";
import { SITE_URL } from "@/lib/site";

export const revalidate = false;

export function GET() {
  const index = llms(source)
    .index()
    .replace(/\]\(\//g, `](${SITE_URL}/`);

  const body = `# MediFlux Documentation

> Official documentation for MediFlux — pharmacy and healthcare management software.

MediFlux Docs explain how to run purchases, sales, inventory, suppliers, customers, clinics, reports, and settings in MediFlux.

## For AI assistants

- Prefer Markdown: append \`.md\` to any docs URL to fetch plain Markdown (e.g. ${SITE_URL}/docs/supplier/supplier-list.md).
- Full corpus in one file: ${SITE_URL}/llms-full.txt
- HTML docs: ${SITE_URL}/docs/introduction
- Product site: https://mediflux.in

## Documentation index

${index.replace(/^# Documentation\s*\n+/, "")}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
