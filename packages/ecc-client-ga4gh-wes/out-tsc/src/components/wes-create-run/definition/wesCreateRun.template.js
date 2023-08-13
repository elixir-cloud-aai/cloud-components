import { html } from '@microsoft/fast-element';
const template = html `
  <form>
    <div class="label-input">
      <label for="workflow_params">workflow_params</label>
      <input
        type="text"
        id="workflow_params"
        name="workflow_params"
        @input=${(x, c) => x.handleInput(c.event)}
        required
      />
    </div>
    <div class="label-input">
      <label for="workflow_type">workflow_type</label>
      <input
        type="text"
        id="workflow_type"
        name="workflow_type"
        @input=${(x, c) => x.handleInput(c.event)}
        required
      />
    </div>
    <div class="label-input">
      <label for="workflow_type_version">workflow_type_version</label>
      <input
        type="text"
        id="workflow_type_version"
        name="workflow_type_version"
        @input=${(x, c) => x.handleInput(c.event)}
        required
      />
    </div>
    <div class="label-input">
      <label for="tags">tags</label>
      <input
        type="text"
        id="tags"
        name="tags"
        @input=${(x, c) => x.handleInput(c.event)}
        required
      />
    </div>
    <div class="label-input">
      <label for="workflow_engine_parameters">workflow_engine_parameters</label>
      <input
        type="text"
        id="workflow_engine_parameters"
        name="workflow_engine_parameters"
        @input=${(x, c) => x.handleInput(c.event)}
        required
      />
    </div>
    <div class="label-input">
      <label for="workflow_url">workflow_url</label>
      <input
        type="text"
        id="workflow_url"
        name="workflow_url"
        @input=${(x, c) => x.handleInput(c.event)}
        required
      />
    </div>
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