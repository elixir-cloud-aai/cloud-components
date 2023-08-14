import { html, repeat, when } from '@microsoft/fast-element';

const conditionalRender = () => html`${when(
  (val) => Array.isArray(val[1]),
  html`${(val) => ArrayTemplate(val)} `
)}
${when(
  (val) =>
    typeof val[1] === 'object' && val[1] !== null && !Array.isArray(val[1]),
  html` ${(val) => ObjectTemplate(val)} `
)}`;

const OtherTemplate: any = (x: any) => html`
  <div class="template-container container key-value">
    <div class="key">${x[0]}</div>
    <div class="value">${x[1]}</div>
  </div>
`;

const ArrayTemplate: any = (x: any) => html`
  <div class="template-container">
    <div class="container array-container">
      <div class="key">${x[0]}</div>
      <div class="value array-value">
        ${repeat(
          (arr) => arr[1],
          html`
            ${conditionalRender()}
            ${when(
              (val) => typeof val[1] !== 'object',
              html` ${(val) => val} `
            )}
          `
        )}
      </div>
    </div>
  </div>
`;

const ObjectTemplate: any = (x: any) => html`
  <div class="template-container">
    <div class="obj-name">${x[0]}:</div>
    <div class="object-container">
      <div class="value object-value">
        ${when(
          (obj) => Object.entries(obj[1]).length > 0,
          html`
            ${repeat(
              (val) => Object.entries(val[1]),
              html`
                ${conditionalRender()}
                ${when(
                  (val) => typeof val[1] !== 'object',
                  html` ${(val) => OtherTemplate(val)} `
                )}
              `
            )}
          `
        )}
      </div>
    </div>
  </div>
`;

const template = html`
  <div class="template-container">
    <div class="Outer-container">
      ${when(
        (x) => Object.entries(x.data).length > 0,
        html`
          ${repeat(
            (x) => Object.entries(x.data),
            html`
              ${conditionalRender()}
              ${when(
                (val) => typeof val[1] !== 'object',
                html` ${(val) => OtherTemplate(val)} `
              )}
            `
          )}
        `
      )}
    </div>
  </div>
`;

export default template;
