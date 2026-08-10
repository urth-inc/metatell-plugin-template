import React from "react";
import { CustomWebCameraButton } from "./components/CustomWebCameraButton";

import styles from "./App.module.scss";

const App: React.FC = () => {
  const dummyProps = {
    isSharingCamera: false,
    canShareCamera: true,
    canShareCameraToAvatar: true,
    stopSharingCamera: () => {
      console.log("stopSharingCamera");
    },
    startSharingCamera: () => {
      console.log("startSharingCamera");
    },
    startSharingCameraToAvatar: () => {
      console.log("startSharingCameraToAvatar");
    },
  };

  return (
    <div className={styles.appContainer}>
      <h2 className={styles.appHeadingContainer}>
        CustomWebCameraButton Component
      </h2>
      <CustomWebCameraButton {...dummyProps} />
    </div>
  );
};

export default App;
