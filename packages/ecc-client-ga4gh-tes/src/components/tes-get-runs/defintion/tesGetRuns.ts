import {
  FASTElement,
  attr,
  customElement,
  observable,
} from "@microsoft/fast-element";
import { fetchTasks } from "../../../data/index.js";
import template from "./tesGetRuns.template.js";
import styles from "./tesGetRuns.styles.js";

interface Task {
  id: string;
  state: string;
}
@customElement({
  name: "ecc-tes-get-runs",
  template,
  styles,
})
export default class TESGetRuns extends FASTElement {
  // Number of Task to be listed at once
  @attr pageSize = 5;

  @observable nextPageToken = "";

  // Data to be rendered
  @observable data: Task[] = [];

  // Data cache for at max 3 times the pageSize
  @observable cachedData: Task[] = [];

  // First page number of every data cache
  @observable firstPageNumber = 1;

  // Number of pageSize data present in the cache
  @observable pageNumberOffset = 0;

  @observable pageNumberArray: number[] = [];

  // Seach input for name_prefix filter
  @observable searchInput = "";

  @observable stateInput = "ALL";

  @observable unfilterdData: Task[] = [];

  @observable isLoading = true;

  async connectedCallback() {
    super.connectedCallback();
    // Since this is the first call, fetch the first page, no token needed
    await this.fetchData("");
  }

  /**
   *Fetches data of 3*pageSize length and sets it as cache
   * @param token token for the next page for cache data
   */
  fetchData = async (token: string, namePrefix = "") => {
    this.isLoading = true;

    // Reset data
    this.data = [];

    // Next first page number would start after offset of this data
    if (token !== "") this.firstPageNumber += this.pageNumberOffset;

    // Fetch new data
    let newData = [];
    if (namePrefix === "") newData = await fetchTasks(this.pageSize * 3, token);
    else
      newData = await fetchTasks(
        this.pageSize * 3,
        token,
        "MINIMAL",
        namePrefix
      );
    if (newData && newData.tasks) {
      this.cachedData = newData.tasks;
      this.data = this.cachedData.slice(0, this.pageSize);
      this.unfilterdData = this.data;
      this.nextPageToken = newData.next_page_token;
      this.pageNumberOffset = Math.ceil(this.cachedData.length / this.pageSize);
      const array = [];
      for (let i = 0; i < this.pageNumberOffset; i += 1) {
        array.push(i + this.firstPageNumber);
      }
      this.pageNumberArray = array;
    }
    this.isLoading = false;
  };

  // Cache new data
  handleNext = async () => {
    this.fetchData(this.nextPageToken as string, this.searchInput);
  };

  /**
   *This method is fired when user, click to change pages within cache
   * @param pageNumber Page number of pagination
   */
  handleClick = (pageNumber: number): void => {
    const idx: number = pageNumber - this.firstPageNumber;

    const startIndex: number = idx * this.pageSize;
    const endIndex: number = (idx + 1) * this.pageSize;

    this.data = this.cachedData.slice(startIndex, endIndex);

    // Set unfiltered data for state filterinng
    this.unfilterdData = this.data;

    // Reset state filter
    this.stateInput = "ALL";
  };

  handleNameInput(event: Event) {
    this.searchInput = (event.target as HTMLInputElement).value;

    // reset the pages
    this.firstPageNumber = 1;
    this.pageNumberOffset = 0;

    // Fetch new data
    this.fetchData("", this.searchInput);
  }

  handleStateInput(event: Event) {
    this.stateInput = (event.target as HTMLInputElement).value;

    // Filter data on current page based on the filter input
    if (this.stateInput === "ALL") this.data = this.unfilterdData;
    else
      this.data = this.unfilterdData.filter(
        (task) => task.state === this.stateInput
      );
  }
}
