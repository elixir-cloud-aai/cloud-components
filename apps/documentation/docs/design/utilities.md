# Utilities

These are utility functions that help to enhance the features of the Elixir cloud components

## getComponentCssParts

This returns the css parts of an Elixir cloud component or the class that constructs the component.

You can use this to export all the parts of the component as is.

#### params

- component - type: `any`. An Elixir Cloud component or class that constructs the component.

#### return type

- string

::: details Code Blocks
::: code-group

```js [HTML]
import "@elixir-cloud/design/dist/components/form/index.js";
import { EccUtilsDesignForm } from "@elixir-cloud/design/dist/components/index.js";
import { getComponentCssParts } from "@elixir-cloud/design/dist/utilities/index.js";

const fields = [...];

// option 1: with component class
<ecc-utils-design-form
  .fields=${fields}
  exportparts=${getComponentCssParts(EccUtilsDesignForm)}
></ecc-utils-design-form>

// option 2: with component
// this method is more volatile as you need to be sure that the component has been rendered
// before the function is called
<ecc-utils-design-form
  .fields=${fields}
  exportparts=${getComponentCssParts(document.querySelector('ecc-utils-design-form'))}
>
</ecc-utils-design-form>
```
