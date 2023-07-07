import { FASTElement, attr, customElement } from "@microsoft/fast-element";
import { template } from "./search.template.js";
import { styles } from "./search.styles.js";
import { IFilterParams } from "./search.interface.js";

@customElement({
  name: "custom-search",
  template,
  styles,
})
export class CustomSearch extends FASTElement {
  @attr
  public searchQuery: string;

  @attr
  public filterParams: IFilterParams;

  @attr
  public toolClasses: unknown[];

  @attr
  public isOpenFilter: boolean;

  @attr
  public ready: boolean;

  @attr
  public onChange: (event: Event) => void;

  handleOpenFilter() {
    this.isOpenFilter = !this.isOpenFilter;
  }

  handleFilterParamChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.filterParams[target.name] = target.value;
  }

  handleSelectToolClass(event: Event) {
    this.filterParams.toolClass = (event.target as HTMLSelectElement).value;
  }

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
