import { html, repeat, when } from '@microsoft/fast-element';
import {
  provideFASTDesignSystem,
  fastTextField,
  fastSwitch,
  fastButton,
  fastDivider,
} from '@microsoft/fast-components';
import TESCreateRun from './tesCreateRun.js';

provideFASTDesignSystem().register(
  fastTextField(),
  fastSwitch(),
  fastButton(),
  fastDivider()
);

const ExecutorsTemplate = html<TESCreateRun>`
  ${repeat(
    (x) => x.taskExecutors,
    html`
      <div class="executors">
        <div class="label-input commands">
          <label for="command">Command:</label>
          <fast-text-field
            type="text"
            id="command"
            name="command"
            class="input"
            :value=${(x) => x.command.join(',')}
            @input=${(x, c) =>
              c.parent.handleExecutorsCommandChange(c.event, x)}
          ></fast-text-field>
        </div>
        <div class="label-input image">
          <label for="command">Image:</label>
          <fast-text-field
            type="text"
            id="image"
            name="image"
            class="input"
            :value=${(x) => x.image}
            @input=${(x, c) => c.parent.handleExecutorsImageChange(c.event, x)}
          ></fast-text-field>
        </div>
        <div class="container env-container">
          <span class="data-button">
            <fast-button
              class="add"
              id="add-env"
              @click=${(x, c) => c.parent.addEnv(x)}
            >
              Add Env
            </fast-button>
          </span>
          <div class="env">
            ${repeat(
              (x) => Array.from(Array(Object.keys(x.env).length).keys()),
              html` <div class="label-input env-name">
                  <label for="env-name">Env${(x) => x + 1} Name:</label>
                  <fast-text-field
                    type="text"
                    id="env-name"
                    name="env-name"
                    class="input"
                    :value=${(x, c) => Object.keys(c.parent.env)[x]}
                    @input=${(x, c) =>
                      c.parentContext.parent.handleEnvNameChange(
                        c.event,
                        c.parent,
                        x
                      )}
                  ></fast-text-field>
                </div>
                <div class="label-input env-value">
                  <label for="env-value">Env${(x) => x + 1} Value:</label>
                  <fast-text-field
                    type="text"
                    id="env-value"
                    name="env-value"
                    :value=${(x, c) => Object.values(c.parent.env)[x]}
                    class="input"
                    @input=${(x, c) =>
                      c.parentContext.parent.handleEnvValueChange(
                        c.event,
                        c.parent,
                        x
                      )}
                  ></fast-text-field>
                </div>`
            )}
          </div>
          ${when(
            (x) => Object.keys(x.env).length,
            html`<span class="data-button">
              <fast-button
                class="delete"
                id="delete-env"
                @click=${(x, c) => c.parent.deleteEnv(x)}
              >
                Add Env
              </fast-button>
            </span>`
          )}
        </div>
        <div class="label-input stderr">
          <label for="stderr">Stderr:</label>
          <fast-text-field
            type="text"
            id="stderr"
            name="stderr"
            class="input"
            :value=${(x) => x.stderr}
            @input=${(x, c) => c.parent.handleExecutorsStderrChange(c.event, x)}
          ></fast-text-field>
        </div>
        <div class="label-input stdin">
          <label for="stdin">Stdin:</label>
          <fast-text-field
            type="text"
            id="stdin"
            name="stdin"
            class="input"
            :value=${(x) => x.stdin}
            @input=${(x, c) => c.parent.handleExecutorsStdinChange(c.event, x)}
          ></fast-text-field>
        </div>
        <div class="label-input stdout">
          <label for="stdout">Stdout:</label>
          <fast-text-field
            type="text"
            id="stdout"
            name="stdout"
            class="input"
            :value=${(x) => x.stdout}
            @input=${(x, c) => c.parent.handleExecutorsStdoutChange(c.event, x)}
          ></fast-text-field>
        </div>
        <div class="label-input workdir">
          <label for="workdir">Workdir:</label>
          <fast-text-field
            type="text"
            id="workdir"
            name="workdir"
            class="input"
            :value=${(x) => x.workdir}
            @input=${(x, c) =>
              c.parent.handleExecutorsWorkdirChange(c.event, x)}
          ></fast-text-field>
        </div>
      </div>
      <fast-divider></fast-divider>
    `,
    { positioning: true }
  )}
`;

