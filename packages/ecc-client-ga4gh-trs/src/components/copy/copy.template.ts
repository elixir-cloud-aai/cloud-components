import { html } from '@microsoft/fast-element';
import {
  allComponents,
  provideFASTDesignSystem,
} from '@microsoft/fast-components';
import type { CopyClipboard } from './copy.js';

provideFASTDesignSystem().register(allComponents);

export const template = html<CopyClipboard>`
  <head>
    <script
      type="module"
      src="https://cdn.jsdelivr.net/npm/@microsoft/fast-components/dist/fast-components.min.js"
    ></script>
  </head>
  <body>
    <div class="clipboard input">
      <p>${(x) => x.value}dwdwe</p>
      <fast-button
        class="button"
        href="#"
        appearance="stealth"
        @click="${(x) => x.handleCopy()}"
      >
        ${(x) =>
          x.copied
            ? html`<svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 30 30"
                width="30px"
                height="30px"
                class="doneicon"
              >
                <path
                  d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z"
                />
              </svg>`
            : html`<svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path
                  d="M7.024 3.75c0-.966.784-1.75 1.75-1.75H20.25c.966 0 1.75.784 1.75 1.75v11.498a1.75 1.75 0 0 1-1.75 1.75H8.774a1.75 1.75 0 0 1-1.75-1.75Zm1.75-.25a.25.25 0 0 0-.25.25v11.498c0 .139.112.25.25.25H20.25a.25.25 0 0 0 .25-.25V3.75a.25.25 0 0 0-.25-.25Z"
                ></path>
                <path
                  d="M1.995 10.749a1.75 1.75 0 0 1 1.75-1.751H5.25a.75.75 0 1 1 0 1.5H3.745a.25.25 0 0 0-.25.25L3.5 20.25c0 .138.111.25.25.25h9.5a.25.25 0 0 0 .25-.25v-1.51a.75.75 0 1 1 1.5 0v1.51A1.75 1.75 0 0 1 13.25 22h-9.5A1.75 1.75 0 0 1 2 20.25l-.005-9.501Z"
                ></path>
              </svg>`}
      </fast-button>
    </div>
  </body>
`;
