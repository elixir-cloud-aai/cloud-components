import { __decorate } from "tslib";
import { FASTElement, attr, customElement, observable, } from '@microsoft/fast-element';
import template from './wesCreateRun.template.js';
import styles from './wesCreateRun.styles.js';
import { postWorkflow } from '../../../data/Workflow/wesGet.js';
let WESCreateRun = class WESCreateRun extends FASTElement {
    constructor() {
        super(...arguments);
        // Base URL, provided by app author
        this.baseURL = '';
        this.data = new FormData();
        this.response = {};
        this.handleInput = (event) => {
            const input = event.target;
            const { name } = input;
            // If it's a file input, append each file to the FormData
            if (input.type === 'file') {
                for (const file of input.files) {
                    // Check if the key exists in the FormData, and if so, delete it before appending the updated value
                    if (this.data.has(name)) {
                        this.data.delete(name);
                    }
                    this.data.append(name, file);
                }
            }
            else {
                // Check if the key exists in the FormData, and if so, delete it before appending the updated value
                if (this.data.has(name)) {
                    this.data.delete(name);
                }
                this.data.append(name, input.value);
            }
        };
        this.handleSubmit = async () => {
            const response = await postWorkflow(this.baseURL, this.data);
            this.response = response;
        };
    }
};
__decorate([
    attr
], WESCreateRun.prototype, "baseURL", void 0);
__decorate([
    observable
], WESCreateRun.prototype, "data", void 0);
__decorate([
    observable
], WESCreateRun.prototype, "response", void 0);
WESCreateRun = __decorate([
    customElement({
        name: 'ecc-client-ga4gh-wes-create-run',
        template,
        styles,
    })
], WESCreateRun);
export default WESCreateRun;
//# sourceMappingURL=wesCreateRun.js.map