import React from "react";
import { provideFASTDesignSystem } from "@microsoft/fast-components";
import { fastButton } from "@microsoft/fast-components";

provideFASTDesignSystem().register(fastButton());

// declare global {
//   namespace JSX {
//     interface IntrinsicElements {
//       "fast-button": any;
//       // include other FAST components here as needed
//     }
//   }
// }

const App = (): JSX.Element => {
  return (
    <div>
      <h1>Hello, world!</h1>
      {/* <fast-button onClick={() => console.log("Button clicked!")}>
        Click Me
      </fast-button> */}
    </div>
  );
};

export default App;
