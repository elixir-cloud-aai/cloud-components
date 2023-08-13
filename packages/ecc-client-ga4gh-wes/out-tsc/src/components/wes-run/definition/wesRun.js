import { __decorate } from "tslib";
import { FASTElement, customElement, attr, observable, } from '@microsoft/fast-element';
import template from './wesRun.template.js';
import styles from './wesRun.styles.js';
import { cancelWorkflow, fetchWorkflow } from '../../../data/index.js';
let WESRun = class WESRun extends FASTElement {
    constructor() {
        super(...arguments);
        this.baseURL = '';
        this.id = '';
        this.state = '';
        this.admin = false;
        this.isLoading = true;
        this.data = {};
        this.delResponse = {};
        // Handles deletion of this workflow
        this.handleDelete = async () => {
            // Delete if baseURL is privided
            if (this.baseURL.length !== 0) {
                await cancelWorkflow(this.baseURL, this.id);
                this.isLoading = true;
                this.delResponse = await this.handleFetch();
                this.isLoading = false;
            }
        };
        // Fetched the workflow with this ID
        this.handleFetch = async () => {
            this.isLoading = true;
            // Only fetch the data if not already fetched and base URL is provided
            if (this.isLoading && this.baseURL.length !== 0) {
                this.data = await fetchWorkflow(this.baseURL, this.id);
                this.isLoading = false;
            }
        };
    }
    connectedCallback() {
        super.connectedCallback();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
    }
};
__decorate([
    attr
], WESRun.prototype, "baseURL", void 0);
__decorate([
    attr
], WESRun.prototype, "id", void 0);
__decorate([
    attr
], WESRun.prototype, "state", void 0);
__decorate([
    attr
], WESRun.prototype, "admin", void 0);
__decorate([
    observable
], WESRun.prototype, "isLoading", void 0);
__decorate([
    observable
], WESRun.prototype, "data", void 0);
__decorate([
    observable
], WESRun.prototype, "delResponse", void 0);
WESRun = __decorate([
    customElement({
        name: 'ecc-client-ga4gh-wes-run',
        template,
        styles,
    })
], WESRun);
export default WESRun;
//# sourceMappingURL=wesRun.js.map