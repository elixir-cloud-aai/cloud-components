import { __decorate } from "tslib";
import { FASTElement, attr, customElement, observable, } from "@microsoft/fast-element";
import { fetchTasks } from "../../../data/index.js";
import template from "./tesGetRuns.template.js";
import styles from "./tesGetRuns.styles.js";
let TESGetRuns = class TESGetRuns extends FASTElement {
    constructor() {
        super(...arguments);
        // Number of Task to be listed at once
        this.pageSize = 5;
        this.nextPageToken = null;
        // Data to be rendered
        this.data = [];
        // Data cache for at max 3 times the pageSize
        this.cachedData = [];
        // First page number of every data cache
        this.firstPageNumber = 1;
        // Number of pageSize data present in the cache
        this.pageNumberOffset = 0;
        this.pageNumberArray = [];
        // Seach input for name_prefix filter
        this.searchInput = "";
        this.stateInput = "ALL";
        this.unfilterdData = [];
        this.isLoading = true;
        /**
         *Fetches data of 3*pageSize length and sets it as cache
         * @param token token for the next page for cache data
         */
        this.fetchData = async (token, namePrefix = null) => {
            this.isLoading = true;
            // Reset data
            this.data = [];
            // Next first page number would start after offset of this data
            if (token !== "")
                this.firstPageNumber += this.pageNumberOffset;
            // Fetch new data
            let newData = [];
            if (!namePrefix)
                newData = await fetchTasks(this.pageSize * 3, token);
            else
                newData = await fetchTasks(this.pageSize * 3, token, "MINIMAL", namePrefix);
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
        this.handleNext = async () => {
            if (this.searchInput !== "") {
                await this.fetchData(this.nextPageToken, this.searchInput);
            }
            else
                await this.fetchData(this.nextPageToken, this.searchInput);
        };
        /**
         *This method is fired when user, click to change pages within cache
         * @param pageNumber Page number of pagination
         */
        this.handleClick = (pageNumber) => {
            const idx = pageNumber - this.firstPageNumber;
            const startIndex = idx * this.pageSize;
            const endIndex = (idx + 1) * this.pageSize;
            this.data = this.cachedData.slice(startIndex, endIndex);
            // Set unfiltered data for state filterinng
            this.unfilterdData = this.data;
            // Reset state filter
            this.stateInput = "ALL";
        };
    }
    async connectedCallback() {
        super.connectedCallback();
        // Since this is the first call, fetch the first page, no token needed
        await this.fetchData("");
    }
    handleNameInput(event) {
        this.searchInput = event.target.value;
        // reset the pages
        this.firstPageNumber = 1;
        this.pageNumberOffset = 0;
        // Fetch new data
        this.fetchData("", this.searchInput);
    }
    handleStateInput(event) {
        this.stateInput = event.target.value;
        // Filter data on current page based on the filter input
        if (this.stateInput === "ALL")
            this.data = this.unfilterdData;
        else
            this.data = this.unfilterdData.filter((task) => task.state === this.stateInput);
    }
};
__decorate([
    attr
], TESGetRuns.prototype, "pageSize", void 0);
__decorate([
    observable
], TESGetRuns.prototype, "nextPageToken", void 0);
__decorate([
    observable
], TESGetRuns.prototype, "data", void 0);
__decorate([
    observable
], TESGetRuns.prototype, "cachedData", void 0);
__decorate([
    observable
], TESGetRuns.prototype, "firstPageNumber", void 0);
__decorate([
    observable
], TESGetRuns.prototype, "pageNumberOffset", void 0);
__decorate([
    observable
], TESGetRuns.prototype, "pageNumberArray", void 0);
__decorate([
    observable
], TESGetRuns.prototype, "searchInput", void 0);
__decorate([
    observable
], TESGetRuns.prototype, "stateInput", void 0);
__decorate([
    observable
], TESGetRuns.prototype, "unfilterdData", void 0);
__decorate([
    observable
], TESGetRuns.prototype, "isLoading", void 0);
TESGetRuns = __decorate([
    customElement({
        name: "ecc-tes-get-runs",
        template,
        styles,
    })
], TESGetRuns);
export default TESGetRuns;
//# sourceMappingURL=tesGetRuns.js.map