import type React from "react";
import styles from "./App.module.scss";
import { CustomChatButton } from "./components/CustomChatButton";

const App: React.FC = () => {
	return (
		<div className={styles.appContainer}>
			<h2 className={styles.appHeadingContainer}>CustomChatButton Component</h2>
			<CustomChatButton toggleDefaultModal={() => {}} />
		</div>
	);
};

export default App;
