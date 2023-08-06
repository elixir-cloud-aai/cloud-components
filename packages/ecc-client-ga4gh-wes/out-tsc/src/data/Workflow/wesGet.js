/**
 *Fetches workflows based on the specified parameters.
 * @param baseURL - The base URL for fetching workflows
 * @param pageSize - OPTIONAL The preferred number of workflow runs to return in a page
 * @param nextPageToken - OPTIONAL Token to use to indicate where to start getting results.
 * @returns Promise if fullfilled an array of workflows
 */
const fetchWorkflows = async (baseURL, pageSize = 5, nextPageToken = '') => {
    let url = `${baseURL}/runs?`;
    // Append pageSize parameter if provided
    if (pageSize) {
        url += `page_size=${pageSize}&`;
    }
    // Append nextPageToken parameter if provided
    if (nextPageToken.length > 0) {
        url += `page_token=${nextPageToken}&`;
    }
    try {
        const response = await fetch(url);
        if (!response) {
            return {
                isError: true,
                breakpoint: 'fetchWorkflows',
                error: 'No response from server',
            };
        }
        return await response.json();
    }
    catch (error) {
        return {
            isError: true,
            breakpoint: 'fetchWorkflows',
            error,
        };
    }
};
/**
 * Fetches full view of workflow with the specified ID
 * @param {string} [baseURL] - Base URL for fetching workflows
 * @param {string} [id] - ID of the specific workflow
 */
const fetchWorkflow = async (baseURL, id) => {
    const url = `${baseURL}/runs/${id}`;
    try {
        const response = await fetch(url);
        if (!response) {
            return {
                isError: true,
                breakpoint: 'fetchWorkflow',
                error: 'No response from server',
            };
        }
        return await response.json();
    }
    catch (error) {
        return {
            isError: true,
            breakpoint: 'fetchWorkflow',
            error,
        };
    }
};
/**
 *This mathod cancel a specific workflow
 * @param id ID of the workflow to be deleted
 */
const cancelWorkflow = async (baseURL, id) => {
    const url = `${baseURL}/runs/${id}/cancel`;
    try {
        const response = await fetch(url, {
            method: 'DELETE',
        });
        return response;
    }
    catch (error) {
        return {
            isError: true,
            breakpoint: 'cancelWorkflow',
            error,
        };
    }
};
export { fetchWorkflows, fetchWorkflow, cancelWorkflow };
//# sourceMappingURL=wesGet.js.map