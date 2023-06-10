import { html } from "@microsoft/fast-element";
import TESStatusBadge from "./tesStatusBadge.js";

const template = html<TESStatusBadge>`
  <div class="status-badge">
    ${(x): string => {
      if (x.status === "COMPLETE") {
        return "Complete";
      }
      if (x.status === "SYSTEM_ERROR") {
        return "Error";
      }
      return "Cancelled";
    }}
  </div>
`;

export default template;
