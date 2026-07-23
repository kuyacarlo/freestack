import type { APIRoute } from "astro";
import { getTool } from "../../../lib/claim";
import { json, options } from "../../../lib/http";

export const prerender = false;

export const OPTIONS: APIRoute = () => options();

export const GET: APIRoute = ({ params }) => {
  const tool = getTool(params.id ?? "");
  if (!tool) return json({ ok: false, error: "Tool not found" }, { status: 404 });
  return json({ ok: true, tool });
};
