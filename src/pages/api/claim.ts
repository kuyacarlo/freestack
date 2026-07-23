import type { APIRoute } from "astro";
import { buildClaimPlan, parseClaimQuery, type ClaimProfile } from "../../lib/claim";
import { json, options } from "../../lib/http";

export const prerender = false;

export const OPTIONS: APIRoute = () => options();

export const GET: APIRoute = ({ url }) => {
  const profile = parseClaimQuery(url.searchParams);
  return json({
    ok: true,
    ...buildClaimPlan(profile),
  });
};

export const POST: APIRoute = async ({ request }) => {
  let body: Partial<ClaimProfile> = {};
  try {
    body = (await request.json()) as Partial<ClaimProfile>;
  } catch {
    return json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }
  const profile: ClaimProfile = {
    student: Boolean(body.student),
    commercial: Boolean(body.commercial),
    ph: Boolean(body.ph),
    ai: body.ai === undefined ? true : Boolean(body.ai),
  };
  return json({
    ok: true,
    ...buildClaimPlan(profile),
  });
};
