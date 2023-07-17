import {
  FASTElement,
  attr,
  customElement,
  observable,
} from "@microsoft/fast-element";
import { template } from "./trs-list.template.js";
import { styles } from "./trs-list.styles.js";
import { IToolClass } from "./trs-list.interface.js";

/**
 * @class
 * @classdesc TRS Custom Element Class.
 * @extends FASTElement
 */
@customElement({
  name: "ecc-client-ga4gh-trs",
  template,
  styles,
})
export class TRS extends FASTElement {
  @attr public baseUrl = "";

  @observable ready = false;

  @observable tools: unknown[] = [];

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

  /**
   * @method
   * @description Load data on element connected.
   * @async
   */
  async connectedCallback() {
    super.connectedCallback();
    await this.loadData();
    await this.loadTools();
  }

  /**
   * @method
   * @description Log on element disconnected.
   */
  disconnectedCallback() {
    console.log("disconnected");
    super.disconnectedCallback();
  }

  /**
   * @method
   * @description Load data from the backend.
   * @async
   */
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

  /**
   * @method
   * @description Load tools from the backend.
   * @async
   * @returns {Promise<void>}
   */
  async loadTools(): Promise<void> {
    const url = `${this.baseUrl}/toolClasses`;
    const response = await fetch(url);
    const data = await response.json();
    this.toolClasses = data;
  }

  /**
   * @method
   * @description Handle search input change.
   * @param {Event} e - The triggering event.
   */
  handleSearchChange = (e: Event) => {
    this.searchQuery = (e.target as HTMLInputElement).value;
    // debounce search

    setTimeout(() => {
      this.loadData();
    }, 1000);
  };

  /**
   * @method
   * @description Handle filter open state.
   */
  handleOpenFilter = () => {
    this.isOpenFilter = !this.isOpenFilter;
  };

  /**
   * @method
   * @description Handle selection of tool class.
   * @param {Event} e - The triggering event.
   */
  handleSelectToolClass = (e: Event) => {
    this.filterParams.toolClass = (e.target as HTMLInputElement).value;
  };

  /**
   * @method
   * @description Handle filter parameters change.
   * @param {Event} e - The triggering event.
   */
  handleFilterParamChange = (e: Event) => {
    const { name, value } = e.target as HTMLInputElement;
    this.filterParams[name] = value;
  };

  /**
   * @method
   * @description Apply the current filter parameters.
   */
  handleApplyFilter = () => {
    console.log(this.filterParams);
    this.loadData();
    this.isOpenFilter = false;
  };

  /**
   * @method
   * @description Clear all filter parameters.
   */
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

  /**
   * @method
   * @description Handle previous page.
   */
  handlePrevPage = () => {
    if (this.currentPage === 1) return;
    this.currentPage -= 1;
  };

  /**
   * @method
   * @description Handle next page.
   */
  handleNextPage = () => {
    if (this.currentPage === this.pageCount) return;
    this.currentPage += 1;
  };
}
