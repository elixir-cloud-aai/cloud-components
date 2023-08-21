import {
  FASTElement,
  attr,
  customElement,
  observable,
} from "@microsoft/fast-element";
import { template } from "./trs-list.template.js";
import { styles } from "./trs-list.styles.js";
import { FilterFields, Tool, ToolClass } from "./trs-list.types.js";

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

  @observable isVersionEditing = false;

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

  @observable descriptorType = [
    "CWL",
    "WDL",
    "NFL",
    "GALAXY",
    "PLAIN_CWL",
    "PLAIN_WDL",
    "PLAIN_NFL",
    "PLAIN_GALAXY",
  ];

  @observable initialCreateVersionForm = {
    author: [""],
    descriptor_type: ["CWL"],
    files: [
      {
        file_wrapper: {
          checksum: [
            {
              checksum: "ea2a5db69bd20a42976838790bc29294df3af02b",
              type: "sha1",
            },
          ],
          content: "string",
          url: "string",
        },
        tool_file: {
          file_type: "OTHER",
          path: "string",
        },
        type: "CWL",
      },
    ],
    images: [
      {
        checksum: [
          {
            checksum:
              "77af4d6b9913e693e8d0b4b294fa62ade6054e6b2f1ffb617ac955dd63fb0182",
            type: "sha256",
          },
        ],
        image_name: "string",
        image_type: "Docker",
        registry_host: "string",
        size: 0,
        updated: "string",
      },
    ],
    included_apps: [
      "https://bio.tools/tool/mytum.de/SNAP2/1",
      "https://bio.tools/bioexcel_seqqc",
    ],
    is_production: true,
    name: "",
    signed: true,
    verified: true,
    verified_source: ["string"],
  };

  @observable createVersionForm = this.initialCreateVersionForm;

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

  @attr authors: string[] = [""];

  @attr includedApps: string[] = [""];

  @attr verifiedSource: string[] = [""];

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
      this.loadData();
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
    this.authors = inputElement.value.split(",").map((author) => author);
  };

  public handleIncludedAppsChange = (event: Event) => {
    const inputElement = event.target as HTMLInputElement;
    this.includedApps = inputElement.value.split(",").map((app) => app.trim());
  };

  public handleVerifiedSourceChange = (event: Event) => {
    const inputElement = event.target as HTMLInputElement;
    this.verifiedSource = inputElement.value
      .split(",")
      .map((source) => source.trim());
  };

  public handleCheckboxChange = (event: Event) => {
    const inputElement = event.target as HTMLInputElement;
    this.createVersionForm = {
      ...this.createVersionForm,
      [inputElement.name]: inputElement.checked,
    };
  };

  public handleVersionNameChange = (event: Event) => {
    const inputElement = event.target as HTMLInputElement;
    this.createVersionForm = {
      ...this.createVersionForm,
      name: inputElement.value,
    };
  };

  public handleSelectDescriptorType = (event: Event) => {
    const inputElement = event.target as HTMLInputElement;
    this.createVersionForm = {
      ...this.createVersionForm,
      descriptor_type: [inputElement.value],
    };
  };

  public async handleSubmitVersion(toolId: string) {
    this.createVersionForm = {
      ...this.createVersionForm,
      author: this.authors,
      included_apps: this.includedApps,
      verified_source: this.verifiedSource,
    };
    const url = `${this.baseUrl}/tools/${toolId}/versions`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.createVersionForm),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    this.isOpenVersionModal = false;
    this.loadData();
  }

  /**
   * Deletes a tool version.
   * @param toolId The ID of the tool.
   * @param versionId The ID of the version to delete.
   * @returns A promise resolving when the version is deleted.
   */
  public async deleteVersion(toolId: string, versionId: string): Promise<void> {
    console.log(toolId, versionId);
    const url = `${this.baseUrl}/tools/${toolId}/versions/${versionId}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        accept: "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to delete version. Status: ${response.status}`);
    }
    this.loadData();
  }

  public editVersionButton(obj: typeof this.createVersionForm) {
    this.isVersionEditing = true;
    this.createVersionForm = obj;
  }

  public handleEditVersionChange = (event: Event) => {
    const inputElement = event.target as HTMLInputElement;
    if (Array.isArray(this.createVersionForm[inputElement.name])) {
      this.createVersionForm = {
        ...this.createVersionForm,
        [inputElement.name]: inputElement.value
          .split(",")
          .map((item) => item.trim()),
      };
    } else if (typeof this.createVersionForm[inputElement.name] === "boolean") {
      this.createVersionForm = {
        ...this.createVersionForm,
        [inputElement.name]: inputElement.checked,
      };
    } else {
      this.createVersionForm = {
        ...this.createVersionForm,
        [inputElement.name]: inputElement.value,
      };
    }
  };

  public async saveVersionButton(toolId: string, versionId: string) {
    this.isVersionEditing = false;
    const defaultFiles = [
      {
        file_wrapper: {
          checksum: [
            {
              checksum: "ea2a5db69bd20a42976838790bc29294df3af02b",
              type: "sha1",
            },
          ],
          content: "string",
          url: "string",
        },
        tool_file: {
          file_type: "OTHER",
          path: "string",
        },
        type: "CWL",
      },
    ];
    const url = `${this.baseUrl}/tools/${toolId}/versions/${versionId}`;
    const responseBody = {
      author: this.createVersionForm.author,
      descriptor_type: this.createVersionForm.descriptor_type,
      files: defaultFiles,
      images: this.createVersionForm.images,
      included_apps: this.createVersionForm.included_apps,
      is_production: this.createVersionForm.is_production,
      name: this.createVersionForm.name,
      signed: this.createVersionForm.signed,
      verified: this.createVersionForm.verified,
      verified_source: this.createVersionForm.verified_source,
    };
    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(responseBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    this.loadData();
  }
}