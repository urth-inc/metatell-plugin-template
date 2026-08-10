import React from "react";
import { CustomLeaveButton } from "./components/CustomLeaveButton";

import styles from "./App.module.scss";

const App: React.FC = () => {
  return (
    <div className={styles.appContainer}>
      <h2 className={styles.appHeadingContainer}>
        CustomLeaveButton Component
      </h2>
      <CustomLeaveButton showDefaultModal={() => {}} destinationUrl="" />
    </div>
  );
};

export default App;
