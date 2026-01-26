import React, { useState } from "react";

import { CustomAccessDeniedScreen } from "./components/CustomAccessDeniedScreen";

export const App: React.FC = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "#f7f3ef", padding: "24px" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "24px", marginBottom: "16px" }}>CustomAccessDeniedScreen Preview</h1>
        <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <input
            type="checkbox"
            checked={isSignedIn}
            onChange={event => setIsSignedIn(event.target.checked)}
          />
          Signed In
        </label>
        <CustomAccessDeniedScreen
          isSignedIn={isSignedIn}
          accessDeniedMessageForLoggedInUsers="入室権限がありません"
          accessDeniedButtonTextForLoggedInUsers="トップページへ戻る"
          accessDeniedButtonUrlForLoggedInUsers="https://example.com"
          accessDeniedMessageForAnonymousUsers="このルームへの入室は制限されています"
          accessDeniedButtonTextForAnonymousUsers="ログインする"
          accessDeniedButtonUrlForAnonymousUsers="https://example.com/signin"
          onButtonClick={() => {
            const url = isSignedIn ? "https://example.com" : "https://example.com/signin";
            console.log("Navigate to:", url);
          }}
        />
      </div>
    </div>
  );
};
