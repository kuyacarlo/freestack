import type { APIRoute } from "astro";
import { tools, CATEGORIES } from "../../data/tools";
import { json, options } from "../../lib/http";

export const prerender = false;

export const OPTIONS: APIRoute = () => options();

export const GET: APIRoute = () =>
  json({
    ok: true,
    service: "freestack",
    version: "0.1.0",
    tools: tools.length,
    categories: CATEGORIES.length,
    endpoints: {
      claim: "GET|POST /api/claim?student=1&commercial=1&ph=0&ai=1",
      tools: "GET /api/tools?category=ai&commercial=yes&cost=free&q=neon&limit=20",
      tool: "GET /api/tools/:id",
      health: "GET /api/health",
    },
    site: "https://freestack.kuyacarlo.dev",
  });
