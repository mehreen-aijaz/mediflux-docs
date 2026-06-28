// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"how-to-write.mdx": () => import("../content/docs/how-to-write.mdx?collection=docs"), "clinics/index.mdx": () => import("../content/docs/clinics/index.mdx?collection=docs"), "customers/index.mdx": () => import("../content/docs/customers/index.mdx?collection=docs"), "introduction/getting-started.mdx": () => import("../content/docs/introduction/getting-started.mdx?collection=docs"), "introduction/index.mdx": () => import("../content/docs/introduction/index.mdx?collection=docs"), "introduction/installation.mdx": () => import("../content/docs/introduction/installation.mdx?collection=docs"), "inventory/index.mdx": () => import("../content/docs/inventory/index.mdx?collection=docs"), "purchases/create-purchase.mdx": () => import("../content/docs/purchases/create-purchase.mdx?collection=docs"), "purchases/index.mdx": () => import("../content/docs/purchases/index.mdx?collection=docs"), "reports/index.mdx": () => import("../content/docs/reports/index.mdx?collection=docs"), "supplier/index.mdx": () => import("../content/docs/supplier/index.mdx?collection=docs"), "sales/create-sale.mdx": () => import("../content/docs/sales/create-sale.mdx?collection=docs"), "sales/index.mdx": () => import("../content/docs/sales/index.mdx?collection=docs"), "sales/returns.mdx": () => import("../content/docs/sales/returns.mdx?collection=docs"), "settings/index.mdx": () => import("../content/docs/settings/index.mdx?collection=docs"), }),
};
export default browserCollections;