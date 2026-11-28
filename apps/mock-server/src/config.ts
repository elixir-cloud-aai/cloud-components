// Settings from the environment

export const DEFAULT_PORT = 8080;

// The port from `PORT`, or 8080 if it's unset or empty
export const parsePort = (value: string | undefined): number => {
  if (value === undefined || value === "") {
    return DEFAULT_PORT;
  }
  const port = Number(value);
  if (!/^\d+$/.test(value) || port < 1 || port > 65535) {
    throw new Error(`PORT must be a port number (1-65535): '${value}'`);
  }
  return port;
};
