---
"@elixir-cloud/design": minor
---

Add `ecc-utils-design-dialog`, a modal dialog like shadcn/ui's Dialog: `open`, `show()` and `close()`; `trigger`, `title`, `description` and `footer` slots; closing on Escape, on an overlay click (unless `no-overlay-close`), on the close button (`close-label`, `hide-close-button`) and on elements with `data-dialog-close`; a focus trap with focus return; and the cancelable `ecc-dialog-open-changed` event (`{ open, reason }`) for user actions.
