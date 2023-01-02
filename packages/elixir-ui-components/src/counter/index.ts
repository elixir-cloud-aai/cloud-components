import { FoundationElement } from "@microsoft/fast-foundation";
import { attr } from "@microsoft/fast-element";

export class Counter extends FoundationElement {
  @attr count = 0;

  increment() {
    this.count++;
  }
}
