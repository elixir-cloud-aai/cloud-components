import React from "react";
import { ToolClassesComponent } from "./components/tool/tool";
import { Provider } from "react-redux";
import { store } from "./api/store";

const App = () => {
  return (
    <div>
      <h1>Hello, world!</h1>
      <Provider store={store}><ToolClassesComponent id={"JB7HQW"} version_id={"fufm50"} type={"CWL"}/></Provider>
    </div>
  );
};

export default App;
