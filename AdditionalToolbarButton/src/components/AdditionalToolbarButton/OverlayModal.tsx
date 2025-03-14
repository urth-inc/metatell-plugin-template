import classNames from "classnames";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";

import { CloseButton } from "./CloseButton";
import { CompressButton } from "./CompressButton";
import { ExpandButton } from "./ExpandButton";

import * as styles from "./Modal.module.scss";

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  // @ts-ignore
  centerDirection?: any;
  className?: string;
  overlayClassName?: string;
  overlayColor?: "black" | "white" | "transparent";
  overlayDisabled?: boolean;
  isHiddenTransition?: boolean;
  isOutsideCloseButton?: boolean;
  useFullScreen?: boolean;
  onFullScreen?: () => void;
  onExitFullScreen?: () => void;
};

// TODO ファイル名を変更
export const OverlayModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  centerDirection = "both",
  className,
  overlayClassName,
  overlayColor = "black",
  overlayDisabled = false,
  isHiddenTransition = false,
  isOutsideCloseButton = false,
  useFullScreen = false,
  onFullScreen,
  onExitFullScreen,
}: ModalProps) => {
  // @ts-ignore
  const [modalRoot] = useState<any>(document.createElement("div"));
  const modalRef = useRef<HTMLDivElement>(null);
  const openClass = isOpen ? styles.open : "";
  const modaWrapClass = className ? styles[className] : "";
  const overlayClass = overlayClassName ? styles[overlayClassName] : "";
  const hiddenClass = isHiddenTransition ? styles.hidden : "";

  const [isFullscreen, setIsFullscreen] = useState(false);
  const handleFullscreen = useCallback(() => {
    setIsFullscreen(true);
    onFullScreen && onFullScreen();
  }, [onFullScreen]);
  const handleCompress = useCallback(() => {
    setIsFullscreen(false);
    onExitFullScreen && onExitFullScreen();
  }, [onExitFullScreen]);

  const fullScreenClass = isFullscreen ? styles.fullscreen : "";

  // NOTE ESCキーを検知してモーダルを閉じる
  const handleEscClose = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      onClose();
    }
  };

  useEffect(() => {
    // NOTE モーダルが開いている間、スクロールを無効にする
    if (isOpen) {
      // モーダルが開いているときだけdivをbodyに追加
      document.body.appendChild(modalRoot);
      document.body.classList.add("no-scroll");

      modalRef.current?.focus();
    } else {
      document.body.classList.remove("no-scroll");
      document.body.removeChild(modalRoot);
    }

    return () => {
      document.body.classList.remove("no-scroll");
      document.body.removeChild(modalRoot);
    };
  }, [isOpen]);

  return createPortal(
    <div
      ref={modalRef}
      className={classNames(
        styles.modalWrap,
        openClass,
        modaWrapClass,
        hiddenClass,
      )}
      onKeyDown={handleEscClose}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
    >
      {useFullScreen &&
        (isFullscreen ? (
          <CompressButton
            className={classNames(
              styles.modalFullScreenButton,
              styles.outside,
              hiddenClass,
            )}
            onClick={handleCompress}
            size="lg"
          />
        ) : (
          <ExpandButton
            className={classNames(
              styles.modalFullScreenButton,
              styles.outside,
              hiddenClass,
            )}
            onClick={handleFullscreen}
            size="lg"
          />
        ))}
      {isOutsideCloseButton && (
        <CloseButton
          className={classNames(
            styles.modalCloseButton,
            styles.outside,
            hiddenClass,
          )}
          onClick={onClose}
          size="lg"
        />
      )}

      <div
        className={classNames(
          styles.modalContents,
          styles[centerDirection],
          fullScreenClass,
        )}
      >
        {!isOutsideCloseButton && (
          <CloseButton
            className={classNames(
              styles.modalCloseButton,
              styles.inside,
              hiddenClass,
            )}
            onClick={onClose}
            size="lg"
          />
        )}

        {children}
      </div>

      {!overlayDisabled && (
        <div
          className={classNames(
            styles.overlay,
            openClass,
            styles[overlayColor],
            overlayClass,
          )}
          onClick={onClose}
        />
      )}
    </div>,
    modalRoot,
  );
};
