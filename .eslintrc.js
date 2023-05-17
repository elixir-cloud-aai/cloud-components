module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-elixir`
  extends: ["elixir"],
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  },
};
