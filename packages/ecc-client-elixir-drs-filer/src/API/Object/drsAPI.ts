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

export { postObject };
