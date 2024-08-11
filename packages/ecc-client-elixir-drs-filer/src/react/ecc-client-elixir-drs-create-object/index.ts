import * as React from "react";
import { createComponent } from "@lit/react";
import Component from "../../components/create-object/create-object.js";

const tagName = "ecc-client-elixir-drs-create-object";
window.customElements.define("ecc-client-elixir-drs-create-object", Component);

/**
 * @summary This component is used to create object using DRS API.
 * @since 1.0.0
 *
 * @property {string} baseURL - Base URL
 *
 */
const reactWrapper = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {},
  displayName: "EccClientElixirDrsCreateObject",
});

export default reactWrapper;
