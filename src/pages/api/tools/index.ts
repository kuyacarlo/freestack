import type { APIRoute } from "astro";
import { CATEGORIES, tools } from "../../../data/tools";
import { parseToolsQuery, queryTools } from "../../../lib/claim";
import { json, options } from "../../../lib/http";

export const prerender = false;

export const OPTIONS: APIRoute = () => options();

export const GET: APIRoute = ({ url }) => {
  if (url.searchParams.get("meta") === "1") {
    return json({
      ok: true,
      count: tools.length,
      categories: CATEGORIES,
    });
  }
  const q = parseToolsQuery(url.searchParams);
  const result = queryTools(q);
  return json({ ok: true, ...result, query: q });
};
