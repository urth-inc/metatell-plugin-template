import React from "react";
import classNames from "classnames";

import { CustomMinimizedNearestUserProfileIcon } from "../CustomMinimizedNearestUserProfileIcon";
import { MinusIcon } from "./MinusSolid";

import { useCustomNearestUserProfile } from "./useCustomNearestUserProfile";
import styles from "./CustomNearestUserProfile.module.scss";

import type { User } from "../../types/user";

type Props = {
  user: User | undefined;
};

export const CustomNearestUserProfile: React.FC<Props> = ({ user }) => {
  const { minimized, minimizeModal, openModal } = useCustomNearestUserProfile();
  if (!user || user.distance > 10) {
    return null;
  }

  return (
    <div>
      <CustomMinimizedNearestUserProfileIcon
        onClick={openModal}
        showSpeakerIcon={minimized}
      />
      <div className={classNames(styles.infoModal, minimized && styles.hide)}>
        <button className={styles.minimizeButton} onClick={minimizeModal}>
          <MinusIcon />
        </button>
        <div className={styles.displayName}>{user.displayName}</div>
        <div className={styles.avatarContainer}>
          <img src={user.avatarThumbnailUrl} draggable="false" />
        </div>
        <div className={styles.bio}>{user.biography}</div>
      </div>
    </div>
  );
};
