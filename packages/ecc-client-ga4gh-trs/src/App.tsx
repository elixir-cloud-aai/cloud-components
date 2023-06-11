import React from "react";
import { ToolClassesComponent } from "./components/toolAPITesting/tool";
import { Provider } from "react-redux";
import { store } from "./api/store";
import { Accordion } from "./components/Accordion/Accordion";

const App = () => {
  return (
    <div>
      <h1>Hello, world!</h1>
      <Provider store={store}>
        <ToolClassesComponent
          id={"JB7HQW"}
          version_id={"fufm50"}
          type={"CWL"}
        />
      </Provider>
      <Accordion/>
    </div>
  );
};

export default App;
