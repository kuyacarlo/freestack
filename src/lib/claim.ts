import {
  tools,
  filterTools,
  type Tool,
  type Cost,
  type Commercial,
  type Student,
  type Category,
} from "../data/tools";

export type ClaimProfile = {
  /** Currently enrolled / can verify student status */
  student: boolean;
  /** Shipping or planning a commercial product */
  commercial: boolean;
  /** Care about PH campus tools */
  ph?: boolean;
  /** Want AI / LLM tooling in the plan */
  ai?: boolean;
};

export type ClaimStep = {
  n: string;
  title: string;
  why: string;
  href: string;
  toolIds: string[];
  tools: Pick<Tool, "id" | "name" | "blurb" | "limits" | "url" | "cost" | "student" | "commercial" | "category">[];
};

function pick(ids: string[]): Tool[] {
  const map = new Map(tools.map((t) => [t.id, t]));
  return ids.map((id) => map.get(id)).filter((t): t is Tool => Boolean(t));
}

function step(
  n: string,
  title: string,
  why: string,
  href: string,
  toolIds: string[],
): ClaimStep {
  const selected = pick(toolIds);
  return {
    n,
    title,
    why,
    href,
    toolIds: selected.map((t) => t.id),
    tools: selected.map((t) => ({
      id: t.id,
      name: t.name,
      blurb: t.blurb,
      limits: t.limits,
      url: t.url,
      cost: t.cost,
      student: t.student,
      commercial: t.commercial,
      category: t.category,
    })),
  };
}

/** Ordered claim / setup plan from a profile. */
export function buildClaimPlan(profile: ClaimProfile): {
  profile: ClaimProfile;
  warnings: string[];
  steps: ClaimStep[];
  stackHint: string;
} {
  const warnings: string[] = [];
  const steps: ClaimStep[] = [];
  let n = 1;
  const num = () => String(n++).padStart(2, "0");

  if (profile.student && profile.commercial) {
    warnings.push(
      "Student Pack / Edu licenses are for learning. Keep JetBrains Edu, Figma Education, Autodesk Edu, and Vercel Hobby off commercial production.",
    );
  }

  if (profile.student) {
    steps.push(
      step(
        num(),
        "GitHub Student Developer Pack",
        "One verification unlocks Pro, Copilot, Codespaces, and partner offers.",
        "https://education.github.com/pack",
        ["github-pack", "copilot-student", "codespaces"],
      ),
      step(
        num(),
        "JetBrains All Products",
        "Daily IDE pack — renew yearly. Edu/non-commercial license.",
        "https://www.jetbrains.com/community/education/",
        ["jetbrains"],
      ),
      step(
        num(),
        "Azure for Students",
        "$100 credit/year, no CC, renewable while enrolled.",
        "https://azure.microsoft.com/en-us/free/students/",
        ["azure-students"],
      ),
      step(
        num(),
        "Figma Education",
        "Professional plan free for higher-ed — edu-only.",
        "https://www.figma.com/education/apply",
        ["figma-edu"],
      ),
      step(
        num(),
        "Campus MATLAB / Autodesk / Unity",
        "Grab school licenses before you buy anything.",
        "https://matlab.mathworks.com",
        ["matlab", "autodesk-edu", "unity-student"],
      ),
      step(
        num(),
        "Pack credits & domains",
        "DigitalOcean, Heroku, MongoDB, Namecheap — claim when you have a project name.",
        "https://education.github.com/pack",
        ["digitalocean-pack", "heroku-pack", "mongo-pack", "namecheap-pack"],
      ),
      step(
        num(),
        "Pack DX extras",
        "Doppler Team, Termius, LocalStack, 1Password year — while verified.",
        "https://education.github.com/pack",
        ["doppler", "termius", "localstack", "1password-pack", "sentry"],
      ),
    );
  }

  if (profile.commercial) {
    steps.push(
      step(
        num(),
        "Commercial-OK free core",
        "Ship on tiers that allow business use — Cloudflare, Neon/Turso, Clerk, Resend, R2.",
        "https://freestack.kuyacarlo.dev/?hint=startup",
        ["cf-workers", "neon", "turso", "clerk", "resend", "r2", "posthog", "inngest"],
      ),
      step(
        num(),
        "Security baseline",
        "Turnstile, secret scanning, Tailscale for admin — before the first user.",
        "https://freestack.kuyacarlo.dev/?hint=security",
        ["turnstile", "gitleaks", "tailscale", "letsencrypt"],
      ),
    );
    if (profile.ai !== false) {
      steps.push(
        step(
          num(),
          "AI spend discipline",
          "Cheap/local default; meter with Langfuse/Helicone; frontier only on hard steps.",
          "https://freestack.kuyacarlo.dev/guides/startup",
          ["ollama", "groq-ai", "google-ai-studio", "openrouter", "langfuse", "helicone"],
        ),
      );
    }
    steps.push(
      step(
        num(),
        "Startup credits (when real)",
        "Apply Activate / Google for Startups once incorporated — burn on load tests, not idle VMs.",
        "https://freestack.kuyacarlo.dev/?hint=startup",
        ["aws-activate", "gcp-startup", "azure-startup", "paddle-lemonsqueezy"],
      ),
    );
  } else if (!profile.student) {
    steps.push(
      step(
        num(),
        "Anyone · $0 core stack",
        "No student ID — forever-free SaaS that allows commercial hobbies.",
        "https://freestack.kuyacarlo.dev/",
        ["cf-workers", "neon", "clerk", "resend", "r2", "posthog", "sentry", "render", "koyeb"],
      ),
    );
    if (profile.ai !== false) {
      steps.push(
        step(
          num(),
          "Free / cheap AI",
          "Ollama locally; Groq / Gemini quotas; meter before you pay.",
          "https://freestack.kuyacarlo.dev/?hint=ai",
          ["ollama", "groq-ai", "google-ai-studio", "cf-workers-ai", "langfuse"],
        ),
      );
    }
  }

  if (profile.ph) {
    steps.push(
      step(
        num(),
        "PH & campus",
        "Campus utilities and PH edtech lists — link out, don't reinvent.",
        "https://freestack.kuyacarlo.dev/?hint=ph",
        ["uplb-tools", "awesome-ph-edtech", "awesome-ph-studentlife", "abakada"],
      ),
    );
  }

  if (profile.ph || profile.student) {
    steps.push(
      step(
        num(),
        "More ways in",
        "Directories for community scholarships, campus clubs, and corporate learning CSR — not Pack-only.",
        "https://freestack.kuyacarlo.dev/guides/claim-order#alt-paths",
        ["awesome-ph-edtech", "awesome-ph-studentlife", "abakada"],
      ),
    );
  }

  if (steps.length === 0) {
    steps.push(
      step(
        num(),
        "Browse the directory",
        "Flip filters: commercial ok + free forever — or open /guides/startup.",
        "https://freestack.kuyacarlo.dev/",
        ["cf-workers", "neon", "posthog"],
      ),
    );
  }

  let stackHint = "Edge-first free stack: Cloudflare + Neon + Clerk + Resend + R2.";
  if (profile.student && !profile.commercial) {
    stackHint = "Student learning stack: Pack + JetBrains + Azure $100 + freestack free tiers.";
  } else if (profile.commercial) {
    stackHint =
      "Startup lean: commercial-OK free tiers + metered AI + Activate when incorporated. See /guides/startup.";
  }

  return { profile, warnings, steps, stackHint };
}