const InputTemplate = html<TESCreateRun>`
  ${repeat(
    (x) => x.taskInput,
    html`
      <div class="inputs">
        <div class="label-input input-path">
          <label for="name">Path:</label>
          <fast-text-field
            type="text"
            id="input-path"
            name="input-path"
            class="input"
            :value=${(x) => x.path}
            @input=${(x, c) => c.parent.handleInputPathChange(c.event, x)}
          ></fast-text-field>
        </div>
        <div class="label-input input-url">
          <label for="name">URL:</label>
          <fast-text-field
            type="text"
            id="input-url"
            name="input-url"
            class="input"
            :value=${(x) => x.url}
            @input=${(x, c) => c.parent.handleInputUrlChange(c.event, x)}
          ></fast-text-field>
        </div>
      </div>
    `
  )}
`;

const OutputTemplate = html<TESCreateRun>`
  ${repeat(
    (x) => x.taskOutput,
    html`
      <div class="outputs">
        <div class="label-input output-path">
          <label for="name">Path:</label>
          <fast-text-field
            type="text"
            id="output-path"
            name="output-path"
            class="input"
            :value=${(x) => x.path}
            @input=${(x, c) => c.parent.handleOutputPathChange(c.event, x)}
          ></fast-text-field>
        </div>
        <div class="label-input output-url">
          <label for="name">URL:</label>
          <fast-text-field
            type="text"
            id="output-url"
            name="output-url"
            class="input"
            :value=${(x) => x.url}
            @input=${(x, c) => c.parent.handleOutputUrlChange(c.event, x)}
          ></fast-text-field>
        </div>
        <div class="label-input output-type">
          <label for="name">Type:</label>
          <fast-text-field
            type="text"
            id="output-type"
            name="output-type"
            class="input"
            :value=${(x) => x.type}
            @input=${(x, c) => c.parent.handleOutputTypeChange(c.event, x)}
          ></fast-text-field>
        </div>
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
         <fast-text-field type="text" id="state" name="state" class="input" :value=${(
           x
         ) => x.state} @input=${(x, c) => x.handleStateInput(c.event)} required>
      </div>
      <div class="label-input">
         <label for="description">Description:</label>
         <fast-text-field type="text" id="description" name="description" class="input" :value=${(
           x
         ) => x.description}
         @input=${(x, c) => x.handleDescriptionInput(c.event)} required>
      </div>
   </div>
   <div class="container executors-container">
      <fieldset>
         <legend>Executors</legend>
         <span class="data-button">
            <fast-button class="add" id="add-executors" @click=${(x) =>
              x.addExecutor()} > Add Executors
            </fast-button>
         </span>
         ${ExecutorsTemplate}
         ${when(
           (x) => x.taskExecutorsLength > 1,
           html` <span class="data-button">
             <fast-button
               class="delete"
               id="delete-executor"
               @click=${(x) => x.deleteExecutor()}
             >
               delete Executors
             </fast-button>
           </span>`
         )}
      </fieldset>
   </div>
   <div class="container input-container">
      <fieldset>
         <legend>Input</legend>
         <span class="data-button">
            <fast-button class="add" id="add-input" @click=${(x) =>
              x.addInput()}> Add Inputs
            </fast-button>
         </span>
         ${InputTemplate}
         ${when(
           (x) => x.taskInputLength > 1,
           html`
             <span class="data-button">
               <fast-button
                 class="delete"
                 id="delete-input"
                 @click=${(x) => x.deleteInput()}
               >
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
            <fast-button class="add" id="add-output" @click=${(x) =>
              x.addOutput()} > Add Outputs
            </fast-button>
         </span>
         ${OutputTemplate}
         ${when(
           (x) => x.taskOutputLength > 1,
           html`
             <span class="data-button">
               <fast-button
                 class="delete"
                 id="delete-output"
                 @click=${(x) => x.deleteOutput()}
               >
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
              <fast-text-field type="text" id="zones" name="zones" class="input" :value=${(
                x
              ) => x.zones.join(',')} @input=${(x, c) =>
  x.handleZonesInput(c.event)} required>
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
   <div class="container tags-container">
      <fieldset>
         <legend>Tag</legend>
         <div class="tags">
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
            </div>
      </fieldset>
   </div>
   <div class="container volumes">
      <div class="label-input">
         <label for="volumes">Volumes:</label>
         <fast-text-field type="text" id="volumes" name="volumes" class="input" :value=${(
           x
         ) => x.volumes.join(',')} @input=${(x, c) =>
  x.handleVolumesInput(c.event)} required >
      </div>
   </div>
   <div class="submit-button-container">
   <fast-button class="submit-button" @click=${(x) =>
     x.handleSubmit()} >Create Task
   </fast-button>
   </div>
</form>
`;
export default template;
