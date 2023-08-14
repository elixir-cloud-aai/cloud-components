import {
  FASTElement,
  attr,
  customElement,
  observable,
} from "@microsoft/fast-element";
import { template } from "./trs-list.template.js";
import { styles } from "./trs-list.styles.js";
import { FilterFields, Tool, ToolClass } from "./trs-list.types.js";

export interface AuthorsData {
  authors: string;
}

const authorsTemplate: AuthorsData = {
  authors: "",
};

export interface AppsData {
  apps: string;
}

const appsTemplate: AppsData = {
  apps: "",
};

export interface SourcesData {
  sources: string;
}

const sourcesTemplate: SourcesData = {
  sources: "",
};

/**
 * @class
 * @classdesc TRS Custom Element Class.
 * @extends FASTElement
 */
@customElement({
  name: "trs-list",
  template,
  styles,
  shadowOptions: {
    mode: "open",
  },
})
export class TRSToolsList extends FASTElement {
  @attr public baseUrl = "";

  @observable ready = false;

  @observable tools: (Tool & { isEditing?: boolean; id: string })[] = [];

  @observable limit = 5;

  @observable currentPage = 1;

  @observable pageCount: number;

  @observable searchQuery = "";

  @observable isOpenFilter = false;

  @observable isEditing = false;

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

  @attr public isOpenVersionModal = false;

  @attr authorsInput: string[] = [""];

  @attr appsInput: AppsData[] = [{ ...appsTemplate }];

  @attr sourcesInput: SourcesData[] = [{ ...sourcesTemplate }];

  @observable authorsInputLength = 1;

  public modalButtonClick = () => {
    this.isOpenVersionModal = true;
    if (this.isOpenVersionModal) {
      const trsFiler = document.querySelector("ecc-client-elixir-trs-filer");
      const trsContainer =
        trsFiler?.shadowRoot?.querySelector(".trs-container");
      const tabPanel = trsContainer?.querySelector("fast-tab-panel");
      const trsList = tabPanel?.querySelector("trs-list");
      const fastAccordionContainer =
        trsList?.shadowRoot?.querySelector("fast-accordion");
      const fastAccordionItem = fastAccordionContainer?.querySelectorAll(
        "fast-accordion-item"
      );
      setTimeout(() => {
        fastAccordionItem?.forEach((item) => {
          const modalContainer = item?.querySelector("fast-dialog");
          const modalDiv = modalContainer?.shadowRoot?.querySelector("div");
          modalDiv?.setAttribute("style", "z-index: 80");
          const modalControl = modalDiv?.querySelector(".control");
          modalControl?.setAttribute(
            "style",
            "background-color: #fff; overflow-y: auto;"
          );
        });
      }, 50);
    }
  };

  public closeModal = () => {
    this.isOpenVersionModal = false;
  };

  /**
   * @method
   * @description Load data on element connected.
   * @async
   */
  async connectedCallback() {
    super.connectedCallback();
    this.authorsInputLength = this.authorsInput.length;
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

    this.tools = data.map((tool) => ({
      ...tool,
      delete: () => this.deleteTool(tool.id),
      editTool: () => this.editTool(tool.id),
      saveTool: (updatedTool: Partial<Tool>) => this.saveTool(tool.id),
      isEditing: false,
    })) as Tool[];

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

  /**
   * @method
   * @description Delete a tool by its ID.
   * @async
   * @param {string} toolId - The ID of the tool to delete.
   * @returns {Promise<void>}
   */
  async deleteTool(toolId: string): Promise<void> {
    const url = `${this.baseUrl}/tools/${toolId}`;
    const response = await fetch(url, { method: "DELETE" });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      console.log("Tool deleted");
    }
  }

  async editTool(toolId: string): Promise<void> {
    this.tools = this.tools.map((tool) =>
      tool.id === toolId ? { ...tool, isEditing: true } : tool
    );
  }

  async saveTool(toolId: string): Promise<void> {
    const url = `${this.baseUrl}/tools/${toolId}`;
    const oneTool = this.tools.find((tool) => tool.id === toolId);
    const updatedTool = {
      aliases: oneTool?.aliases ?? [],
      checker_url: oneTool?.checker_url ?? "",
      description: oneTool?.description ?? "",
      has_checker: oneTool?.has_checker ?? false,
      name: oneTool?.name ?? "",
      organization: oneTool?.organization ?? "",
      toolclass: oneTool?.toolclass ?? { description: "", id: "", name: "" },
      versions: oneTool?.versions ?? [],
    };
    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTool),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // update the tool in the list with the updated tool data
    const updatedTools = this.tools.map((tool) =>
      tool.id === toolId ? { ...tool, ...updatedTool, isEditing: false } : tool
    );

    this.tools = updatedTools;

    // can refresh the entire list
    this.loadData();
  }

  public handleInputChangeToolEdit(item: Tool, e: Event) {
    const { name, value } = e.target as HTMLInputElement;
    item[name] = value;
  }

  // for version control -- multiple strings in authors, apps, sources
  public handleInputAuthorsChange = (event: Event) => {
    const inputElement = event.target as HTMLInputElement;
    this.authorsInput = inputElement.value
      .split(",")
      .map((author) => author.trim());
  };

  public handleInputAppsChange = (event: Event, input: AppsData) => {
    const appsInput = (event.target as HTMLInputElement).value;
    input.apps = appsInput;
  };

  public handleInputSourceChange = (input: SourcesData, event: Event) => {
    const sourceInput = (event.target as HTMLInputElement).value;
    input.sources = sourceInput;
  };

  public addAuthor = () => {
    this.authorsInput.push("");
    this.authorsInputLength += 1;
    console.log(this.authorsInput);
  };

  public deleteAuthor = () => {
    if (this.authorsInput.length > 1) {
      this.authorsInput.pop();
      this.authorsInputLength -= 1;
    }
  };
}
