type Props = {
  children?: React.ReactNode;
};

export default function RightPanel({ children }: Props) {
  return <aside className="right-panel">{children}</aside>;
}
