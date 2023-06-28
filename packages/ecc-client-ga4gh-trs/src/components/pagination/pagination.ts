import {
    FASTElement,
    attr,
    customElement,
    observable,
  } from "@microsoft/fast-element";
  import { template } from "./pagination.template";
  import { styles } from "./pagination.styles";
  
  @customElement({
    name: "custom-pagination",
    template,
    styles,
  })
  export class CustomPagination extends FASTElement {
  @attr pageSize: number;
  @attr current: number;
  @attr total: number;

  @observable pages: number[] = [];
  @observable gotoPage: number | null = null;

  get totalPages(): number {
    return Math.ceil(this.total / this.pageSize);
  }

  connectedCallback() {
    super.connectedCallback();
    this.calculatePages();
  }

  calculatePages() {
    const totalPages = this.totalPages;
    this.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  changePage(page: number) {
    this.$emit('change', { detail: { page } });
    this.current = page;
  }

  prevPage() {
    if (this.current > 1) {
      this.changePage(this.current - 1);
    }
  }

  nextPage() {
    if (this.current < this.totalPages) {
      this.changePage(this.current + 1);
    }
  }

  goToPage() {
    if (this.gotoPage !== null && this.gotoPage >= 1 && this.gotoPage <= this.totalPages) {
      this.changePage(this.gotoPage);
    }
    this.gotoPage = null;
  }
  public isCurrentPage(page: number): boolean {
    return this.current === page;
  }
}

