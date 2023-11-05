export const resolveClass = (className = "", depth = 0) =>
  `${className.trim()}${depth ? ` depth-${depth}` : ""}`;
