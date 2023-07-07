import {
  FASTElement,
  attr,
  customElement,
  observable,
} from "@microsoft/fast-element";
import { template } from "./ecc-trs.template.js";
import { styles } from "./ecc-trs.styles.js";
import { IToolClass } from "./ecc-trs.interface.js";

@customElement({
  name: "ecc-client-ga4gh-trs",
  template,
  styles,
})
export class TRS extends FASTElement {
  @attr public baseUrl = '';

  @observable ready = false;

  @observable tools: any[] = [];

  @observable limit = 5;

  @observable currentPage = 1;

  @observable pageCount: number;

  @observable searchQuery = "";

  @observable isOpenFilter = false;

  @observable toolClasses: IToolClass[] = [];

  @observable filterParams: { [key: string]: string | undefined | boolean } = {
    id: "",
    alias: "",
    toolClass: "",
    descriptorType: "",
    registry: "",
    organization: "",
    name: "",
    description: "",
    author: "",
    checker: undefined,
    offset: "",
  };

  async connectedCallback() {
    super.connectedCallback();
    await this.loadData();
    await this.loadTools();
  }

  disconnectedCallback() {
    console.log("disconnected");
    super.disconnectedCallback();
  }

  async loadData() {
    let url = `${this.baseUrl}/tools?limit=${this.limit}`;
    if (this.searchQuery.length > 0) {
      url += `&toolname=${this.searchQuery}`;
    }
    Object.entries(this.filterParams).forEach(([key, value]) => {
      if (value !== "" && value !== undefined) {
        url += `&${key}=${value}`;
      }
    });
    const response = await fetch(url);
    const data = await response.json();

    this.tools = data;
    this.pageCount = Math.ceil(this.tools.length / this.limit);
    this.ready = true;
  }

  async loadTools(): Promise<void> {
    const url = `${this.baseUrl}/toolClasses`;
    const response = await fetch(url);
    const data = await response.json();
    this.toolClasses = data;
  }

  handleSearchChange = (e: Event) => {
    this.searchQuery = (e.target as HTMLInputElement).value;
    // debounce search

    setTimeout(() => {
      this.loadData();
    }, 1000);
  };

  handleOpenFilter = () => {
    this.isOpenFilter = !this.isOpenFilter;
  };

  handleSelectToolClass = (e: Event) => {
    this.filterParams.toolClass = (e.target as HTMLInputElement).value;
  };

  handleFilterParamChange = (e: Event) => {
    const { name, value } = e.target as HTMLInputElement;
    this.filterParams[name] = value;
  };

  handleApplyFilter = () => {
    console.log(this.filterParams);
    this.loadData();
    this.isOpenFilter = false;
  };

  handleClearFilter = () => {
    this.filterParams = {
      id: "",
      alias: "",
      toolClass: "",
      descriptorType: "",
      registry: "",
      organization: "",
      name: "",
      description: "",
      author: "",
      checker: undefined,
      offset: "",
    };
  };

  handlePrevPage = () => {
    if (this.currentPage === 1) return;
    this.currentPage -= 1;
  };

  handleNextPage = () => {
    if (this.currentPage === this.pageCount) return;
    this.currentPage += 1;
  };
}
