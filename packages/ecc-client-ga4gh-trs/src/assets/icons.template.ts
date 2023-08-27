import { html } from "@microsoft/fast-element";

export const filterIcon = html`
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    width="16"
    height="16"
    class="filterIcon"
  >
    <path
      d="M15 2.75a.75.75 0 0 1-.75.75h-4a.75.75 0 0 1 0-1.5h4a.75.75 0 0 1 .75.75Zm-8.5.75v1.25a.75.75 0 0 0 1.5 0v-4a.75.75 0 0 0-1.5 0V2H1.75a.75.75 0 0 0 0 1.5H6.5Zm1.25 5.25a.75.75 0 0 0 0-1.5h-6a.75.75 0 0 0 0 1.5h6ZM15 8a.75.75 0 0 1-.75.75H11.5V10a.75.75 0 1 1-1.5 0V6a.75.75 0 0 1 1.5 0v1.25h2.75A.75.75 0 0 1 15 8Zm-9 5.25v-2a.75.75 0 0 0-1.5 0v1.25H1.75a.75.75 0 0 0 0 1.5H4.5v1.25a.75.75 0 0 0 1.5 0v-2Zm9 0a.75.75 0 0 1-.75.75h-6a.75.75 0 0 1 0-1.5h6a.75.75 0 0 1 .75.75Z"
    ></path>
  </svg>
`;

export const tooltipIcon = html`
  <svg
    slot="label"
    class="tooltipIcon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    width="16"
    height="16"
  >
    <path
      d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
    ></path>
  </svg>
`;

export const plusIcon = html` <svg
  style="stroke: #e62f63;"
  width="18"
  height="18"
  viewBox="0 0 18 18"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  slot="collapsed-icon"
>
  <path
    d="M15.2222 1H2.77778C1.79594 1 1 1.79594 1 2.77778V15.2222C1 16.2041 1.79594 17 2.77778 17H15.2222C16.2041 17 17 16.2041 17 15.2222V2.77778C17 1.79594 16.2041 1 15.2222 1Z"
    stroke-linecap="round"
    stroke-linejoin="round"
  ></path>
  <path
    d="M9 5.44446V12.5556"
    stroke-linecap="round"
    stroke-linejoin="round"
  ></path>
  <path
    d="M5.44446 9H12.5556"
    stroke-linecap="round"
    stroke-linejoin="round"
  ></path>
</svg>`;

export const minusIcon = html` <svg
  style="stroke: #e62f63;"
  width="18"
  height="18"
  viewBox="0 0 18 18"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  slot="expanded-icon"
>
  <path
    d="M15.2222 1H2.77778C1.79594 1 1 1.79594 1 2.77778V15.2222C1 16.2041 1.79594 17 2.77778 17H15.2222C16.2041 17 17 16.2041 17 15.2222V2.77778C17 1.79594 16.2041 1 15.2222 1Z"
    stroke-linecap="round"
    stroke-linejoin="round"
  ></path>
  <path
    d="M5.44446 9H12.5556"
    stroke-linecap="round"
    stroke-linejoin="round"
  ></path>
</svg>`;
