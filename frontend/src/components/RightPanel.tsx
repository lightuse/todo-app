/**
 * RightPanelコンポーネントのプロパティ型定義
 * @interface Props
 */
type Props = {
  /** パネル内に表示する子要素（オプション） */
  children?: React.ReactNode;
};

/**
 * 右側のサイドパネルを表示するコンテナーコンポーネント
 * @param props - RightPanelコンポーネントのプロパティ
 * @returns JSX.Element
 * @description アプリケーションの右側に配置されるサイドパネルのラッパーコンポーネント
 */
export default function RightPanel({ children }: Props) {
  return <aside className="right-panel">{children}</aside>;
}
