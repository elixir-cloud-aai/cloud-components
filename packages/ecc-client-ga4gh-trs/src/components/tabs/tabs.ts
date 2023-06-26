import { FASTElement, customElement, observable } from "@microsoft/fast-element";
import { template } from "./tabs.template";
import { styles } from "./tabs.styles";

@customElement({
  name: "custom-tabs",
  template,
  styles,
})
export class CustomTabs extends FASTElement {
    // @observable versions: Version[] = []; // Use the correct type for Version
}
