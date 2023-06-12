import React from "react";
import { ToolClassesComponent } from "./components/toolAPITesting/tool";
import { Provider } from "react-redux";
import { store } from "./api/store";
import { Accordion } from "./components/accordion/accordion";

const App = () => {
  return (
    <div>
      {/* <Provider store={store}>
        <ToolClassesComponent
          id={"JB7HQW"}
          version_id={"fufm50"}
          type={"CWL"}
        />
      </Provider> */}
      <Accordion/>
    </div>
  );
};

export default App;
