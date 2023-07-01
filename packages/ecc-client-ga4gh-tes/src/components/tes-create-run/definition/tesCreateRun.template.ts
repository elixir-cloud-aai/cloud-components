import { html } from '@microsoft/fast-element';
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

const template = html<TESCreateRun>`
<form class="container">
   <div class="meta">
      <div class="label-input">
         <label for="name">Name:</label>
         <fast-text-field type="text" id="name" name="name" class="input" required>
      </div>
      <div class="label-input">
         <label for="description">Description:</label>
         <fast-text-field type="text" id="description" name="description" class="input" required>
      </div>
      <div class="label-input">
         <label for="state">State:</label>
         <fast-text-field type="text" id="state" name="state" class="input" required>
      </div>
   </div>
   <div class="executors">
      <div class="label-input">
         <label for="command">Command:</label>
         <fast-text-field type="text" id="command" name="command" class="input" required>
      </div>
      <label>Env:</label>
      <div class="sec df">
         <div class="label-input">
            <label for="blastdb">BLASTDB:</label>
            <fast-text-field type="text" id="blastdb" name="blastdb" class="input" required>
         </div>
         <div class="label-input">
            <label for="hmmerdb">HMMERDB:</label>
            <fast-text-field type="text" id="hmmerdb" name="hmmerdb" class="input" required>
         </div>
      </div>
      <div class="sec">
        <div class="label-input">
          <label for="image">Image:</label>
          <fast-text-field type="text" id="image" name="image" class="input" required>
        </div>
        <div class="label-input">
          <label for="stderr">Stderr:</label>
          <fast-text-field type="text" id="stderr" name="stderr" class="input" required>
        </div>
        <div class="label-input">
          <label for="stdin">Stdin:</label>
          <fast-text-field type="text" id="stdin" name="stdin" class="input" required>
        </div>
        <div class="label-input">
          <label for="stdout">Stdout:</label>
          <fast-text-field type="text" id="stdout" name="stdout" class="input" required>
        </div>
        <div class="label-input">
          <label for="workdir">Workdir:</label>
          <fast-text-field type="text" id="workdir" name="workdir" class="input" required>
        </div>
      </div>
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
            <fast-text-field type="number" id="cpu-cores" name="cpu-cores" class="input" required>
         </div>
         <div class="label-input">
            <label for="disk-gb">Disk GB:</label>
            <fast-text-field type="number" id="disk-gb" name="disk-gb" class="input" required>
         </div>
         <div class="label-input">
            <label for="ram-gb">RAM GB:</label>
            <fast-text-field type="number" id="ram-gb" name="ram-gb" class="input" required>
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
            <fast-text-field type="text" id="workflow-id" name="workflow-id" class="input" required>
         </div>
         <div class="label-input">
            <label for="project-group">Project Group:</label>
            <fast-text-field type="text" id="project-group" name="project-group" class="input" required>
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