export function parseClaimQuery(searchParams: URLSearchParams): ClaimProfile {
  const flag = (k: string, defaultValue = false) => {
    const v = searchParams.get(k);
    if (v === null) return defaultValue;
    return v === "1" || v === "true" || v === "yes";
  };
  return {
    student: flag("student"),
    commercial: flag("commercial"),
    ph: flag("ph"),
    ai: searchParams.has("ai") ? flag("ai") : true,
  };
}

export type ToolsQuery = {
  q?: string;
  cost?: Cost | "all";
  student?: Student | "all";
  commercial?: Commercial | "all";
  category?: Category | "all";
  limit?: number;
};

export function parseToolsQuery(searchParams: URLSearchParams): ToolsQuery {
  const opt = <T extends string>(k: string) =>
    (searchParams.get(k) as T | null) ?? undefined;
  const limitRaw = searchParams.get("limit");
  return {
    q: searchParams.get("q") ?? undefined,
    cost: opt("cost"),
    student: opt("student"),
    commercial: opt("commercial"),
    category: opt("category"),
    limit: limitRaw ? Number(limitRaw) : undefined,
  };
}

export function queryTools(q: ToolsQuery) {
  let list = filterTools(tools, {
    q: q.q,
    cost: q.cost ?? "all",
    student: q.student ?? "all",
    commercial: q.commercial ?? "all",
    category: q.category ?? "all",
  });
  if (q.limit && q.limit > 0) list = list.slice(0, q.limit);
  return {
    count: list.length,
    tools: list,
  };
}

export function getTool(id: string) {
  return tools.find((t) => t.id === id) ?? null;
}
