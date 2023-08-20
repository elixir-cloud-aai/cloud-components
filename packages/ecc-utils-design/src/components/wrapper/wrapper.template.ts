import { ViewTemplate, html } from "@microsoft/fast-element";
import { Wrapper } from "./wrapper.js";

export const template: ViewTemplate = html<Wrapper>` <slot></slot> `;
