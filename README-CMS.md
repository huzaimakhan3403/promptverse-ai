# PromptVerse AI Blog CMS

The blog is managed with Pages CMS and stored as Markdown files in `content/blog/`.

## Admin access

1. Open https://app.pagescms.org/
2. Sign in with the GitHub account that has access to `huzaimakhan3403/promptverse-ai`.
3. Select the repository and open the **Blog Articles** collection.
4. Create or edit an article. Use **Keep as draft** to prevent publication.
5. Save your changes. Pages CMS commits the content to GitHub; Vercel rebuilds the site from the repository.

## Publishing requirements

- Set a unique URL slug (lowercase letters, numbers and hyphens).
- Add an accurate article title, category and short description.
- Add original, useful article content and a descriptive featured-image alt text.
- Set SEO title and SEO description.
- Leave **Keep as draft** unchecked to publish.

## Deployment

Vercel is configured to run `npm run build` and serve the generated `dist/` directory. The build reads Markdown frontmatter and article content, generates static SEO-friendly article pages, updates the blog cards and sitemap, and copies the existing site into the deployment output.

## First-time setup

In Pages CMS, authorize the repository and confirm that the Blog Articles collection appears. In Vercel, confirm the project is connected to this GitHub repository and that its build command/output directory are `npm run build` and `dist`. Do not add secrets or passwords to repository files.
