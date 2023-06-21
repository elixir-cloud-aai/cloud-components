import {
  FASTElement,
  attr,
  customElement,
  observable,
} from '@microsoft/fast-element';
import { fetchTasks } from '../../../data/index.js';
import template from './tesGetRuns.template.js';
import styles from './tesGetRuns.styles.js';

interface Task {
  id: string;
  state: string;
}
@customElement({
  name: 'ecc-tes-get-runs',
  template,
  styles,
})
export default class TESGetRuns extends FASTElement {
  // Number of Task to be listed at once
  @attr pageSize = 5;

  @observable nextPageToken = '';

  @observable prevPageTokenStack = [];

  // Data to be rendered
  @observable data: Task[] = [];

  // First page number of every data cache
  @observable pageNumber = 1;

  // Seach input for name_prefix filter
  @observable searchInput = '';

  @observable stateInput = 'ALL';

  @observable unfilterdData: Task[] = [];

  @observable isLoading = true;

  async connectedCallback() {
    super.connectedCallback();
    // Since this is the first call, fetch the first page, no token needed
    await this.fetchData('');
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
    newData = await fetchTasks(this.pageSize, token, 'MINIMAL', namePrefix);
    if (newData && newData.tasks) {
      this.data = newData.tasks;
      this.unfilterdData = this.data;
      this.nextPageToken = newData.next_page_token;
    }
    this.isLoading = false;
  };

  // Cache next click
  handleNext = async () => {
    this.stateInput = 'ALL';
    this.pageNumber += 1;
    this.fetchData(this.nextPageToken as string, this.searchInput);
  };

  // // Handle prev click
  // handlePrev = async () => {
  //   // TODO : Implement prev click
  // };

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
    if (this.stateInput === 'ALL') this.data = this.unfilterdData;
    else {
      this.data = this.unfilterdData.filter(
        task => task.state === this.stateInput,
      );
    }
  }
}
