# Vercel Project Index

Dashboard tracking all Vercel-deployed projects with metadata.

**Live**: [vercel-project-index.vercel.app](https://vercel-project-index.vercel.app)

## Deployed Projects

| Project | Category | Purpose | Last Updated | URL |
|---------|----------|---------|--------------|-----|
| silence-chainlink-research | research | Partnership research: Silence Labs x Chainlink ACE | 2025-12-23 | [View](https://silence-chainlink-research.vercel.app) |

## Categories

- **research** - Research projects and analysis
- **client** - Client-facing deliverables
- **internal** - Internal tools and utilities
- **experiment** - Experimental prototypes

## Adding Projects

Projects are automatically registered when using the `/vercel-deploy` Claude skill, which:

1. Deploys the project to Vercel
2. Prompts for metadata (purpose, category, tags)
3. Updates `projects.json` in this repository
4. Dashboard auto-rebuilds on push

## Manual Updates

Edit `projects.json` to add/modify projects:

```json
{
  "name": "project-name",
  "purpose": "Brief description",
  "category": "research|client|internal|experiment",
  "created": "YYYY-MM-DD",
  "lastUpdated": "YYYY-MM-DD",
  "url": "https://project-name.vercel.app",
  "tags": ["tag1", "tag2"]
}
```

---

Built with Next.js + Tailwind CSS
