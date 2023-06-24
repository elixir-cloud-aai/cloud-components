import { html, repeat, when } from "@microsoft/fast-element";
import {
  allComponents,
  provideFASTDesignSystem,
} from "@microsoft/fast-components";
import { TRS } from "./trs.js";
import { Tool, Version } from "./trs.interface.js";

provideFASTDesignSystem().register(allComponents);

export const template = html<TRS>`
  ${when((x) => !x.ready, html<TRS>` Loading... `)}
  <fast-accordion expand-mode="multi">
    ${repeat(
      (x) => x.tools,
      html<Tool>`
        <fast-accordion-item class="accordionItem">
          <table class="styled-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>URL</th>
              </tr>
            </thead>
            <tbody>
              <tr class="active-row">
                <td>${(x) => x.id}</td>
                <td>${(x) => x.name}</td>
                <td>${(x) => x.description}</td>
                <td><a href=${(x) => x.url}>${(x) => x.url}</a></td>
              </tr>
            </tbody>
          </table>
          <div>
            <h3>Aliases:</h3>
            ${repeat(
              (x) => x.aliases,
              html<string>`
                <fast-copy value="${(alias) => alias}"></fast-copy>
                <div class="space"></div>
              `
            )}
          </div>
          <div class="space"></div>
          <h3>Versions:</h3>
          <fast-tabs orientation="vertical">
            ${repeat(
              (x) => x.versions,
              html<Version>`
                <fast-tab slot="tab">${(x) => x.name}</fast-tab>
                <fast-tab-panel slot="tabpanel" class="tabContent">
                  <div>ID: ${(x) => x.id}</div>
                  <div>Author: ${(x) => x.author.join(", ")}</div>
                  <div>Meta Version: ${(x) => x.meta_version}</div>
                </fast-tab-panel>
              `
            )}
          </fast-tabs>

          <div slot="heading" class="accordionItem">
            <h3 class="toolName">Tool #${(x) => x.id} (${(x) => x.name})</h3>
          </div>
          <svg
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
            ></path></svg
          ><svg
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
            ></path></svg
        ></fast-accordion-item>
      `
    )}
  </fast-accordion>
`;
