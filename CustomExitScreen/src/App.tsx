import type React from "react";
import { useMemo, useState } from "react";
import styles from "./App.module.css";
import type {
	ExitReasonType,
	ExitScreenCopyByReason,
} from "./components/CustomExitScreen";
import { CustomExitScreen, ExitReason } from "./components/CustomExitScreen";

type ReasonConfig = {
	title: string;
	message: string;
	buttonLabel: string;
	buttonUrl: string;
};

const defaultConfigs: Record<ExitReasonType, ReasonConfig> = {
	exited: {
		title: "退出しました",
		message: "ルームを退出しました。",
		buttonLabel: "再読み込み",
		buttonUrl: "",
	},
	left: {
		title: "退出しました",
		message: "ルームを退出しました。",
		buttonLabel: "再読み込み",
		buttonUrl: "",
	},
	closed: {
		title: "ルームはクローズされました",
		message: "管理者がルームをクローズしました。",
		buttonLabel: "ホームへ",
		buttonUrl: "/",
	},
	denied: {
		title: "入室権限がありません",
		message: "",
		buttonLabel: "トップページへ戻る",
		buttonUrl: "https://example.com",
	},
	kicked: {
		title: "ルームから退出させられました",
		message: "管理者によって退出させられました。",
		buttonLabel: "ホームへ",
		buttonUrl: "/",
	},
	connectError: {
		title: "接続エラー",
		message: "接続に失敗しました。",
		buttonLabel: "再試行",
		buttonUrl: "",
	},
	sceneError: {
		title: "シーンエラー",
		message: "シーンの読み込みに失敗しました。",
		buttonLabel: "再読み込み",
		buttonUrl: "",
	},
};

const defaultDeniedAnonymous: ReasonConfig = {
	title: "このルームへの入室は制限されています",
	message: "",
	buttonLabel: "ログインする",
	buttonUrl: "https://example.com/signin",
};

const reasonLabels: Record<ExitReasonType, string> = {
	exited: "Exited (フォールバック)",
	left: "Left (退室)",
	closed: "Closed (ルームクローズ)",
	denied: "Denied (入室拒否)",
	kicked: "Kicked (キック)",
	connectError: "Connect Error (接続エラー)",
	sceneError: "Scene Error (シーンエラー)",
};

