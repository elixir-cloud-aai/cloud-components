import { FASTElement, attr, customElement } from "@microsoft/fast-element";
import { template } from "./search.template.js";
import { styles } from "./search.styles.js";
import { IFilterParams } from "./search.interface.js";

/**
 * A custom search component.
 * @extends FASTElement
 */
@customElement({
  name: "custom-search",
  template,
  styles,
})
export class CustomSearch extends FASTElement {
  /** The query used in the search. */
  @attr
  public searchQuery: string;

  /** The parameters used to filter the search. */
  @attr
  public filterParams: IFilterParams;

  /** The classes of tools used in the search. */
  @attr
  public toolClasses: unknown[];

  /** Boolean flag indicating if the filter is open. */
  @attr
  public isOpenFilter: boolean;

  /** Boolean flag indicating if the search is ready. */
  @attr
  public ready: boolean;

  /** Handler for changes in the search. */
  @attr
  public onChange: (event: Event) => void;

  /**
   * Handles opening and closing of the filter.
   */
  handleOpenFilter() {
    this.isOpenFilter = !this.isOpenFilter;
  }

  /**
   * Handles changes in filter parameters.
   * @param {Event} event - The event triggering this handler.
   */
  handleFilterParamChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.filterParams[target.name] = target.value;
  }

  /**
   * Handles the selection of a tool class.
   * @param {Event} event - The event triggering this handler.
   */
  handleSelectToolClass(event: Event) {
    this.filterParams.toolClass = (event.target as HTMLSelectElement).value;
  }

  /**
   * Clears all filter parameters.
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
}
