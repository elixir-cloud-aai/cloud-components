module.exports = {
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint"],
	root: true,
	extends: [
		"turbo",
		"plugin:@typescript-eslint/recommended",
		"airbnb",
		"prettier",
	],
	rules: {
		// add global Eslint rules here
	},
	ignorePatterns: ["node_modules/", ".turbo"],
};
