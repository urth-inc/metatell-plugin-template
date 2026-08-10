import React, { useState } from "react";

import { CustomLeaveModal } from "../CustomLeaveModal";
import { SampleIcon } from "./SampleIcon";
import styles from "./CustomLeaveButton.module.scss";

interface CustomLeaveButtonProps {
  showDefaultModal: () => void;
  destinationUrl: string;
}

export const CustomLeaveButton: React.FC<CustomLeaveButtonProps> = ({
  showDefaultModal,
  destinationUrl,
}) => {
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  const handleClick = () => {
    // showDefaultModal();
    openModal();
  };

  return (
    <>
      <CustomLeaveModal modalIsOpen={modalIsOpen} closeModal={closeModal} />
      <button
        className={styles.customLeaveButtonContainer}
        onClick={handleClick}
      >
        <div className={styles.sampleIconContainer}>
          <SampleIcon />
        </div>
        <div className={styles.customLeaveButtonLabel}>Leave</div>
      </button>
    </>
  );
};
