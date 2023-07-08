import { html, repeat, when } from '@microsoft/fast-element';
import {
  provideFASTDesignSystem,
  fastTextField,
  fastSwitch,
  fastButton,
} from '@microsoft/fast-components';
import TESCreateRun from './tesCreateRun.js';

provideFASTDesignSystem().register(fastTextField(), fastSwitch(), fastButton());
interface Input {
  name: string;
  label: string;
  required?: boolean;
}

// Executors
export const executorFields: Input[] = [
  {
    name: 'Command',
    label: 'command',
    required: true,
  },
  { name: 'Image', label: 'image', required: true },
  {
    name: 'BLASTDB',
    label: 'blastdb',
    required: true,
  },
  { name: 'HMMERDB', label: 'hmmerdb', required: true },
  { name: 'Stderr', label: 'stderr', required: true },
  { name: 'Stdin', label: 'stdin', required: true },
  { name: 'Stdout', label: 'stdout', required: true },
  { name: 'Workdir', label: 'workdir', required: true },
];

const executorsTemplate = html<TESCreateRun>`
  ${repeat(
    (x) => x.executors,
    html`
      <div class="executors">
        ${repeat(
          () => executorFields,
          html<Input>`
            <div class="label-input ${(x) => x.label}">
              <label for="${(x) => x.label}">${(x) => x.name}</label>
              <fast-text-field
                type="text"
                id="${(x) => x.label}"
                name="${(x) => x.label}"
                required="${(x) => x.required}"
                class="input"
                @input=${(x, c) =>
                  c.parentContext.parent.handleExecutorChange(
                    // @ts-expect-error: value does not exist on the event target for some reason
                    c.event.target.value,
                    c.parent.index,
                    x.label
                  )}
              >
              </fast-text-field>
            </div>
          `
        )}
      </div>
    `
  )}
`;

// Input
export const inputFields: Input[] = [
  {
    name: 'URL',
    label: 'url',
    required: true,
  },
  {
    name: 'Path',
    label: 'path',
    required: true,
  },
];

const inputTemplate = html<TESCreateRun>`
  ${repeat(
    (x) => x.input,
    html`
      <div class="input">
        ${repeat(
          () => inputFields,
          html<Input>`
            <div class="label-input ${(x) => x.label}">
              <label for="${(x) => x.label}">${(x) => x.name}</label>
              <fast-text-field
                type="text"
                id="${(x) => x.label}"
                name="${(x) => x.label}"
                required="${(x) => x.required}"
                class="input"
                @input=${(x, c) =>
                  c.parentContext.parent.handleInputChange(
                    // @ts-expect-error: value does not exist on the event target for some reason
                    c.event.target.value,
                    c.parent.index,
                    x.label
                  )}
              >
              </fast-text-field>
            </div>
          `
        )}
      </div>
    `
  )}
`;

// Output
export const outputFields: Input[] = [
  {
    name: 'Path',
    label: 'path',
    required: true,
  },
  {
    name: 'URL',
    label: 'url',
    required: true,
  },
  {
    name: 'Type',
    label: 'type',
    required: true,
  },
];

const outputTemplate = html<TESCreateRun>`
  ${repeat(
    (x) => x.output,
    html`
      <div class="output">
        ${repeat(
          () => outputFields,
          html<Input>`
            <div class="label-input ${(x) => x.label}">
              <label for="${(x) => x.label}">${(x) => x.name}</label>
              <fast-text-field
                type="text"
                id="${(x) => x.label}"
                name="${(x) => x.label}"
                required="${(x) => x.required}"
                class="input"
                @input=${(x, c) =>
                  c.parentContext.parent.handleOutputChange(
                    // @ts-expect-error: value does not exist on the event target for some reason
                    c.event.target.value,
                    c.parent.index,
                    x.label
                  )}
              >
              </fast-text-field>
            </div>
          `
        )}
      </div>
    `
  )}
`;

