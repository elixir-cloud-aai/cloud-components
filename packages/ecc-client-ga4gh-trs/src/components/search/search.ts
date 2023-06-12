import { FASTElement, attr, customElement, observable } from "@microsoft/fast-element";
import React from "react";
import { provideReactWrapper } from "@microsoft/fast-react-wrapper";
import template from "./Search.template";
import styles from "./Search.styles";


@customElement({
  name: "fast-search",
  template: template,
  styles: styles,
})
class _Search extends FASTElement {
  @attr
  public title: string = "Search";

  @attr
  public content: string = "Content";

  @observable
  public filterActive: boolean = false;

  @observable
  public searchQuery: string = "";

  public filterToggle() {
    this.filterActive = !this.filterActive;
  }

  public handleSearch(e) {
    // this.searchQuery = e.target.value;
    // console.log("Search Query: ", this.searchQuery);
    // // Here you can implement your live search logic
  }
}

export const Search = provideReactWrapper(React).wrap(_Search);
