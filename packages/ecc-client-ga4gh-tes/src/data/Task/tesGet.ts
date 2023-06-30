/**
 * Fetches tasks based on the specified parameters.
 * @param {string} [baseURL] - The base URL for fetching tasks
 * @param {number} [pageSize] - OPTIONAL. Number of tasks to return in one page.
 *                                        Must be less than 2048. Defaults to 256.
 * @param {string} [nextPageToken] - OPTIONAL. Page token used to retrieve the next page
 *                                             of results. If unspecified, returns the
 *                                             first page of results.
 * @param {string} [view] - OPTIONAL. Affects the fields included in the returned Task messages.
 *                                    See TaskView below.
 *                           - 'MINIMAL': Task message will include ONLY the fields:
 *                                        Task.Id, Task.State.
 *                           - 'BASIC': Task message will include all fields EXCEPT:
 *                                      Task.ExecutorLog.stdout, Task.ExecutorLog.stderr,
 *                                      Input.content, TaskLog.system_logs.
 *                           - 'FULL': Task message includes all fields.
 * @param {string} [namePrefix] - OPTIONAL. Filter the list to include tasks where the name matches
 *                                          this prefix. If unspecified, no task name filtering is
 *                                          done.
 */
const fetchTasks = async (
  baseURL: string,
  pageSize = 5,
  nextPageToken = '',
  view = 'MINIMAL',
  namePrefix = '',
) => {
  let url = `${baseURL}/tasks?`;

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
    if (!response) {
      return {
        isError: true,
        breakpoint: 'fetchTasks',
        error: 'No response from server',
      };
    }
    return await response.json();
  } catch (error) {
    return {
      isError: true,
      breakpoint: 'fetchTasks',
      error,
    };
  }
};

/**
 * Fetches full view of task with the specified ID
 * @param {string} [baseURL] - Base URL for fetching task
 * @param {string} [id] - ID of the specific task
 */
const fetchTask = async (baseURL: string, id: string) => {
  const url = `${baseURL}/tasks/${id}?view=FULL`;

  try {
    const response = await fetch(url);
    if (!response) {
      return {
        isError: true,
        breakpoint: 'fetchTask',
        error: 'No response from server',
      };
    }
    return await response.json();
  } catch (error) {
    return {
      isError: true,
      breakpoint: 'fetchTask',
      error,
    };
  }
};

/**
 *This mathod deletes a specific task
 * @param id ID of the task to be deleted
 */
const deleteTask = async (baseURL: string, id: string) => {
  const url = `${baseURL}/tasks/${id}:cancel`;
  try {
    const response = await fetch(url, {
      method: 'DELETE',
    });
    return response;
  } catch (error) {
    return {
      isError: true,
      breakpoint: 'deleteTask',
      error,
    };
  }
};

/**
 * Posts a new task.
 * @param {string} baseURL - The base URL for posting the task.
 * @param {object} taskData - The data of the task to be posted.
 *                           This should be an object containing the necessary fields for the task.
 *                           Modify the structure according to your task requirements.
 */
const postTask = async (baseURL: string, taskData: object) => {
  const url = `${baseURL}/tasks`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });

    if (!response) {
      return {
        isError: true,
        breakpoint: 'postTask',
        error: 'No response from server',
      };
    }

    return await response.json();
  } catch (error) {
    return {
      isError: true,
      breakpoint: 'postTask',
      error,
    };
  }
};

export {
  fetchTasks, fetchTask, deleteTask, postTask,
};
