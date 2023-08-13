import { __decorate } from "tslib";
import { FASTElement, attr, customElement, observable, } from '@microsoft/fast-element';
import template from './wesRuns.template.js';
import styles from './wesRuns.styles.js';
import { fetchWorkflows } from '../../../data/index.js';
let WESRuns = class WESRuns extends FASTElement {
    constructor() {
        super(...arguments);
        // Base URL, provided by app author
        this.baseURL = '';
        // Number of Run to be listed at once
        this.pageSize = 5;
        this.tokens = {};
        // Data to be rendered
        this.data = [];
        // First page number of every data cache
        this.pageNumber = 1;
        // Seach input for name_prefix filter
        this.searchInput = '';
        this.stateInput = 'ALL';
        this.unfilterdData = {
            runs: [],
            next_page_token: '',
        };
        this.isLoading = true;
        /**
         *Fetches data of pageSize length
         * @param token token for the next page for cache data
         * @param namePrefix takes in the filter value for name prefix
         */
        this.fetchData = async (token) => {
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
        this.handleNext = async () => {
            // Reset the state filter
            this.stateInput = 'ALL';
            // Calculate the next page
            const nextPageNumber = this.pageNumber + 1;
            this.pageNumber = nextPageNumber; // Increment the pageNumber
            // Get the next page token
            const pageToken = this.tokens[this.pageNumber];
            // Call the fetchData method with the nextPageToken and searchInput
            await this.fetchData(pageToken);
            // Hash the token for next of the next page
            this.tokens[nextPageNumber + 1] = this.unfilterdData.next_page_token;
        };
        // Handle prev click
        this.handlePrev = async () => {
            this.stateInput = 'ALL';
            const prevPageNumber = this.pageNumber - 1;
            const prevPageToken = this.tokens[prevPageNumber];
            await this.fetchData(prevPageToken);
            this.pageNumber -= 1;
        };
    }
    async connectedCallback() {
        super.connectedCallback();
        // Since this is the first call, fetch the first page, no token needed
        await this.fetchData('');
        this.tokens[1] = '';
        this.tokens[2] = this.unfilterdData.next_page_token;
    }
    handleStateInput(event) {
        this.stateInput = event.target.value;
        // Filter data on current page based on the filter input
        if (this.stateInput === 'ALL')
            this.data = this.unfilterdData.runs;
        else {
            this.data = this.unfilterdData.runs.filter((run) => run.state === this.stateInput);
        }
    }
};
__decorate([
    attr
], WESRuns.prototype, "baseURL", void 0);
__decorate([
    attr
], WESRuns.prototype, "pageSize", void 0);
__decorate([
    observable
], WESRuns.prototype, "tokens", void 0);
__decorate([
    observable
], WESRuns.prototype, "data", void 0);
__decorate([
    observable
], WESRuns.prototype, "pageNumber", void 0);
__decorate([
    observable
], WESRuns.prototype, "searchInput", void 0);
__decorate([
    observable
], WESRuns.prototype, "stateInput", void 0);
__decorate([
    observable
], WESRuns.prototype, "unfilterdData", void 0);
__decorate([
    observable
], WESRuns.prototype, "isLoading", void 0);
WESRuns = __decorate([
    customElement({
        name: 'ecc-client-ga4gh-wes-runs',
        template,
        styles,
    })
], WESRuns);
export default WESRuns;
//# sourceMappingURL=wesRuns.js.map