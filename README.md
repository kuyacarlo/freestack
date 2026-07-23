# freestack.

Directory of **free developer tools and student unlocks** — with limits, eligibility, and commercial notes.

Not a landing page full of vibes. Numbers first.

## Stack

- [Astro](https://astro.build) + [Tailwind CSS v4](https://tailwindcss.com)
- Design system (in-repo): [`src/design-system/`](src/design-system/) — see its README
- Data: [`src/data/tools.ts`](src/data/tools.ts)

## Develop

```bash
pnpm install
pnpm dev
```

```bash
pnpm build
pnpm preview
```

## Add a tool

Append an object to `tools` in `src/data/tools.ts`:

```ts
{
  id: "unique-slug",
  name: "Tool Name",
  blurb: "One line on why it matters.",
  category: "databases", // see CATEGORIES
  cost: "free",          // free | credits | student_free | discount
  student: "no",         // no | required | helps
  commercial: "yes",     // yes | hobby | edu | check
  limits: "0.5 GB · scale-to-zero 5m",
  url: "https://example.com",
  tags: ["optional"],
}
```

Keep blurbs blunt. Always include a real limit string.

## Sibling list

Markdown mirror (awesome.re style): [`awesome-freestack`](../awesome-freestack). Site `tools.ts` is source of truth for the directory UI.

## Notes

- Offers rotate. Re-check vendor pages before you bet a launch on $0.
- Edu licenses are usually non-commercial.
- Not affiliated with any vendor.

## License

Site code: MIT (or as published). Catalog content intended as public reference.
