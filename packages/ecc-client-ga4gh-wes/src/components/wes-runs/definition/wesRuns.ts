import {
  FASTElement,
  attr,
  customElement,
  observable,
} from '@microsoft/fast-element';
import template from './wesRuns.template.js';
import styles from './wesRuns.styles.js';
import ApiResponse, { Run } from './types.js';
import { fetchWorkflows } from '../../../data/index.js';

@customElement({
  name: 'ecc-client-ga4gh-wes-runs',
  template,
  styles,
})
export default class WESRuns extends FASTElement {
  // Base URL, provided by app author
  @attr baseURL = '';

  // Number of Run to be listed at once
  @attr pageSize = 5;

  @observable tokens: { [page: number]: string } = {};

  // Data to be rendered
  @observable data: Run[] = [];

  // First page number of every data cache
  @observable pageNumber = 1;

  // Seach input for name_prefix filter
  @observable searchInput = '';

  @observable stateInput = 'ALL';

  @observable unfilterdData: ApiResponse = {
    runs: [],
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
  fetchData = async (token: string) => {
    this.isLoading = true;

    // Reset data
    this.data = [];

    // Fetch new data
    let newData = [];
    newData = await fetchWorkflows(this.baseURL, this.pageSize, token);
    if (newData && newData.runs) {
      this.data = newData.runs;
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
    await this.fetchData(pageToken as string);

    // Hash the token for next of the next page
    this.tokens[nextPageNumber + 1] = this.unfilterdData.next_page_token;
  };

  // Handle prev click
  handlePrev = async () => {
    this.stateInput = 'ALL';
    const prevPageNumber = this.pageNumber - 1;
    const prevPageToken = this.tokens[prevPageNumber];
    await this.fetchData(prevPageToken);
    this.pageNumber -= 1;
  };

  handleStateInput(event: Event) {
    this.stateInput = (event.target as HTMLInputElement).value;

    // Filter data on current page based on the filter input
    if (this.stateInput === 'ALL') this.data = this.unfilterdData.runs;
    else {
      this.data = this.unfilterdData.runs.filter(
        (run) => run.state === this.stateInput
      );
    }
  }
}
