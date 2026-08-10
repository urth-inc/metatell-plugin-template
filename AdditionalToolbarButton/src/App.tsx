import type React from "react";
import styles from "./App.module.scss";
import { AdditionalToolbarButton } from "./components/AdditionalToolbarButton";

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
