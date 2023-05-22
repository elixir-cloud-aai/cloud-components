module.exports = {
	root: true,
	// global rules will be exported from the eslint package elixir
	extends: ["elixir", "next"],
	// rules can be overwritten or defined here
	rules: {
		"react/self-closing-comp": "off",
		"lines-around-directive": "off",
		"react/jsx-filename-extension": "off",
	},
};
