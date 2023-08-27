import {
  attr,
  observable,
  customElement,
  FASTElement,
} from "@microsoft/fast-element";
import { template } from "./ecc-trs-filer.template.js";
import { styles } from "./ecc-trs-filer.styles.js";

@customElement({
  name: "ecc-client-elixir-trs-filer",
  template,
  styles,
  shadowOptions: {
    mode: "open",
  },
})
export class TRSFiler extends FASTElement {
  @attr public baseUrl = "";
  @attr public isOpenModal = false;

  @observable toolClasses: {
    description: string;
    id: string;
    name: string;
  }[] = [];

  @observable createToolForm = {
    aliases: [""],
    checker_url: "",
    description: "",
    has_checker: true,
    name: "",
    organization: "",
    toolclass: {
      description: "string",
      id: "string",
      name: "string",
    },
    versions: [],
  };

  /**
   * Load tool classes from the server
   * @returns {Promise<void>}
   * @async
   */
  async loadToolClasses() {
    const url = `${this.baseUrl}/toolClasses`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      console.log("Error");
    }
    const data = await response.json();
    this.toolClasses = data;
  }

  /**
   * Connected callback
   * @returns {Promise<void>}
   * @async
   */
  async connectedCallback() {
    super.connectedCallback();
    await this.loadToolClasses();
  }

  /**
   * Handle modal button click to create a new tool
   * @returns {void}
   */
  public modalButtonClick = () => {
    this.isOpenModal = true;
    if (this.isOpenModal) {
      const trsFiler = document.querySelector("ecc-client-elixir-trs-filer");
      const trsContainer =
        trsFiler?.shadowRoot?.querySelector(".trs-container");
      const tabPanel = trsContainer?.querySelector("fast-tab-panel");
      setTimeout(() => {
        const modalContainer = tabPanel?.querySelector("fast-dialog");
        const modalDiv = modalContainer?.shadowRoot?.querySelector("div");
        modalDiv?.setAttribute("style", "z-index: 80");
        const modalControl = modalDiv?.querySelector(".control");
        modalControl?.setAttribute(
          "style",
          "background-color: #fff; overflow-y: auto;"
        );
      }, 50);
    }
  };

  /**
   * Handle input change for the create tool form
   * @param e
   * @returns {void}
   */
  public handleCreateToolInputChange = (e: Event) => {
    const { name, value } = e.target as HTMLInputElement;
    this.createToolForm = {
      ...this.createToolForm,
      [name]: value,
    };
  };

  /**
   * Handle checkbox change for the create tool form
   * @param e
   * @returns {void}
   */
  public handleCreateToolChexboxChange = (e: Event) => {
    const { name, checked } = e.target as HTMLInputElement;
    this.createToolForm = {
      ...this.createToolForm,
      [name]: checked,
    };
  };

  /**
   * Handle alias change for the create tool form
   * @param e
   * @returns {void}
   */
  public handleAliasChange = (e: Event) => {
    const { value } = e.target as HTMLInputElement;
    const aliases = value.split("\n").map((alias) => alias.trim());
    this.createToolForm.aliases = aliases;
  };

  /**
   * Handle the work of the selector in the create tool class form
   * @param e
   * @returns {void}
   */
  public handleToolClassSelect = (e: Event) => {
    const inputElement = e.target as HTMLInputElement;
    const toolClass = this.toolClasses.find(
      (toolClass) => toolClass.id === inputElement.value
    );
    this.createToolForm.toolclass = toolClass || {
      description: "",
      id: "",
      name: "",
    };
  };

  /**
   * Close modal for creating a tool.
   * @returns {void}
   */
  public closeModal = () => {
    this.isOpenModal = false;
  };

  /**
   * Handle create tool submit. Send a POST request to the server.
   * @returns {Promise<void>}
   * @async
   */
  public async handleCreateToolSubmit() {
    const url = `${this.baseUrl}/tools`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.createToolForm),
    });
    if (!response.ok) {
      console.log("Error");
    }
    this.closeModal();
  }
}
