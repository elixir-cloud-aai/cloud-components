import { html, repeat } from '@microsoft/fast-element';
const fields = [
    'workflow_params',
    'workflow_type',
    'workflow_type_version',
    'tags',
    'workflow_engine_parameters',
    'workflow_url',
];
const template = html `
  <form>
    ${repeat(() => fields, html `
        <div class="label-input">
          ${(x, c) => console.log(x, c)}
          <label for=${(x) => x}>${(x) => x}</label>
          <input
            type="text"
            id=${(x) => x}
            name=${(x) => x}
            @input=${(_, c) => c.parent.handleInput(c.event)}
            required
          />
        </div>
      `)}
    <div class="label-input">
      <label for="workflow_attachment">workflow_attachment</label>
      <input
        type="file"
        id="workflow_attachment"
        name="workflow_attachment"
        @input=${(x, c) => x.handleInput(c.event)}
        multiple
        required
      />
    </div>
    <div class="submit">
      <button type="submit" @click=${(x) => x.handleSubmit()}>Submit</button>
    </div>
  </form>
`;
export default template;
//# sourceMappingURL=wesCreateRun.template.js.map