const template = html<TESCreateRun>`
<form class="form-container" onsubmit="return false">
   <div class="container meta">
      <div class="label-input">
         <label for="name">Name:</label>
         <fast-text-field type="text" id="name" name="name" class="input" :value=${(
           x
         ) => x.name} @input=${(x, c) => x.handleNameInput(c.event)} required>
      </div>
      <div class="label-input">
         <label for="">State:</label>
         <fast-text-field type="text" id="" name="" class="input" :value=${(
           x
         ) => x.state} @input=${(x, c) => x.handleStateInput(c.event)} required>
      </div>
      <div class="label-input">
         <label for="description">Description:</label>
         <fast-text-field type="text" id="description" name="description" class="input" :value=${(
           x
         ) => x.description}
         @input=${(x, c) => x.handleDiscriptionInput(c.event)} required>
      </div>
   </div>
   <div class="container executors-container">
      <fieldset>
         <legend>Executors</legend>
         <span class="data-button">
            <fast-button class="add" @click=${(x) =>
              x.addExecutor()} > Add Executors
            </fast-button>
         </span>
         ${executorsTemplate}
         ${when(
           (x) => x.executorsLength > 1,
           html`
             <span class="data-button">
               <fast-button @click=${(x) => x.deleteExecutor()}>
                 Delete
               </fast-button>
             </span>
           `
         )}
      </fieldset>
   </div>
   <div class="container input-container">
      <fieldset>
         <legend>Input</legend>
         <span class="data-button">
            <fast-button class="add" @click=${(x) => x.addInput()} > Add Inputs
            </fast-button>
         </span>
         ${inputTemplate}
         ${when(
           (x) => x.inputLength > 1,
           html`
             <span class="data-button">
               <fast-button @click=${(x) => x.deleteInput()}>
                 Delete
               </fast-button>
             </span>
           `
         )}
      </fieldset>
   </div>
   <div class="container output-container">
      <fieldset>
         <legend>Output</legend>
         <span class="data-button">
            <fast-button class="add" @click=${(x) =>
              x.addOutput()} > Add Outputs
            </fast-button>
         </span>
         ${outputTemplate}
         ${when(
           (x) => x.outputLength > 1,
           html`
             <span class="data-button">
               <fast-button @click=${(x) => x.deleteOutput()}>
                 Delete
               </fast-button>
             </span>
           `
         )}
      </fieldset>
   </div>
   <div class="container resources-container">
      <fieldset>
         <legend>Resources</legend>
         <div class="resources">
           <div class="label-input">
              <label for="cpu-cores">CPU Cores:</label>
              <fast-text-field type="number" id="cpu-cores" name="cpu-cores" class="input" :value=${(
                x
              ) => x.cpu_cores} @input=${(x, c) =>
  x.handleCPUCoresInput(c.event)} required>
           </div>
           <div class="label-input">
              <label for="disk-gb">Disk GB:</label>
              <fast-text-field type="number" id="disk-gb" name="disk-gb" class="input" :value=${(
                x
              ) => x.disk_gb} @input=${(x, c) =>
  x.handleDiskGBInput(c.event)} required>
           </div>
           <div class="label-input">
              <label for="ram-gb">RAM GB:</label>
              <fast-text-field type="number" id="ram-gb" name="ram-gb" class="input" :value=${(
                x
              ) => x.ram_gb} @input=${(x, c) =>
  x.handleRAMGBInput(c.event)} required>
           </div>
           <div class="label-input">
              <label for="zones">Zones:</label>
              <fast-text-field type="text" id="zones" name="zones" class="input" @input=${(
                x,
                c
              ) => x.handleZonesInput(c.event)} required>
           </div>
           <div class="label-input">
              <label for="preemptible">Preemtible</label>
              <fast-switch id="preemptible" name="preemptible" class="checkbox-field" @change=${(
                x,
                c
              ) => x.handlePreemptibleInput(c.event)}></fast-switch>
           </div>
         </div>
      </fieldset>
   </div>
   <div class="container tags">
      <fieldset>
         <legend>Tag</legend>
         <div class="label-input">
            <label for="workflow-id">Workflow ID:</label>
            <fast-text-field type="text" id="workflow-id" name="workflow-id" class="input" :value=${(
              x
            ) => x.WORKFLOW_ID} @input=${(x, c) =>
  x.handleWorkflowIDInput(c.event)} required>
         </div>
         <div class="label-input">
            <label for="project-group">Project Group:</label>
            <fast-text-field type="text" id="project-group" name="project-group" class="input" :value=${(
              x
            ) => x.PROJECT_GROUP} @input=${(x, c) =>
  x.handleProjectGroupInput(c.event)} required>
         </div>
      </fieldset>
   </div>
   <div class="container volumes">
      <div class="label-input">
         <label for="volumes">Volumes:</label>
         <fast-text-field type="text" id="volumes" name="volumes" class="input" @input=${(
           x,
           c
         ) => x.handleVolumesInput(c.event)} required>
      </div>
   </div>
   <fast-button type="submit" class="submit-button" @click=${(x) =>
     x.handleClick()}>Create Task
   </fast-button>
</form>
`;
export default template;
