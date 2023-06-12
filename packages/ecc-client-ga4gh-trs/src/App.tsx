import React, { useState } from "react";
import { ToolClassesComponent } from "./components/toolAPITesting/tool";
import { Provider } from "react-redux";
import { store } from "./api/store";
import { Accordion } from "./components/accordion/Accordion";
import { Search } from "./components/search/Search";
import { InputBox } from "./components/inputbox/InputBox";
import ClipboardCopyComponent from "./components/testingComp/copytotheClipboard";
import TRScomponent from "./components/TRScomponent/TRScomponent";
import styles from "./app.module.css";

const App = () => {
  return (
    <div className={styles.app}>
      {/* <Provider store={store}>
        <ToolClassesComponent
          id={"JB7HQW"}
          version_id={"fufm50"}
          type={"CWL"}
        />
      </Provider>  */}

      <Provider store={store}>
        <TRScomponent id={"JB7HQW"} version_id={"fufm50"} type={"CWL"} />
      </Provider>
    </div>
  );
};

export default App;
