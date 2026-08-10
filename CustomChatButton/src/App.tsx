import React from "react";
import { CustomChatButton } from "./components/CustomChatButton";

import styles from "./App.module.scss";

const App: React.FC = () => {
  return (
    <div className={styles.appContainer}>
      <h2 className={styles.appHeadingContainer}>
        CustomChatButton Component
      </h2>
      <CustomChatButton toggleDefaultModal={() => {}} />
    </div>
  );
};

export default App;
