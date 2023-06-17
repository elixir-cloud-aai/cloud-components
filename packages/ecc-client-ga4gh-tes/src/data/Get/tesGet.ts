import { getTasksURL } from "../baseURL.js";

/**
 * Fetches tasks based on the specified parameters.
 *
 * @param {number} [pageSize] - OPTIONAL. Number of tasks to return in one page. Must be less than 2048. Defaults to 256.
 * @param {string} [nextPageToken] - OPTIONAL. Page token used to retrieve the next page of results. If unspecified, returns the first page of results.
 * @param {string} [view] - OPTIONAL. Affects the fields included in the returned Task messages. See TaskView below.
 *                           - 'MINIMAL': Task message will include ONLY the fields: Task.Id, Task.State.
 *                           - 'BASIC': Task message will include all fields EXCEPT: Task.ExecutorLog.stdout, Task.ExecutorLog.stderr, Input.content, TaskLog.system_logs.
 *                           - 'FULL': Task message includes all fields.
 * @param {string} [namePrefix] - OPTIONAL. Filter the list to include tasks where the name matches this prefix. If unspecified, no task name filtering is done.
 */
const fetchTasks = async (
  pageSize = 5,
  nextPageToken = "",
  view = "MINIMAL",
  namePrefix = ""
) => {
  let url = `${getTasksURL}?`;

  // Append pageSize parameter if provided
  if (pageSize) {
    url += `page_size=${pageSize}&`;
  }

  // Append view parameter if provided
  if (view) {
    url += `view=${view}&`;
  }

  // Append nextPageToken parameter if provided
  if (nextPageToken.length > 0) {
    url += `page_token=${nextPageToken}&`;
  }

  if (namePrefix.length > 0) {
    url += `name_prefix=${namePrefix}&`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
};

/**
 *
 * @param {string} [id] - ID of the specific task
 */
const fetchTask = async (id: string) => {
  const url = `${getTasksURL}/${id}?view=FULL`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
};

export { fetchTasks, fetchTask };
