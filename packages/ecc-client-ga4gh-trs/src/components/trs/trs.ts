import {
  FASTElement,
  customElement,
  observable,
} from "@microsoft/fast-element";
import { template } from "./trs.template";
import { styles } from "./trs.styles";

@customElement({
  name: "fast-trs",
  template,
  styles,
})
export class TRS extends FASTElement {
  @observable ready: boolean = false;
  @observable tools: any[] = [];

  connectedCallback() {
    super.connectedCallback();
    this.loadData();
  }

  async loadData() {
    const response = await fetch(
      "https://trs-filer-test.rahtiapp.fi/ga4gh/trs/v2/tools?limit=1000"
    );
    const data = await response.json();

    this.tools = data;
    this.ready = true;
  }
}
