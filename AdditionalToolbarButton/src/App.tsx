import React from "react";
import { AdditionalToolbarButton } from "./components/AdditionalToolbarButton";

import * as styles from "./App.module.scss";

const App: React.FC = () => {
  return (
    <div className={styles.appContainer}>
      <h2 className={styles.appHeadingContainer}>
        AdditionalToolbarButton Component
      </h2>
      <AdditionalToolbarButton />
    </div>
  );
};

export default App;
