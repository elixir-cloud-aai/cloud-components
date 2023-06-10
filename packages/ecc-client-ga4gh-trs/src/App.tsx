import React from "react";
// import { provideFASTDesignSystem } from "@microsoft/fast-components";
// import { fastButton } from "@microsoft/fast-components";
import { ToolClassesComponent } from "./components/tool/tool";
import { Provider } from "react-redux";
import { store } from "./api/store";

// provideFASTDesignSystem().register(fastButton());

// declare global {
//   namespace JSX {
//     interface IntrinsicElements {
//       "fast-button": any;
//       // include other FAST components here as needed
//     }
//   }
// }

const App = () => {
  return (
    <div>
      <h1>Hello, world!</h1>
      {/* <fast-button onClick={() => console.log("Button clicked!")}>
        Click Me
      </fast-button> */}
      <Provider store={store}><ToolClassesComponent/></Provider>

    </div>
  );
};

export default App;
