# CustomExitScreen

metatellの退室画面をカスタマイズするためのプラグインテンプレートです。

## 動作要件

- Node 24+

## 開発

```bash
npm install
npm run dev
```

開発サーバーは `http://localhost:5173` で起動します。

## ビルド

```bash
npm run build
```

Module Federationマニフェストは `dist/mf-manifest.json` に出力されます。

## プラグインタイプ

```
CustomExitScreen
```

## 対応するReason

| reason | 説明 | トリガー |
|--------|------|----------|
| `exited` | 退室（フォールバック） | `exitScene()`のデフォルト値 |
| `left` | 退室 | インワールド UI から `leave_room_requested` が発火した時 |
| `closed` | ルームクローズ | 管理者がルームをクローズした時 |
| `denied` | 入室拒否 | 入室権限がない時 |
| `kicked` | キック | 管理者によってキックされた時 |
| `connectError` | 接続エラー | サーバー接続に失敗した時 |
| `sceneError` | シーンエラー | 3Dシーンの読み込みに失敗した時 |

## Props

```ts
export type CustomExitScreenProps = {
  reason:
    | "exited"
    | "closed"
    | "denied"
    | "kicked"
    | "left"
    | "connectError"
    | "sceneError";
  isSignedIn: boolean;
  copyByReason: Record<
    CustomExitScreenProps["reason"],
    {
      title: string;
      message: string;
      buttonLabel: string;
      buttonUrl?: string;
    }
  >;
  onPrimaryAction: () => void;
  logoUrl?: string;
};
```

## Module Federationメタデータ

```ts
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
    "sceneError"
  ] as const
};
```

## 備考

- `.uuid.env`には`npm run set-uuid`で生成される`VERSION_ID`と`VITE_VERSION_ID`が含まれます。
- ホストはModule Federationランタイム経由で`CustomExitScreen`を読み込みます。
- `exited`と`left`は同じメッセージを表示します。`exited`はフォールバック用で、通常は`left`が使われます。
- 2Dの「退室」ボタンは通常 `LeaveRoomModal` からルートへ遷移するため、`ExitedRoomScreen` を経由しません。
