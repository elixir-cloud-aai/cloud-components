import { FASTElement, customElement, observable } from "@microsoft/fast-element";
import { template } from "./tabs.template";
import { styles } from "./tabs.styles";
import { Version } from "../trs/trs.interface";

@customElement({
  name: "fast-tabs",
  template,
  styles,
})
export class CustomTabs extends FASTElement {
    @observable versions: Version[] = []; // Use the correct type for Version
}
