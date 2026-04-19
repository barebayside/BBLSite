# Blog Content — Edit Here

This folder holds the markdown versions of every blog article. Edit these files in VS Code, then ask Claude Code to build/update the HTML.

## How it works

1. **You edit** the `.md` file in `content/blog/`
2. **Tell Claude Code:** "update the stop-losing-leads article" (or "build all articles")
3. **Claude reads** your markdown and updates the HTML in `pages/blog/[slug]/index.html`
4. **You push** to GitHub to publish

## To create a new article

1. Copy any existing `.md` file in `content/blog/`
2. Rename it to your new slug (e.g. `google-reviews-tradie-guide.md`)
3. Fill in the metadata at the top and write your content
4. Tell Claude Code: "build the google-reviews article"
5. Claude creates the folder + HTML in `pages/blog/` and updates the blog listing

## File structure

```
content/
  README.md              <-- This file
  blog/
    stop-losing-leads.md <-- Markdown source (you edit this)
    [next-article].md    <-- Next article goes here

pages/
  blog/
    stop-losing-leads/
      index.html          <-- Built HTML (Claude generates this from the .md)
```

## Markdown format

Every article starts with a metadata block between `---` lines, then the content. See any existing article for the format.
