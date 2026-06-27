// @ts-nocheck
import * as __fd_glob_22 from "../content/docs/reports/profit-loss.mdx?collection=docs"
import * as __fd_glob_21 from "../content/docs/reports/index.mdx?collection=docs"
import * as __fd_glob_20 from "../content/docs/sales/returns.mdx?collection=docs"
import * as __fd_glob_19 from "../content/docs/sales/index.mdx?collection=docs"
import * as __fd_glob_18 from "../content/docs/sales/create-sale.mdx?collection=docs"
import * as __fd_glob_17 from "../content/docs/purchases/index.mdx?collection=docs"
import * as __fd_glob_16 from "../content/docs/purchases/create-purchase.mdx?collection=docs"
import * as __fd_glob_15 from "../content/docs/introduction/installation.mdx?collection=docs"
import * as __fd_glob_14 from "../content/docs/introduction/index.mdx?collection=docs"
import * as __fd_glob_13 from "../content/docs/introduction/getting-started.mdx?collection=docs"
import * as __fd_glob_12 from "../content/docs/api/webhooks.mdx?collection=docs"
import * as __fd_glob_11 from "../content/docs/api/index.mdx?collection=docs"
import * as __fd_glob_10 from "../content/docs/api/authentication.mdx?collection=docs"
import * as __fd_glob_9 from "../content/docs/accounting/ledgers.mdx?collection=docs"
import * as __fd_glob_8 from "../content/docs/accounting/index.mdx?collection=docs"
import * as __fd_glob_7 from "../content/docs/how-to-write.mdx?collection=docs"
import { default as __fd_glob_6 } from "../content/docs/sales/meta.json?collection=docs"
import { default as __fd_glob_5 } from "../content/docs/reports/meta.json?collection=docs"
import { default as __fd_glob_4 } from "../content/docs/purchases/meta.json?collection=docs"
import { default as __fd_glob_3 } from "../content/docs/introduction/meta.json?collection=docs"
import { default as __fd_glob_2 } from "../content/docs/api/meta.json?collection=docs"
import { default as __fd_glob_1 } from "../content/docs/accounting/meta.json?collection=docs"
import { default as __fd_glob_0 } from "../content/docs/meta.json?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.docs("docs", "content/docs", {"meta.json": __fd_glob_0, "accounting/meta.json": __fd_glob_1, "api/meta.json": __fd_glob_2, "introduction/meta.json": __fd_glob_3, "purchases/meta.json": __fd_glob_4, "reports/meta.json": __fd_glob_5, "sales/meta.json": __fd_glob_6, }, {"how-to-write.mdx": __fd_glob_7, "accounting/index.mdx": __fd_glob_8, "accounting/ledgers.mdx": __fd_glob_9, "api/authentication.mdx": __fd_glob_10, "api/index.mdx": __fd_glob_11, "api/webhooks.mdx": __fd_glob_12, "introduction/getting-started.mdx": __fd_glob_13, "introduction/index.mdx": __fd_glob_14, "introduction/installation.mdx": __fd_glob_15, "purchases/create-purchase.mdx": __fd_glob_16, "purchases/index.mdx": __fd_glob_17, "sales/create-sale.mdx": __fd_glob_18, "sales/index.mdx": __fd_glob_19, "sales/returns.mdx": __fd_glob_20, "reports/index.mdx": __fd_glob_21, "reports/profit-loss.mdx": __fd_glob_22, });