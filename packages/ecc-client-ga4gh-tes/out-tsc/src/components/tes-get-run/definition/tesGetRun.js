import { __decorate } from "tslib";
import { FASTElement, attr, customElement, observable, } from "@microsoft/fast-element";
import template from "./tesGetRun.template.js";
import styles from "./tesGetRun.styles.js";
import { fetchTask } from "../../../data/index.js";
import { deleteTask } from "../../../data/Post/tesPost.js";
let TESGetRun = class TESGetRun extends FASTElement {
    constructor() {
        super(...arguments);
        this.id = "";
        this.state = "";
        this.isLoading = true;
        this.data = {
            id: this.id,
            state: this.state,
            name: "",
            description: "",
            creation_time: "",
            executors: [],
            logs: [],
        };
        // Handles deletion of this task
        this.handleDelete = async () => {
            await deleteTask(this.id);
        };
        // Fetched the task with this ID
        this.handleFetch = async () => {
            // Only fetch the data if not already fetched
            if (this.isLoading) {
                this.data = await fetchTask(this.id);
                this.isLoading = false;
            }
        };
    }
    connectedCallback() {
        var _a;
        super.connectedCallback();
        // Add event listener to handle accordion open event
        this.addEventListener("change", this.handleFetch);
        const delButton = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("fast-button");
        if (!this.isLoading && delButton) {
            // delButton.addEventListener("click", this.handleDelete);
            delButton.addEventListener("click", this.handleDelete.bind(this));
        }
    }
    disconnectedCallback() {
        var _a;
        super.disconnectedCallback();
        this.removeEventListener("change", this.handleFetch);
        const delButton = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("fast-button");
        if (!this.isLoading && delButton) {
            delButton.addEventListener("click", this.handleDelete.bind(this));
        }
    }
};
__decorate([
    attr
], TESGetRun.prototype, "id", void 0);
__decorate([
    attr
], TESGetRun.prototype, "state", void 0);
__decorate([
    observable
], TESGetRun.prototype, "isLoading", void 0);
__decorate([
    observable
], TESGetRun.prototype, "data", void 0);
TESGetRun = __decorate([
    customElement({
        name: "ecc-tes-get-run",
        template,
        styles,
        shadowOptions: { mode: "open" },
    })
], TESGetRun);
export default TESGetRun;
//# sourceMappingURL=tesGetRun.js.map