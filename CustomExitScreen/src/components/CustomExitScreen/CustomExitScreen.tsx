import type React from "react";

import styles from "./CustomExitScreen.module.css";

export const ExitReason = {
	exited: "exited",
	closed: "closed",
	denied: "denied",
	kicked: "kicked",
	left: "left",
	connectError: "connectError",
	sceneError: "sceneError",
} as const;

export type ExitReasonType = (typeof ExitReason)[keyof typeof ExitReason];

export type ExitScreenCopy = {
	title: string;
	message: string;
	buttonLabel: string;
	buttonUrl?: string;
};

export type ExitScreenCopyByReason = Record<ExitReasonType, ExitScreenCopy>;

export type CustomExitScreenProps = {
	reason: ExitReasonType;
	isSignedIn: boolean;
	copyByReason: ExitScreenCopyByReason;
	onPrimaryAction: () => void;
	logoUrl?: string;
};

export const mfMeta = {
	type: "CustomExitScreen",
	contractVersion: 1,
	supportedReasons: [
		"exited",
		"closed",
		"denied",
		"kicked",
		"left",
		"connectError",
		"sceneError",
	] as const,
};

export const CustomExitScreen: React.FC<CustomExitScreenProps> = ({
	reason,
	copyByReason,
	onPrimaryAction,
	logoUrl,
}) => {
	const copy = copyByReason[reason];

	return (
		<div className={styles.root} data-reason={reason}>
			{logoUrl && <img src={logoUrl} alt="Logo" className={styles.logo} />}
			<section className={styles.container}>
				<h2 className={styles.title}>{copy.title}</h2>
				<p className={styles.message}>{copy.message}</p>
				<button
					className={styles.button}
					type="button"
					onClick={onPrimaryAction}
				>
					{copy.buttonLabel}
				</button>
			</section>
		</div>
	);
};

export default CustomExitScreen;
