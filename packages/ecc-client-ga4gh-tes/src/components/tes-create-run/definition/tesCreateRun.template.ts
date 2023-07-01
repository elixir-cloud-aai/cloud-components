import { html } from '@microsoft/fast-element';
import TESCreateRun from './tesCreateRun.js';

const template = html<TESCreateRun>`
  <button @click=${x => x.handleClick()}>Click me</button>
  <form>
  <div class="meta df">
    <label for="name">Name:</label>
    <input type="text" id="name" name="name" class="input-field" required><br><br>

    <label for="description">Description:</label>
    <input type="text" id="description" name="description" class="input-field" required><br><br>

    <label for="state">State:</label>
    <input type="text" id="state" name="state" class="input-field" required><br><br>

  </div>
  <div class="executors">
    <label for="command">Command:</label>
    <input type="text" id="command" name="command" class="input-field" required><br><br>

    <label for="blastdb">BLASTDB:</label>
    <input type="text" id="blastdb" name="blastdb" class="input-field" required><br><br>

    <label for="hmmerdb">HMMERDB:</label>
    <input type="text" id="hmmerdb" name="hmmerdb" class="input-field" required><br><br>

    <label for="image">Image:</label>
    <input type="text" id="image" name="image" class="input-field" required><br><br>

    <label for="stderr">Stderr:</label>
    <input type="text" id="stderr" name="stderr" class="input-field" required><br><br>

    <label for="stdin">Stdin:</label>
    <input type="text" id="stdin" name="stdin" class="input-field" required><br><br>

    <label for="stdout">Stdout:</label>
    <input type="text" id="stdout" name="stdout" class="input-field" required><br><br>

    <label for="workdir">Workdir:</label>
    <input type="text" id="workdir" name="workdir" class="input-field" required><br><br>
  </div>

  <div class="inputs">
    <label for="url">URL:</label>
    <input type="text" id="url" name="url" class="input-field" required><br><br>

    <label for="path">Path:</label>
    <input type="text" id="path" name="path" class="input-field" required><br><br>
  </div>

  <div class="outputs">
    <label for="outfile-path">Outfile Path:</label>
    <input type="text" id="outfile-path" name="outfile-path" class="input-field" required><br><br>

    <label for="outfile-url">Outfile URL:</label>
    <input type="text" id="outfile-url" name="outfile-url" class="input-field" required><br><br>

    <label for="outfile-type">Outfile Type:</label>
    <input type="text" id="outfile-type" name="outfile-type" class="input-field" required><br><br>
    <div>

    <class class="resources">
    <label for="cpu-cores">CPU Cores:</label>
    <input type="number" id="cpu-cores" name="cpu-cores" class="input-field" required><br><br>

    <label for="disk-gb">Disk GB:</label>
    <input type="number" id="disk-gb" name="disk-gb" class="input-field" required><br><br>

    <label for="preemptible">Preemptible:</label>
    <input type="checkbox" id="preemptible" name="preemptible" class="checkbox-field"><br><br>

    <label for="ram-gb">RAM GB:</label>
    <input type="number" id="ram-gb" name="ram-gb" class="input-field" required><br><br>

    <label for="zones">Zones:</label>
    <input type="text" id="zones" name="zones" class="input-field" required><br><br>
  </div>
  <div class="tags">
    <label for="workflow-id">Workflow ID:</label>
    <input type="text" id="workflow-id" name="workflow-id" class="input-field" required><br><br>

    <label for="project-group">Project Group:</label>
    <input type="text" id="project-group" name="project-group" class="input-field" required><br><br>
  </div>
  <div class="volumes">
    <label for="volumes">Volumes:</label>
    <input type="text" id="volumes" name="volumes" class="input-field" required><br><br>
  </div>
  <input type="submit" value="Submit" class="submit-button">
</form>
`;

export default template;
