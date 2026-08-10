import React from "react";
import { CustomOverlay } from "./components/CustomOverlay";

import styles from "./App.module.scss";

const App: React.FC = () => {
  return (
    <div className={styles.appContainer}>
      <h2 className={styles.appHeadingContainer}>CustomOverlay Component</h2>
      <CustomOverlay />
    </div>
  );
};

export default App;
