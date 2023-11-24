import { LitElement } from "lit";

/**
 * @summary returns the css parts of an Elixir Cloud component or the class that constructs the component
 *
 * @param {LitElement} Component
 *
 * @return  {string}  a string of the css parts of the component entered as an argument
 */
export const getComponentCssParts = (Component: any) => {
  let cssPartString = "";

  // creating an instance if `component` is a class
  const instanceOfComponent: LitElement & { cssParts: Record<string, string> } =
    Component.styles ? new Component() : Component;

  if (!(instanceOfComponent instanceof LitElement)) {
    throw new Error("component is not a valid LitElement");
  }

  Object.entries(instanceOfComponent.cssParts).forEach((part) => {
    cssPartString += `, ${part[1]}`;
  });
  return cssPartString.replace(/^, /, "");
};