export const App: React.FC = () => {
	const [reason, setReason] = useState<ExitReasonType>(ExitReason.denied);
	const [isSignedIn, setIsSignedIn] = useState(false);
	const [logoUrl, setLogoUrl] = useState(
		"https://placehold.co/160x80?text=Logo",
	);

	const [configs, setConfigs] =
		useState<Record<ExitReasonType, ReasonConfig>>(defaultConfigs);
	const [deniedAnonymousConfig, setDeniedAnonymousConfig] =
		useState<ReasonConfig>(defaultDeniedAnonymous);

	const updateConfig = (
		reasonKey: ExitReasonType,
		field: keyof ReasonConfig,
		value: string,
	) => {
		setConfigs((prev) => ({
			...prev,
			[reasonKey]: { ...prev[reasonKey], [field]: value },
		}));
	};

	const updateDeniedAnonymous = (field: keyof ReasonConfig, value: string) => {
		setDeniedAnonymousConfig((prev) => ({ ...prev, [field]: value }));
	};

	const copyByReason = useMemo<ExitScreenCopyByReason>(() => {
		const result = {} as ExitScreenCopyByReason;
		for (const key of Object.keys(configs) as ExitReasonType[]) {
			if (key === "denied") {
				const cfg = isSignedIn ? configs.denied : deniedAnonymousConfig;
				result[key] = {
					title: cfg.title,
					message: cfg.message,
					buttonLabel: cfg.buttonLabel,
					buttonUrl: cfg.buttonUrl || undefined,
				};
			} else {
				const cfg = configs[key];
				result[key] = {
					title: cfg.title,
					message: cfg.message,
					buttonLabel: cfg.buttonLabel,
					buttonUrl: cfg.buttonUrl || undefined,
				};
			}
		}
		return result;
	}, [configs, deniedAnonymousConfig, isSignedIn]);

	const renderFieldGroup = (
		label: string,
		config: ReasonConfig,
		onChange: (field: keyof ReasonConfig, value: string) => void,
		isActive: boolean,
		onSelect?: () => void,
	) => {
		const interactiveProps = onSelect
			? {
					onClick: onSelect,
					onKeyDown: (e: React.KeyboardEvent) => {
						if (e.key === "Enter" || e.key === " ") {
							e.preventDefault();
							onSelect();
						}
					},
					role: "button" as const,
					tabIndex: 0,
				}
			: {};

		return (
			<div
				key={label}
				className={`${styles.fieldGroup} ${isActive ? styles.activeGroup : styles.inactiveGroup} ${onSelect ? styles.selectableGroup : ""}`}
				{...interactiveProps}
			>
				<h3 className={styles.groupTitle}>
					{label}
					{isActive && <span className={styles.activeBadge}>ACTIVE</span>}
				</h3>
				<label className={styles.field}>
					Title
					<input
						type="text"
						value={config.title}
						onChange={(e) => onChange("title", e.target.value)}
					/>
				</label>
				<label className={styles.field}>
					Message
					<textarea
						value={config.message}
						onChange={(e) => onChange("message", e.target.value)}
					/>
				</label>
				<label className={styles.field}>
					Button Text
					<input
						type="text"
						value={config.buttonLabel}
						onChange={(e) => onChange("buttonLabel", e.target.value)}
					/>
				</label>
				<label className={styles.field}>
					Button URL
					<input
						type="text"
						value={config.buttonUrl}
						onChange={(e) => onChange("buttonUrl", e.target.value)}
					/>
				</label>
			</div>
		);
	};

	return (
		<div className={styles.page}>
			<div className={styles.layout}>
				<section className={styles.preview}>
					<h1 className={styles.heading}>CustomExitScreen Preview</h1>
					<div className={styles.previewCard}>
						<CustomExitScreen
							reason={reason}
							isSignedIn={isSignedIn}
							copyByReason={copyByReason}
							logoUrl={logoUrl}
							onPrimaryAction={() => {
								const copy = copyByReason[reason];
								if (copy.buttonUrl) {
									window.location.href = copy.buttonUrl;
									return;
								}
								window.location.reload();
							}}
						/>
					</div>
				</section>
				<aside className={styles.panel}>
					<div className={styles.panelHeader}>
						<h2 className={styles.panelTitle}>Debug Inputs</h2>
						<div className={styles.controls}>
							<div className={styles.controlRow}>
								<label className={styles.controlField}>
									Reason
									<select
										value={reason}
										onChange={(e) =>
											setReason(e.target.value as ExitReasonType)
										}
									>
										{(
											Object.keys(ExitReason) as (keyof typeof ExitReason)[]
										).map((key) => (
											<option key={key} value={ExitReason[key]}>
												{reasonLabels[ExitReason[key]]}
											</option>
										))}
									</select>
								</label>
							</div>
							<div className={styles.controlRow}>
								<label className={styles.controlField}>
									Logo URL
									<input
										type="text"
										value={logoUrl}
										onChange={(e) => setLogoUrl(e.target.value)}
										placeholder="https://example.com/logo.png"
									/>
								</label>
							</div>
						</div>
					</div>

					<div className={styles.panelGrid}>
						{reason === "denied" ? (
							<>
								{renderFieldGroup(
									"Denied (Signed-in)",
									configs.denied,
									(field, value) => updateConfig("denied", field, value),
									isSignedIn,
									() => setIsSignedIn(true),
								)}
								{renderFieldGroup(
									"Denied (Anonymous)",
									deniedAnonymousConfig,
									updateDeniedAnonymous,
									!isSignedIn,
									() => setIsSignedIn(false),
								)}
							</>
						) : (
							renderFieldGroup(
								reasonLabels[reason],
								configs[reason],
								(field, value) => updateConfig(reason, field, value),
								true,
							)
						)}
					</div>
				</aside>
			</div>
		</div>
	);
};
