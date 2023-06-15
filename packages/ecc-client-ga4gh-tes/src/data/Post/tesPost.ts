import { postTaskURL } from "../baseURL.js";

/**
 *This mathod deletes a specific task
 * @param id ID of the task to be deleted
 */
const deleteTask = async (id: string) => {
  const url = `${postTaskURL}/${id}:cancel`;
  try {
    const response = await fetch(url, {
      method: "DELETE",
    });
    return response;
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
};

export { deleteTask };
