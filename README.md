# Explainer-Videos
Repo with explainer videos and animations for concepts and technologies.

Each explainer is a single static HTML page that students step through at their own pace. No build step, no dependencies.

## Explainers

| Explainer | Topic | Folder | Covers |
| --- | --- | --- | --- |
| How AI Works | AI | [`how-ai-works/`](how-ai-works/) | LLM fundamentals, token budgets, MCP servers, custom agents vs subagents, skills |
| How a SELECT Query Works | SQL | [`sql-select-basics/`](sql-select-basics/) | `FROM`, `WHERE`, `SELECT`, `ORDER BY`, `NULL`, aliases, `DISTINCT`, written vs processing order |
| How SQL Joins Work | SQL | [`sql-joins/`](sql-joins/) | Keys, inner / left / right / full / cross / self joins, `ON` vs `WHERE`, comma joins |
| How Summary Queries Work | SQL | [`sql-summary-queries/`](sql-summary-queries/) | Aggregate functions, `GROUP BY`, `HAVING` vs `WHERE`, summaries with joins, `ROLLUP` |

The landing page has a topic filter (**All**, **AI**, **SQL**). Picking one updates the address, so you can share a filtered list, e.g. `https://cptc-cpw.github.io/Explainer-Videos/?topic=sql`.

## Using an explainer

- **Back / Next** buttons, or the **← →** arrow keys (also Page Up / Page Down, Home / End).
- **Chapter tabs** at the top jump to a section; the progress bar at the bottom jumps to any step.
- **Replay** restarts the current step's animation.
- **Link to a step:** every step has its own URL, e.g. `how-ai-works/#step-7`. Copy it from the address bar.
- Animations are turned off automatically for anyone whose system is set to reduce motion.

## SQL explainers and the AP database

The SQL explainers use the class's **AP** database (SQL Server). Every query and result on those pages was run against a fresh copy of it, so students can run the same queries and get the same rows.

The joins explainer needs one extra row so `RIGHT JOIN` and `FULL OUTER JOIN` have something unmatched on the right-hand side. [`sql/ap-explainer-extras.sql`](sql/ap-explainer-extras.sql) adds it: run it after the class's `create_ap.sql`. It's safe to run more than once.

## Publishing with GitHub Pages

1. In the repo, go to **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, and save.
3. After a minute the site is live at `https://cptc-cpw.github.io/Explainer-Videos/`.

GitHub Free only serves Pages from public repositories. The `.nojekyll` file tells Pages to serve the files as-is.

## Layout

```
index.html               landing page listing every explainer
assets/explainer.css     shared styles and animations
assets/explainer.js      shared step engine (tabs, progress bar, keys, #step-N links)
assets/catalog.js        landing page topic filter (?topic=… links)
sql/                     extra demo data for the SQL explainers
how-ai-works/index.html  one folder per explainer
```

## Adding a new explainer

1. Copy `how-ai-works/` to a new folder, e.g. `git-basics/`.
2. In its `index.html`, update `<title>`, the description and the name in the header, then replace the `<section class="step">` elements with your own. Each step needs:

   ```html
   <section class="step" data-chapter="01" data-chapter-label="Intro" data-title="What Git is" hidden>
     …step content…
   </section>
   ```

   Steps that share a `data-chapter` are grouped under one chapter tab. Step links (`#step-1`, `#step-2`, …) are numbered automatically in page order.
3. Add a card for it to the landing page (`index.html`): copy the `<article class="explainer-card">` block and change the link, title, description and chips.
4. Set the card's topic: `data-topic="sql"` on the `<article>`, and the matching badge in its `card-head` (`<span class="topic topic-sql">SQL</span>`). The filter counts cards by `data-topic`, and a topic with no cards gets no button.
   - **New topic?** Add a filter button (`data-topic-filter="…"`) in `index.html` and a `.topic-…` badge colour in `assets/explainer.css`.
5. Add a row to the table above.

Reusable building blocks in `assets/explainer.css`: `.split` (text + visual columns), `.panel`, `.card`, `.key` (callout), `.code`, `.tok` / `.tok-a` / `.tok-b` (token chips), `.row` + `.track` + `.fill` (bar charts), `.list` + `.li` + `.dot` (bullets). Animation classes: `.rise`, `.pop`, `.grow`, `.growy`, `.cyc`, `.cyc4`, `.wire`, `.wirey`; stagger them with an inline `animation-delay`.
