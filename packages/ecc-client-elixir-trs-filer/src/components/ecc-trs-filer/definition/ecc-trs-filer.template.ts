import { html, when } from "@microsoft/fast-element";
import {
  allComponents,
  provideFASTDesignSystem,
} from "@microsoft/fast-components";
import type { TRSFiler } from "./ecc-trs-filer.js";

provideFASTDesignSystem().register(allComponents);

export const template = html<TRSFiler>`
  <div class="trs-container">
    <h1>TRS Filer</h1>
    <fast-tabs>
      <fast-tab slot="tab">List of tools</fast-tab>
      <fast-tab slot="tab">List of tool classes</fast-tab>
      <fast-tab-panel slot="tabpanel" class="custom-tabpanel">
        <fast-button @click="${(x) => x.modalButtonClick()}"
          >Create a Tool</fast-button
        >
        ${when(
          (x) => x.isOpenModal,
          html`
            <fast-dialog
              id="modal-container"
              modal
              :hidden="${(x) => !x.isOpenModal}"
            >
              <h2>Create a Tool</h2>
              <slot></slot>
              <fast-button @click="${(x) => x.closeModal()}">Close</fast-button>
            </fast-dialog>
          `
        )}
        <div class="u-mt-md"></div>
        <trs-list baseUrl="${(x) => x.baseUrl}"></trs-list
      ></fast-tab-panel>
      <fast-tab-panel slot="tabpanel" class="custom-tabpanel">
        <div class="u-mt-md"></div>
        <trs-classes baseUrl="${(x) => x.baseUrl}"></trs-classes>
      </fast-tab-panel>
    </fast-tabs>
  </div>
`;
