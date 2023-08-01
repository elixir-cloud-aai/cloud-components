import { html, repeat, when } from '@microsoft/fast-element';

const OtherTemplate: any = (x: any) => html`
  <div class="container key-value">
    <div class="key">${x[0]}</div>
    <div class="value">${x[1]}</div>
  </div>
`;

const ArrayTemplate: any = (x: any) => html`
  <div class="container array-container">
    <div class="key">${x[0]}</div>
    <div class="value array-value">
      ${repeat(
        (arr) => arr[1],
        html`
          ${when(
            (val) => Array.isArray(val[1]),
            html`${(val) => ArrayTemplate(val)} `
          )}
          ${when(
            (val) =>
              typeof val[1] === 'object' &&
              val[1] !== null &&
              !Array.isArray(val[1]),
            html` ${(val) => ObjectTemplate(val)} `
          )}
          ${when((val) => typeof val[1] !== 'object', html` ${(val) => val} `)}
        `
      )}
    </div>
  </div>
`;

const ObjectTemplate: any = (x: any) => html`
  <div class="obj-name">${x[0]}:</div>
  <div class="object-container">
    <div class="value object-value">
      ${when(
        (obj) => Object.entries(obj[1]).length > 0,
        html`
          ${repeat(
            (val) => Object.entries(val[1]),
            html`
              ${when(
                (val) => Array.isArray(val[1]),
                html` ${(val) => ArrayTemplate(val)} `
              )}
              ${when(
                (val) =>
                  typeof val[1] === 'object' &&
                  val[1] !== null &&
                  !Array.isArray(x[1]),
                html` ${(val) => ObjectTemplate(val)} `
              )}
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

const template = html`
  <div class="Outer-container">
    ${when(
      (x) => Object.entries(x.data).length > 0,
      html`
        ${repeat(
          (x) => Object.entries(x.data),
          html`
            ${when(
              (val) => Array.isArray(val[1]),
              html` ${(val) => ArrayTemplate(val)} `
            )}
            ${when(
              (val) =>
                typeof val[1] === 'object' &&
                val[1] !== null &&
                !Array.isArray(val[1]),
              html` ${(x) => ObjectTemplate(x)} `
            )}
            ${when(
              (val) => typeof val[1] !== 'object',
              html` ${(val) => OtherTemplate(val)} `
            )}
          `
        )}
      `
    )}
  </div>
`;

export default template;
