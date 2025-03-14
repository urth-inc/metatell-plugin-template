import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import "./styles/global.module.scss";

import * as generalStyles from "./styles/preferences-screen.module.scss";
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
          className={generalStyles.icon}
          icon={faQuestion as IconProp}
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
