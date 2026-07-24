# Talks

Marp decks that accompany [freestack](https://freestack.kuyacarlo.dev).

| Deck | Path | Notes |
| --- | --- | --- |
| SaaS free-tier stack | [`saas-stack/`](./saas-stack/) | Workshop slides + student programs matrix |

```bash
cd talks/saas-stack
pnpm install
pnpm watch          # live preview
pnpm build          # dist/index.html
pnpm build:pdf      # PDF export
```

Source of truth for the catalog remains [`src/data/tools.ts`](../src/data/tools.ts). These decks are the talk form of that data.
