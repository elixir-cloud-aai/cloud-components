/**
 * Posts a new drs object.
 * @param {string} baseURL - The base URL for posting the drs object.
 * @param {object} taskData - The data of the drs object to be posted.
 *                           This should be an object containing the necessary fields for the drs object.
 *                           Modify the structure according to your object requirements.
 * @returns {string} - A string that denotes the object id
 */
const postObject = async (baseURL: string, objectData: object) => {
  const url = `${baseURL}/objects`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(objectData),
    });

    if (!response) {
      return {
        isError: true,
        breakpoint: "postObject",
        error: "No response from server",
      };
    }

    return await response.json();
  } catch (error) {
    return {
      isError: true,
      breakpoint: "postObject",
      error,
    };
  }
};

/**
 *This mathod deletes a specific object
 * @param id ID of the drs obeject to be deleted
 */
const deleteObject = async (baseURL: string, id: string) => {
  const url = `${baseURL}/objects/${id}`;
  try {
    const response = await fetch(url, {
      method: "DELETE",
    });
    return response;
  } catch (error) {
    return {
      isError: true,
      breakpoint: "deleteObject",
      error,
    };
  }
};

export { postObject, deleteObject };
