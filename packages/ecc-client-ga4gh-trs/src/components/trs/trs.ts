import {
  FASTElement,
  attr,
  customElement,
  observable,
} from "@microsoft/fast-element";
import { template } from "./trs.template";
import { styles } from "./trs.styles";
import { IToolClass } from "./trs.interface";

@customElement({
  name: "fast-trs",
  template,
  styles,
})
export class TRS extends FASTElement {
  @observable ready: boolean = false;
  @observable tools: any[] = [];
  @observable limit: number = 5;
  @observable currentPage: number = 1;
  @observable pageCount: number;
  @observable searchQuery = "";
  @observable isOpenFilter: boolean = false;
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

  public baseUrl = "https://trs-filer-test.rahtiapp.fi/ga4gh/trs/v2";

  async connectedCallback() {
    super.connectedCallback();
    await this.loadData();
    await this.loadTools();
  }

  async disconnectedCallback() {
    await super.disconnectedCallback();
  }

  async loadData() {
    let url = `${this.baseUrl}/tools?limit=${this.limit}`;
    if (this.searchQuery.length > 0) {
      url += `&toolname=${this.searchQuery}`;
    }
    for (const key in this.filterParams) {
      if (
        this.filterParams[key] !== "" &&
        this.filterParams[key] !== undefined
      ) {
        url += `&${key}=${this.filterParams[key]}`;
      }
    }
    const response = await fetch(url);
    const data = await response.json();

    this.tools = data;
    this.pageCount = Math.ceil(this.tools.length / this.limit);
    this.ready = true;
  }

  async loadTools(): Promise<void> {
    let url = `${this.baseUrl}/toolClasses`;
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
