---
marp: true
title: SaaS Product Stack & Managed Infrastructure
description: A short developer guide to free-tier limits, scaling thresholds, and databases.
author: Developer & Data Pro Team
backgroundColor: #212529
color: #F2D9D0
style: |
  section {
    font-family: 'Outfit', 'Inter', sans-serif;
    padding: 50px;
    font-size: 24px;
    background-color: #212529;
    color: #F2D9D0;
  }
  h1 {
    color: #FFB38A;
    font-size: 2em;
    margin-top: 0px !important;
    margin-bottom: 25px !important;
    padding-top: 0px !important;
    line-height: 1.2;
  }
  h2 {
    color: #FFD2B3;
    font-size: 1.4em;
    margin-top: 0px !important;
    margin-bottom: 20px !important;
  }
  h3 {
    color: #FFB38A;
    font-size: 1.1em;
    margin-top: 0px !important;
    margin-bottom: 10px !important;
  }
  footer {
    font-size: 0.6em;
    color: rgba(242, 217, 208, 0.5);
  }
  a {
    color: #4DD0E1;
    text-decoration: none;
  }
  code {
    background-color: #343a40;
    color: #4DD0E1;
    border-radius: 4px;
    padding: 2px 6px;
    font-size: 0.85em;
  }
  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }
  .highlight {
    color: #FFB38A;
    font-weight: bold;
  }
  .tag {
    color: #4DD0E1;
    font-size: 0.8em;
    display: inline-block;
    margin-bottom: 1px;
  }
  table {
    width: 100% !important;
    border-collapse: collapse;
    margin-top: 15px;
    background-color: transparent !important;
  }
  tr, th, td {
    background-color: transparent !important;
    color: #F2D9D0 !important;
  }
  th {
    color: #FFD2B3 !important;
    border-bottom: 2px solid #FFB38A !important;
    padding: 10px 12px;
    text-align: left;
  }
  td {
    padding: 10px 12px;
    text-align: left;
  }
---

<!-- _backgroundColor: #1a1d20 -->

# <p class="tag"> Startup Scoping & Architecture </p>

## SaaS Product Stack & Managed Infrastructure

A developer's guide to free-tier limits, scaling thresholds, and databases.

<br>

**kaoru**
*Developer & Infrastructure Pro*

---

# Tonight's Agenda

1. **Core Databases** — Neon, Turso, Supabase, Upstash + niche DBs
2. **Application Hosting** — Vercel, Cloudflare, Koyeb, Render
3. **Auth, Email & Relays** — Clerk, Kinde, Resend, Hookdeck
4. **Storage, Jobs & Observability** — R2, Inngest, PostHog, Sentry
5. **Niche Free Gems** — MotherDuck, Val Town, LiveKit & friends
6. **MVP Architectural Blueprint** — Choosing your perfect stack

---

# Managed Edge & Serverless Databases

Evaluate your storage, throughput, and cold-start characteristics:

* **Neon Postgres**: <span class="highlight">0.5 GB storage</span>, scales to zero after 5 minutes of inactivity. Paid Launch plan: $0 base + usage.
* **Turso (LibSQL)**: <span class="highlight">5.0 GB storage</span>, 100 active databases, 500M reads/month. Superb for edge-rendered apps.
* **Supabase (BaaS)**: <span class="highlight">500 MB storage</span>, 50k MAUs. Database pauses after 7 days of inactivity.
* **Upstash Redis**: <span class="highlight">256 MB storage</span>, 10,000 commands/day. Great for job queues and caching.

---

# Niche / Alternative Databases

Worth knowing when Postgres-or-Redis isn't the whole story:

* **Convex**: <span class="highlight">0.5 GB + 1M function calls/mo</span>. Reactive backend with realtime sync — great for collaborative UIs.
* **Cloudflare D1**: <span class="highlight">5 GB SQLite / DB</span>, 5M rows read/day on free Workers. Zero-ops SQL at the edge.
* **MongoDB Atlas**: <span class="highlight">512 MB shared cluster</span>. Classic document store; free forever (M0).
* **Appwrite Cloud**: <span class="highlight">2 projects, 2 GB storage</span>, Auth + DB + Functions in one BaaS.

