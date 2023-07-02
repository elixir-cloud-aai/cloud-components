import { html, repeat, when } from '@microsoft/fast-element';
import {
  provideFASTDesignSystem,
  fastTextField,
  fastCheckbox,
  fastButton,
} from '@microsoft/fast-components';
import TESCreateRun from './tesCreateRun.js';

provideFASTDesignSystem().register(
  fastTextField(),
  fastCheckbox(),
  fastButton(),
);

interface Input {
  name: string;
  label: string;
  required?: boolean;
}

export const executorFields: Input[] = [
  {
    name: 'Command',
    label: 'command',
    required: true,
  },
  {
    name: 'BLASTDB',
    label: 'blastdb',
    required: true,
  },
  { name: 'HMMERDB', label: 'hmmerdb', required: true },
  { name: 'Image', label: 'image', required: true },
  { name: 'Stderr', label: 'stderr', required: true },
  { name: 'Stdin', label: 'stdin', required: true },
  { name: 'Workdir', label: 'workdir', required: true },
];

const executorsTemplate = html<TESCreateRun>`
  ${repeat(
    x => x.executors,
    html`
      <div class="executors">
        ${repeat(
    () => executorFields,
    html<Input>`
            <div class="label-input ${x => x.label}">
              <label for="${x => x.label}">${x => x.name}</label>
              <fast-text-field
                type="text"
                id="${x => x.label}"
                name="${x => x.label}"
                required="${x => x.required}"
                class="input"
                @input=${(x, c) => c.parentContext.parent.handleExecutorChange(
    // @ts-expect-error: value does not exist on the event target for some reason
    c.event.target.value,
    c.parent.index,
    x.label,
  )}
              >
              </fast-text-field>
            </div>
          `,
  )}
      </div>
    `,
  )}
`;

const template = html<TESCreateRun>`
<form class="container">
   <div class="meta">
      <div class="label-input">
         <label for="name">Name:</label>
         <fast-text-field type="text" id="name" name="name" class="input" :value=${x => x.name} required>
      </div>
      <div class="label-input">
         <label for="description">Description:</label>
         <fast-text-field type="text" id="description" name="description" class="input" :value=${x => x.description} required>
      </div>
      <div class="label-input">
         <label for="state">State:</label>
         <fast-text-field type="text" id="state" name="state" class="input" :value=${x => x.state} required>
      </div>
   </div>
   <div class="executor-container" >
    <span class="heading">
      <h2 class="header">Executors</h2> 
      <fast-button class="add" @click=${x => x.addExecutor()} > Add </fast-button>
    </span>
    
    ${executorsTemplate} 
    ${when(
    x => x.executorsLength > 1,
    html`
        <span class="delete">
          <fast-button @click=${x => x.deleteExecutor()}>
            Delete
          </fast-button>
        </span>
      `,
  )}
    
   </div>
   
   <div class="input">
      <div class="label-input">
         <label for="url">URL:</label>
         <fast-text-field type="text" id="url" name="url" class="input" required>
      </div>
      <div class="label-input">
         <label for="path">Path:</label>
         <fast-text-field type="text" id="path" name="path" class="input" required>
      </div>
   </div>
   <div class="outputs">
      <div class="label-input">
         <label for="outfile-path">Outfile Path:</label>
         <fast-text-field type="text" id="outfile-path" name="outfile-path" class="input" required>
      </div>
      <div class="label-input">
         <label for="outfile-url">Outfile URL:</label>
         <fast-text-field type="text" id="outfile-url" name="outfile-url" class="input" required>
      </div>
      <div class="label-input">
         <label for="outfile-type">Outfile Type:</label>
         <fast-text-field type="text" id="outfile-type" name="outfile-type" class="input" required>
      </div>
      <label>Resources</label>
      <div class="resources sec">
         <div class="label-input">
            <label for="cpu-cores">CPU Cores:</label>
            <fast-text-field type="number" id="cpu-cores" name="cpu-cores" class="input" :value=${x => x.cpu_cores} required>
         </div>
         <div class="label-input">
            <label for="disk-gb">Disk GB:</label>
            <fast-text-field type="number" id="disk-gb" name="disk-gb" class="input" :value=${x => x.disk_gb} required>
         </div>
         <div class="label-input">
            <label for="ram-gb">RAM GB:</label>
            <fast-text-field type="number" id="ram-gb" name="ram-gb" class="input" :value=${x => x.ram_gb} required>
         </div>
         <div class="label-input">
            <label for="zones">Zones:</label>
            <fast-text-field type="text" id="zones" name="zones" class="input" required>
         </div>
         <fast-checkbox style="background-color:grey" id="preemptible" name="preemptible" class="checkbox-field">Preemptible</fast-checkbox>
      </div>
      <label>Tags</label>
      <div class="tags sec df">
         <div class="label-input">
            <label for="workflow-id">Workflow ID:</label>
            <fast-text-field type="text" id="workflow-id" name="workflow-id" class="input" :value=${x => x.WORKFLOW_ID} required>
         </div>
         <div class="label-input">
            <label for="project-group">Project Group:</label>
            <fast-text-field type="text" id="project-group" name="project-group" class="input" :value=${x => x.PROJECT_GROUP} required>
         </div>
      </div>
      <div class="volumes">
         <div class="label-input">
            <label for="volumes">Volumes:</label>
            <fast-text-field type="text" id="volumes" name="volumes" class="input" required>
         </div>
      </div>
      <fast-button class="submit-button" @click=${x => x.handleClick()}>Create Task</fast-button>
</form>
`;

export default template;
