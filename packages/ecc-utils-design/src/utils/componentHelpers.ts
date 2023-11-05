export const returnNewObjectCopy = (objectToCopy: object) =>
  JSON.parse(JSON.stringify(objectToCopy));

export const resolveClass = (className = "", depth = 0) =>
  className + depth ? `depth-${depth}` : "";