---

# Database Comparison Matrix

| Database / Cache | Free Storage | Free Bandwidth/Ops | Paid Entry Point | Best Fit |
| :--- | :--- | :--- | :--- | :--- |
| **Neon** | 0.5 GB | 5 GB egress / mo | $0 base + usage | Relational Control Plane |
| **Turso** | 5.0 GB | 500M reads / mo | $4.99 / mo | Edge Sync & Caching |
| **Supabase** | 0.5 GB | 2 GB egress / mo | $25.00 / mo | Instant Auth & REST |
| **Upstash** | 256 MB | 10k commands / day | Pay-As-You-Go | Redis Caching & Queues |
| **Convex** | 0.5 GB | 1M function calls / mo | Usage after free | Realtime App Backend |
| **D1** | 5 GB | 5M rows read / day | Workers Paid | Edge SQLite |

---

# Application Hosting & PaaS Compute

Where to run your frontends and backend services:

* **Cloudflare Workers & Pages**: <span class="highlight">100k requests/day</span>. Unlimited static site hosting. Global CDN latency.
* **Koyeb (Managed Containers)**: <span class="highlight">1 Web Service</span> on a Micro Instance (512 MB RAM, 0.1 vCPU). Stays active 24/7.
* **Vercel (Hobby)**: <span class="highlight">100 GB bandwidth/month</span>. Personal projects only. Pro plan ($20/user/mo) required for startups.
* **Railway.app**: <span class="highlight">$5.00 monthly credit</span> (approx. 500 hrs on micro container). Paid plan: $5/mo base + usage.

---

# More Hosting Free Tiers

* **Render**: <span class="highlight">750 instance hours/mo</span>, no CC required. Sleeps after 15 min (30–60s cold start). Free Postgres expires in 30 days.
* **Netlify**: <span class="highlight">100 GB bandwidth</span>, 300 build min/mo. Solid JAMstack + serverless functions.
* **Deno Deploy**: <span class="highlight">1M requests/mo</span>. Native TypeScript/JS at the edge; pairs well with Deno KV.
* **Oracle Cloud Always Free**: <span class="highlight">2× AMD VMs + 4 ARM OCPUs</span>, 200 GB block storage. Real VMs forever — if you survive signup.

---

# Auth, Identity & Webhook Relays

Ensuring secure user onboarding and robust webhooks ingestion:

* **Clerk**: <span class="highlight">50,000 MRUs</span> (Monthly Retained Users). Pre-built login screens, B2B/B2C tenant setups.
* **Kinde**: <span class="highlight">10,500 MAUs</span>. Enterprise SSO connections and feature flags. Pro plan is $25/mo.
* **Hookdeck**: <span class="highlight">100,000 events/month</span>, 3-day data retention. Webhook retry queues buffer.
* **Doppler**: <span class="highlight">5 users free</span>. Secure API keys manager and secrets syncing directly to Vercel/Koyeb.

---

# Email, Forms & Notifications

Transactional plumbing that usually gets bolted on late:

* **Resend**: <span class="highlight">3,000 emails/mo</span> (100/day), 1 custom domain. React Email + great DX.
* **Brevo (ex-Sendinblue)**: <span class="highlight">300 emails/day</span> forever free. Marketing + transactional in one.
* **Loops**: <span class="highlight">1,000 contacts free</span>. Product/lifecycle email for SaaS onboarding flows.
* **Formspark / Tally**: <span class="highlight">unlimited forms</span> (generous free caps). Drop-in contact forms without a backend.

---

# Object Storage & Media

* **Cloudflare R2**: <span class="highlight">10 GB storage</span>, 1M Class A + 10M Class B ops/mo. **Zero egress fees** — killer for assets & downloads.
* **Backblaze B2**: <span class="highlight">10 GB free</span>, egress waived when paired with Cloudflare. Dirt-cheap archive tier.
* **UploadThing**: <span class="highlight">2 GB storage</span> on free. File uploads wired for Next.js in minutes.
* **Cloudinary**: <span class="highlight">25 credits/mo</span>. On-the-fly image/video transforms without self-hosting Thumbor.

---

# Background Jobs, Queues & Automation

