import { FASTElement, attr, customElement, observable } from "@microsoft/fast-element";
import { template } from "./search.template";
import { styles } from "./search.styles";
import { InputField } from "./search.interface";
import { Tool } from "../trs/trs.interface";

@customElement({
  name: 'fast-search',
  template,
  styles,
})

 export class SearchField extends FASTElement {
  @observable searchQuery: string = "";
  @observable showCard: boolean = false;
  @observable inputFields: InputField[] = [
    // your input fields go here
  ];

  @attr onSearch: (searchQuery: string) => void;
  @attr form: Tool;
  @attr setForm: (form: Tool) => void;
  @attr onApply: () => void;

  connectedCallback() {
    super.connectedCallback();
    // initialization logic goes here
  }

  toggleCard() {
    this.showCard = !this.showCard;
  }

  handleInputChange(e: InputEvent) {
    const target = e.target as HTMLInputElement;
    this.setForm({ ...this.form, [target.name]: target.value });
  }

  handleSearchChange(e: InputEvent) {
    const target = e.target as HTMLInputElement;
    this.searchQuery = target.value;
    this.onSearch(target.value);
  }
  }

 