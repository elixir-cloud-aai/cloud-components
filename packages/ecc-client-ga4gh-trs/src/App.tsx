import React from "react";
import { Provider } from "react-redux";
import { store } from "./api/store";
import TRScomponent from "./components/TRScomponent/TRScomponent";
import styles from "./app.module.css";

const App = () => {
  return (
    <div className={styles.app}>
      <Provider store={store}>
        <TRScomponent id={"JB7HQW"} version_id={"fufm50"} type={"CWL"} />
      </Provider>
    </div>
  );
};

export default App;
