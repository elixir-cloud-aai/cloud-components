// Prefix for files in public/ when the site is served under a subpath
// (set in next.config.js, e.g. on Read the Docs); empty otherwise.
export const withBasePath = (path: string): string =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${path}`;
