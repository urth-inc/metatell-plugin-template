import React, { useEffect, useState } from "react";

import { ModalWrapper } from "./ModalWrapper";

import styles from "./IframeModal.module.scss";

type IframeModalProps = {
  onClose: () => void;
};

const fetchPageUrl = async () => {
  // TODO: 動的にURLを取得する
  const isLocalhost = window.location.hostname === "localhost";
  return isLocalhost
    ? "https://urth04.v-air.u-rth.dev/plugin/pdfs/help.pdf"
    : "/plugin/pdfs/help.pdf";
};

const IframeModal = ({ onClose }: IframeModalProps) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageUrl, setPageUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchPageUrl()
      .then(setPageUrl)
      .catch(() => setError("PDFのURLを取得できませんでした"));
  }, []);

  const handleFullScreen = () => {
    setIsFullScreen(true);
  };

  const handleExitFullScreen = () => {
    setIsFullScreen(false);
  };

  const fullScreenClassName = isFullScreen ? styles.fullscreen : "";

  return (
    <>
      {error && <div>{error}</div>}
      {pageUrl && (
        <ModalWrapper
          isOpen
          onClose={onClose}
          isOutsideCloseButton
          useFullScreen={true}
          onFullScreen={handleFullScreen}
          onExitFullScreen={handleExitFullScreen}
        >
          <div className={`${styles.modalWrapper} ${fullScreenClassName}`}>
            <iframe className={styles.iframe} src={pageUrl} />
          </div>
        </ModalWrapper>
      )}
    </>
  );
};

export { IframeModal };
