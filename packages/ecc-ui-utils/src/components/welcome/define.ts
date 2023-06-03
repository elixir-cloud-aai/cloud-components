import Welcome from "./welcome.js";
import definition from "./welcome.definition.js";

const welcome = Welcome.compose(definition);

export default welcome;
