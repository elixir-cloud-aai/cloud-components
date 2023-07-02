import {
  FASTElement,
  attr,
  customElement,
  observable,
} from '@microsoft/fast-element';
import { fetchTasks } from '../../../data/index.js';
import template from './tesRuns.template.js';
import styles from './tesRuns.styles.js';

interface Task {
  id: string;
  state: string;
}

interface Data {
  tasks: Task[];
  next_page_token: string;
}

@customElement({
  name: 'ecc-client-ga4gh-tes-runs',
  template,
  styles,
})
export default class TESRuns extends FASTElement {
  // Base URL, provided by app author
  @attr baseURL = '';

  // Number of Task to be listed at once
  @attr pageSize = 5;

  @observable tokens: { [page: number]: string } = {};

  // Data to be rendered
  @observable data: Task[] = [];

  // First page number of every data cache
  @observable pageNumber = 1;

  // Seach input for name_prefix filter
  @observable searchInput = '';

  @observable stateInput = 'ALL';

  @observable unfilterdData: Data = {
    tasks: [],
    next_page_token: '',
  };

  @observable isLoading = true;

  async connectedCallback() {
    super.connectedCallback();
    // Since this is the first call, fetch the first page, no token needed
    await this.fetchData('');
    this.tokens[1] = '';
    this.tokens[2] = this.unfilterdData.next_page_token;
  }

  /**
   *Fetches data of pageSize length
   * @param token token for the next page for cache data
   * @param namePrefix takes in the filter value for name prefix
   */
  fetchData = async (token: string, namePrefix = '') => {
    this.isLoading = true;

    // Reset data
    this.data = [];

    // Fetch new data
    let newData = [];
    newData = await fetchTasks(
      this.baseURL,
      this.pageSize,
      token,
      'MINIMAL',
      namePrefix
    );
    if (newData && newData.tasks) {
      this.data = newData.tasks;
      this.unfilterdData = newData;
    }
    this.isLoading = false;
  };

  // Cache next click
  handleNext = async () => {
    // Reset the state filter
    this.stateInput = 'ALL';

    // Calculate the next page
    const nextPageNumber = this.pageNumber + 1;
    this.pageNumber = nextPageNumber; // Increment the pageNumber

    // Get the next page token
    const pageToken = this.tokens[this.pageNumber];

    // Call the fetchData method with the nextPageToken and searchInput
    await this.fetchData(pageToken as string, this.searchInput);

    // Hash the token for next of the next page
    this.tokens[nextPageNumber + 1] = this.unfilterdData.next_page_token;
  };

  // Handle prev click
  handlePrev = async () => {
    this.stateInput = 'ALL';
    const prevPageNumber = this.pageNumber - 1;
    const prevPageToken = this.tokens[prevPageNumber];
    await this.fetchData(prevPageToken, this.searchInput);
    this.pageNumber -= 1;
  };

  handleNameInput(event: Event) {
    this.searchInput = (event.target as HTMLInputElement).value;

    // reset the pages
    this.pageNumber = 1;

    // Fetch new data
    this.fetchData('', this.searchInput);
  }

  handleStateInput(event: Event) {
    this.stateInput = (event.target as HTMLInputElement).value;

    // Filter data on current page based on the filter input
    if (this.stateInput === 'ALL') this.data = this.unfilterdData.tasks;
    else {
      this.data = this.unfilterdData.tasks.filter(
        (task) => task.state === this.stateInput
      );
    }
  }
}