* **Inngest**: <span class="highlight">50k steps/mo</span>. Durable functions, retries, cron — no Redis to babysit.
* **Trigger.dev**: <span class="highlight">generous free tier</span> for long-running Node jobs with observability.
* **Upstash QStash**: <span class="highlight">500 messages/day</span>. HTTP-based queue that wakes serverless endpoints.
* **Pipedream / n8n Cloud**: <span class="highlight">free workflow caps</span>. Glue APIs together without writing glue code.

---

# Observability, Analytics & Uptime

* **PostHog**: <span class="highlight">1M events/mo</span> free (product analytics + session replay + feature flags). No CC for free caps.
* **Sentry**: <span class="highlight">5k errors/mo</span>. Error tracking that actually ships with source maps.
* **Axiom**: <span class="highlight">500 GB ingest/mo</span> on free. Structured logs that don't melt your laptop.
* **UptimeRobot / Better Stack**: <span class="highlight">50 monitors</span> (UptimeRobot) or free log/uptime starter tiers. Know when the free PaaS fell asleep.

---

# Niche Free Gems

Underrated tools that punch above their weight on $0:

* **MotherDuck**: <span class="highlight">10 GB DuckDB in the cloud</span>. Analytics SQL over Parquet/CSV without standing up a warehouse.
* **Val Town**: <span class="highlight">free serverless JS vals</span>. Cron + HTTP endpoints as shareable code snippets.
* **LiveKit Cloud**: <span class="highlight">free realtime A/V minutes</span>. WebRTC SFU for voice/video without rolling Coturn.
* **Tinybird**: <span class="highlight">free ClickHouse-backed API</span> tier. Turn event streams into instant REST endpoints.
* **Svix**: <span class="highlight">50k messages/mo</span>. Outbound webhook delivery (the Hookdeck dual for *sending*).
* **Dub.co**: <span class="highlight">free link shortener</span> with analytics — branded redirects without Bitly pricing.

---

# Even More Niche (Yes, Really)

* **Hugging Face Spaces / Inference**: free CPU Spaces + limited inference. Prototype ML demos without a GPU bill.
* **Groq / Google AI Studio**: <span class="highlight">free LLM API quotas</span>. Fast inference for MVPs before you wire OpenAI billing.
* **Browserless / ScreenshotOne trials**: headless Chrome as a service — PDFs & screenshots without Puppeteer ops.
* **Cron-job.org**: <span class="highlight">free external cron</span>. Ping sleeping Render/Railway apps so they don't cold-start mid-demo.
* **GoatCounter / Umami Cloud**: privacy-first analytics when PostHog is overkill.
* **Infisical**: open-source Doppler alternative — free cloud tier for secrets sync.

---

# MVP Architectural Blueprint

Recommended stack combinations depending on your workflow:

<div class="grid-2" style="margin-top: 20px;">
<div>

### 🌐 Edge-First Stack
* **Frontend**: Next.js on Cloudflare Pages
* **Database**: Turso (LibSQL) or D1
* **Auth**: Kinde (SSO ready)
* **Storage**: Cloudflare R2
* **Best For**: Low latency, high global read/write volumes.

</div>
<div>

### 📦 Full-Container Stack
* **Frontend**: Next.js on Vercel
* **API / Worker**: Go/Python on Koyeb
* **Database**: Neon (Postgres)
* **Jobs / Email**: Inngest + Resend
* **Best For**: Heavy backend workers and relational operations.

</div>
</div>

---

# Key Takeaways for Builders

* **Inactivity Pauses**: Supabase pauses after 7 days idle; Render sleeps after 15 min; Neon scales to zero after 5 min but wakes in seconds.
* **Commercial Restrictions**: Vercel Hobby is strictly non-commercial. Budget the $20/user/mo Pro fee early.
* **Egress Tax**: Prefer R2 (or B2 + Cloudflare) over S3-style egress bills for user-facing file delivery.
* **Secrets Syncing**: Automate env vars with Doppler or Infisical — never copy-paste across five dashboards.
* **Stack the free tiers**: Auth + DB + Host + Email + Jobs + Observability can all stay $0 until real traffic arrives.
