import {
  FASTElement,
  attr,
  customElement,
  observable,
} from "@microsoft/fast-element";
import { template } from "./pagination.template";
import { styles } from "./pagination.styles";

@customElement({
  name: "fast-pagination",
  template,
  styles,
})
export class Pagination extends FASTElement {
  @attr public currentPage: number = 1;
  @attr public pageCount: number = 3;

  @observable public pageRange: number[] = [];

  public setCurrentPage(val: number): void {
    this.currentPage = val;
    this.pageRange = this.getPageRange(this.currentPage, this.pageCount);
  }

  public getPageRange(currentPages: number, pageCounts: number): number[] {
    if (pageCounts < 4) {
      return [];
    }
    if (pageCounts === 4) {
      return [1, 2, 3, 4];
    }
    const pageRange = [1, 2, 3];
    if (currentPages > 1 && currentPages !== pageCounts) {
      pageRange.length = 0;
      pageRange.push(currentPages - 1);
      pageRange.push(currentPages);
      pageRange.push(currentPages + 1);
    } else if (currentPages === pageCounts) {
      pageRange.length = 0;
      pageRange.push(currentPages - 2);
      pageRange.push(currentPages - 1);
      pageRange.push(currentPages);
    }
    console.log(pageRange);
    return pageRange;
  }
}
