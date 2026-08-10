import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import "normalize.css";
import "./styles/global.module.scss";

import { ToolbarButton } from "./ToolbarButton";

import { IframeModal } from "./IframeModal";

import type { IconProp } from "@fortawesome/fontawesome-svg-core";

type IframeModalToolbarButtonProps = {
  onClick: () => void;
  label: string;
};

const IframeModalToolbarButton = (props: IframeModalToolbarButtonProps) => {
  return (
    <ToolbarButton
      onClick={props.onClick}
      icon={
        <FontAwesomeIcon
          icon={faQuestion as IconProp}
          style={{
            width: "24px",
            height: "24px",
          }}
        />
      }
      preset="accent4"
      label={props.label}
    />
  );
};

export const AdditionalToolbarButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <IframeModalToolbarButton onClick={handleOpenModal} label="ヘルプ" />
      {isModalOpen && <IframeModal onClose={handleCloseModal} />}
    </div>
  );
};
