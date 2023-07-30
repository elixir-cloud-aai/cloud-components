import { html, repeat, when } from '@microsoft/fast-element';

const template = html`
  ${when(
    (x) => Object.entries(x.data).length > 1,
    html`
      <div class="service-container">
        <div class="name">
          <div class="key">Name</div>
          <div class="value">${(x) => x.data.name}</div>
        </div>
        <div class="description">
          <div class="key">Description</div>
          <div class="value">${(x) => x.data.description}</div>
        </div>
        <div class="id">
          <div class="key">ID</div>
          <div class="value">${(x) => x.data.id}</div>
        </div>
        <div class="version">
          <div class="key">Version</div>
          <div class="value">${(x) => x.data.version}</div>
        </div>
        <div class="organization">
          <div class="key">Organization</div>
          <div class="value">${(x) => x.data.organization.name}</div>
        </div>
        <div class="type">
          <div class="key">Type</div>
          <div class="value subcontainer">
            ${repeat(
              (x) => Object.entries(x.data.type),
              html`
                <div class="key">${(x) => x[0]}</div>
                <div class="value">${(x) => x[1]}</div>
              `
            )}
          </div>
        </div>
        <div class="storage">
          <div class="key">Storage</div>
          <div class="value subcontainer">
            ${repeat(
              (x) => x.data.storage,
              html` <div class="array-value">${(x) => x}</div> `
            )}
          </div>
        </div>
      </div>
    `
  )}
`;

export default template;
