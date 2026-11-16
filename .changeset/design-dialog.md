---
"@elixir-cloud/design": minor
---

Add `ecc-utils-design-dialog`, a modal dialog like shadcn/ui's Dialog. It has `open`, `show()` and `close()`, and `trigger`, `title`, `description` and `footer` slots. It closes on Escape, on an overlay click (unless `no-overlay-close`), on its close button (`close-label`, `hide-close-button`) and on elements with `data-dialog-close`. Focus stays inside while it is open and returns to the trigger (or the element focused before) on close, and the page doesn't scroll while it is open. User actions fire `ecc-dialog-open-changed` (`{ open, reason }`) on the dialog, which doesn't bubble and is cancelable, except when the browser has already closed the dialog by itself.
