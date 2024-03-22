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

  @observable descriptorType = ["CWL", "WDL", "NFL", "GALAXY"];

  @observable defaultFiles = [
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

  @observable initialCreateVersionForm = {
    author: [""],
    descriptor_type: ["CWL"],
    files: this.defaultFiles,
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

  public cancelToolButton() {
    this.isEditing = false;
  }

  public modalButtonClick = () => {
    this.createVersionForm = this.initialCreateVersionForm;
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
   * @description Load tools from the backend.
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
      saveTool: (x: Tool) => this.saveTool(x),
      isEditing: false,
    })) as Tool[];

    this.pageCount = Math.ceil(this.tools.length / this.limit);
    this.ready = true;
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

  /**
   * @method
   * @description Edit a tool by its ID.
   * @async
   * @param {string} toolId - The ID of the tool to edit.
   * @returns {Promise<void>}
   */
  async editTool(toolId: string): Promise<void> {
    console.log(this.tools[0]);
    this.tools = this.tools.map((tool) =>
      tool.id === toolId ? { ...tool, isEditing: true } : tool
    );
  }

  /**
   * @method
   * @description Save a tool after editing.
   * @async
   * @param {Tool} tool - The tool to save.
   * @returns {Promise<void>}
   */
  async saveTool(tool: Tool): Promise<void> {
    const toolId = tool.id;
    const updatedTool = {
      aliases: tool.aliases,
      checker_url: tool.checker_url,
      description: tool.description,
      has_checker: tool.has_checker,
      name: tool.name,
      organization: tool.organization,
      toolclass: tool.toolclass,
      versions: tool.versions.map((v) => ({
        author: v.author,
        descriptor_type: v.descriptor_type,
        files: this.defaultFiles,
        id: v.id,
        images: v.images,
        included_apps: v.included_apps,
        is_production: v.is_production,
        name: v.name,
        signed: v.signed,
        verified: v.verified,
        verified_source: v.verified_source,
      })),
    };
    const url = `${this.baseUrl}/tools/${toolId}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTool),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // update the tool in the list with the updated tool data
    // const updatedTools = this.tools.map((tool) =>
    //   tool.id === toolId ? { ...tool, ...updatedTool, isEditing: false } : tool
    // );
    // this.tools = updatedTools;
    const updatedTools = this.tools.map((tool) =>
      tool.id === toolId
        ? ({ ...tool, ...updatedTool, isEditing: false } as unknown as Tool & {
            isEditing?: boolean;
            id: string;
          })
        : tool
    );
    this.tools = updatedTools;
    // can refresh the entire list
    this.loadData();
  }

  /**
   * @method
   * @description Handle input change for tool edit.
   * @param {Tool} item - The tool to edit.
   * @param {Event} e - The triggering event.
   * @returns {void}
   */
  public handleInputChangeToolEdit(item: Tool, e: Event) {
    const { name, value } = e.target as HTMLInputElement;
    if (name === "toolclass") {
      const selectedToolClass = this.toolClasses.find(
        (toolClass) => toolClass.id === value
      );
      item.toolclass = selectedToolClass || {
        description: "",
        id: "",
        name: "",
      };
    } else {
      item[name] = value;
    }
  }

  /**
   * @method
   * @description Handle input change for authors while creating a version.
   * @param {Event} event - The triggering event.
   * @returns {void}
   */

  public handleInputAuthorsChange = (event: Event) => {
    const inputElement = event.target as HTMLInputElement;
    this.createVersionForm.author = inputElement.value
      .split(",")
      .map((author) => author);
  };

  /**
   * @method
   * @description Handle input change for included apps while creating a version.
   * @param {Event} event - The triggering event.
   * @returns {void}
   */
  public handleIncludedAppsChange = (event: Event) => {
    const inputElement = event.target as HTMLInputElement;
    this.createVersionForm.included_apps = inputElement.value
      .split(",")
      .map((app) => app.trim());
  };

  /**
   * @method
   * @description Handle input change for verified sources while creating a version.
   * @param {Event} event - The triggering event.
   * @returns {void}
   */
  public handleVerifiedSourceChange = (event: Event) => {
    const inputElement = event.target as HTMLInputElement;
    this.createVersionForm.verified_source = inputElement.value
      .split(",")
      .map((source) => source.trim());
  };

  /**
   * @method
   * @description Handle input change for checkbox while creating a version.
   * @param {Event} event - The triggering event.
   * @returns {void}
   */
  public handleCheckboxChange = (event: Event) => {
    const inputElement = event.target as HTMLInputElement;
    this.createVersionForm = {
      ...this.createVersionForm,
      [inputElement.name]: inputElement.checked,
    };
  };

  /**
   * @method
   * @description Handle input change for version name while creating a version.
   * @param {Event} event - The triggering event.
   * @returns {void}
   */
  public handleVersionNameChange = (event: Event) => {
    const inputElement = event.target as HTMLInputElement;
    this.createVersionForm = {
      ...this.createVersionForm,
      name: inputElement.value,
    };
  };

  /**
   * @method
   * @description Handle input change for descriptor type while creating a version.
   * @param {Event} event - The triggering event.
   * @returns {void}
   */
  public handleSelectDescriptorType = (event: Event) => {
    const inputElement = event.target as HTMLInputElement;
    this.createVersionForm = {
      ...this.createVersionForm,
      descriptor_type: [inputElement.value],
    };
  };

  /**
   * @method
   * @description Handle submit button while creating a version.
   * @param {Event} event - The triggering event.
   * @returns {void}
   */
  public async handleSubmitVersion(toolId: string) {
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
    this.createVersionForm = this.initialCreateVersionForm;
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

  /**
   * Edits a tool version.
   * @param toolId The ID of the tool.
   * @param versionId The ID of the version to edit.
   * @returns A promise resolving when the version is edited.
   * @async
   */
  public editVersionButton(obj: typeof this.createVersionForm) {
    this.isVersionEditing = true;
    this.createVersionForm = obj;
  }

  /**
   * @method
   * @description Handle input change while editing a version.
   * @param {Event} event - The triggering event.
   * @returns {void}
   * @async
   */
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

  /**
   * @method
   * @description Save a tool version after editing.
   * @async
   * @param {string} toolId - The ID of the tool.
   * @param {string} versionId - The ID of the version to save.
   * @returns {Promise<void>}
   */
  public async saveVersionButton(toolId: string, versionId: string) {
    this.isVersionEditing = false;

    const url = `${this.baseUrl}/tools/${toolId}/versions/${versionId}`;
    const responseBody = {
      author: this.createVersionForm.author,
      descriptor_type: this.createVersionForm.descriptor_type,
      files: this.defaultFiles,
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

  public cancelVersionButton() {
    this.isVersionEditing = false;
  }
}
