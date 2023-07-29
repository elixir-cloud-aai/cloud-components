import {
  FASTElement,
  attr,
  customElement,
  observable,
} from "@microsoft/fast-element";
import { template } from "./trs-list.template.js";
import { styles } from "./trs-list.styles.js";
import { FilterFields, ToolClass } from "./trs-list.types.js";

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

  @observable toolClasses: ToolClass[] = [];

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

  @observable filterFields: FilterFields[] = [
    {
      key: "id",
      name: "Tool Id",
      textFieldName: "id",
      tooltipText:
        "A unique identifier of the tool, scoped to this registry, for example 123456.",
    },
    {
      key: "alias",
      name: "Alias",
      textFieldName: "alias",
      tooltipText:
        "Support for this parameter is optional for tool registries that support aliases. If provided will only return entries with the given alias.",
    },
    {
      key: "toolClass",
      name: "Registry",
      textFieldName: "registry",
      tooltipText:
        "If provided will only return entries from the specific registry.",
    },
    {
      key: "organization",
      name: "Organization",
      textFieldName: "organization",
      tooltipText:
        "If provided will only return entries from the specific organization.",
    },
    {
      key: "name",
      name: "Name",
      textFieldName: "name",
      tooltipText:
        "The name of the tool, without reference to any particular version. If provided will only return entries with the given name.",
    },
    {
      key: "toolClass",
      name: "Toolclass",
      textFieldName: "toolclass",
      tooltipText:
        "If provided will only return entries of the specific tool class.",
    },
    {
      key: "author",
      name: "Checker",
      textFieldName: "checker",
      tooltipText:
        "If true only checker workflows will be returned, if false only non-checker workflows will be returned. If not present both checker and non-checker workflows will be returned.",
    },
  ];

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
