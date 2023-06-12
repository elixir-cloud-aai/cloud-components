import { ViewTemplate, html } from "@microsoft/fast-element";
import type { _Inputbox } from "./InputBox";

const template: ViewTemplate<_Inputbox> = html`
  <div class="input-container ${(x) => (x.search ? "search" : "")}">
    <div>${(x) => x.kotik}</div>
    ${(x) =>
      x.search
        ? html`<span class="search-icon"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              width="16"
              height="16"
            >
              <path
                d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z"
              ></path></svg
          ></span>`
        : ""}
    <input
      type="text"
      :value="${(x) => x.inputValue}"
      @input="${(x) => x.handleInput}"
      placeholder="${(x) => x.placeholder}"
    />
  </div>
`;

export default template;
