import { html } from "@microsoft/fast-element";
import { CustomPagination } from "./pagination.js";

export const template = html<CustomPagination>`
  <ul class="page">
    <li class="page__btn">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        width="16"
        height="16"
      >
        <path
          d="M9.78 12.78a.75.75 0 0 1-1.06 0L4.47 8.53a.75.75 0 0 1 0-1.06l4.25-4.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L6.06 8l3.72 3.72a.75.75 0 0 1 0 1.06Z"
        ></path>
      </svg>
    </li>
    <li class="page__numbers">1</li>
    <li class="page__numbers active">2</li>
    <li class="page__numbers">3</li>
    <li class="page__numbers">4</li>
    <li class="page__numbers">5</li>
    <li class="page__numbers">6</li>
    <li class="page__dots">...</li>
    <li class="page__numbers">10</li>
    <li class="page__btn">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        width="16"
        height="16"
      >
        <path
          d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z"
        ></path>
      </svg>
    </li>
  </ul>
`;
