import { html, nothing, TemplateResult } from "lit";
import { safeHref } from "../cookie-consent/urls.js";

/*
 * A small Markdown subset for legal pages, rendered with Lit templates, so
 * that all text is escaped and no HTML from the configuration reaches the
 * page: headings (`#` to `###`), paragraphs, lists (`-`, `*`, `1.`),
 * `**bold**`, `*emphasis*` and links (`[text](url)`, only `http(s)`,
 * `mailto` and relative URLs).
 */

type Inline = string | TemplateResult;

const INLINE = /\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

/**
 * Renders the inline Markdown of a line.
 * @param text Text with inline Markdown
 * @returns Strings and templates
 */
export function renderInline(text: string): Inline[] {
  const parts: Inline[] = [];
  let last = 0;
  text.replace(
    INLINE,
    (match, bold, em, label, url, offset: number): string => {
      if (offset > last) parts.push(text.slice(last, offset));
      if (bold) parts.push(html`<strong>${bold}</strong>`);
      else if (em) parts.push(html`<em>${em}</em>`);
      else {
        const href = safeHref(url);
        parts.push(
          href
            ? html`<a
                class="underline underline-offset-4"
                href=${href}
                target="_blank"
                rel="noopener noreferrer"
                >${label}</a
              >`
            : label
        );
      }
      last = offset + match.length;
      return match;
    }
  );
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

const HEADING_CLASSES = [
  "mt-4 text-xl font-semibold",
  "mt-4 text-lg font-semibold",
  "mt-3 font-semibold",
];

/**
 * Renders Markdown (the subset above).
 * @param markdown The Markdown
 * @returns The rendered blocks
 */
export function renderMarkdown(markdown: string): TemplateResult[] {
  const blocks: TemplateResult[] = [];
  let paragraph: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flush = () => {
    if (paragraph.length) {
      blocks.push(
        html`<p class="mt-2">${renderInline(paragraph.join(" "))}</p>`
      );
      paragraph = [];
    }
    if (list) {
      const items = list.items.map(
        (item) => html`<li>${renderInline(item)}</li>`
      );
      blocks.push(
        list.ordered
          ? html`<ol class="mt-2 list-decimal pl-6">
              ${items}
            </ol>`
          : html`<ul class="mt-2 list-disc pl-6">
              ${items}
            </ul>`
      );
      list = null;
    }
  };

  (typeof markdown === "string" ? markdown : "")
    .split(/\r?\n/)
    .forEach((raw) => {
      const line = raw.trim();
      const heading = /^(#{1,3})\s+(.*)$/.exec(line);
      const bullet = /^[-*]\s+(.*)$/.exec(line);
      const numbered = /^\d+[.)]\s+(.*)$/.exec(line);
      if (!line) {
        flush();
      } else if (heading) {
        flush();
        const level = heading[1].length;
        const content = renderInline(heading[2]);
        const classes = HEADING_CLASSES[level - 1];
        // h2 to h4: the dialog's title is the h2 of the page
        if (level === 1)
          blocks.push(html`<h3 class=${classes}>${content}</h3>`);
        else if (level === 2)
          blocks.push(html`<h4 class=${classes}>${content}</h4>`);
        else blocks.push(html`<h5 class=${classes}>${content}</h5>`);
      } else if (bullet || numbered) {
        if (paragraph.length) {
          const pending = paragraph;
          paragraph = [];
          blocks.push(
            html`<p class="mt-2">${renderInline(pending.join(" "))}</p>`
          );
        }
        const ordered = !!numbered;
        if (list && list.ordered !== ordered) flush();
        if (!list) list = { ordered, items: [] };
        const item = bullet ?? numbered;
        if (item) list.items.push(item[1]);
      } else {
        if (list) flush();
        paragraph.push(line);
      }
    });
  flush();
  return blocks.length ? blocks : [html`${nothing}`];
}
