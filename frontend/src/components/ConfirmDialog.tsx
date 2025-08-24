import Modal from './Modal';

/**
 * ConfirmDialogコンポーネントのプロパティ型定義
 */
interface ConfirmDialogProps {
  /** ダイアログの表示状態 */
  isOpen: boolean;
  /** ダイアログを閉じるコールバック関数 */
  onClose: () => void;
  /** 確認時のコールバック関数 */
  onConfirm: () => void;
  /** ダイアログのタイトル */
  title: string;
  /** 確認メッセージ */
  message: string;
  /** 確認ボタンのテキスト（デフォルト: "確認"） */
  confirmText?: string;
  /** キャンセルボタンのテキスト（デフォルト: "キャンセル"） */
  cancelText?: string;
  /** 危険な操作かどうか（デフォルト: false） */
  variant?: 'default' | 'danger';
}

/**
 * アクセシブルな確認ダイアログコンポーネント
 * @param props - ConfirmDialogコンポーネントのプロパティ
 * @returns JSX.Element
 * @description モーダルベースの確認ダイアログ。キーボードナビゲーションとスクリーンリーダーに対応
 */
export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '確認',
  cancelText = 'キャンセル',
  variant = 'default'
}: ConfirmDialogProps) {
  
  /**
   * 確認ボタンクリック時の処理
   */
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  /**
   * Enterキーで確認、Escapeキーでキャンセル
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.target === e.currentTarget) {
      e.preventDefault();
      handleConfirm();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="confirm-dialog" onKeyDown={handleKeyDown}>
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button
            className="btn"
            onClick={onClose}
            type="button"
          >
            {cancelText}
          </button>
          <button
            className={`btn ${variant === 'danger' ? 'danger' : 'primary'}`}
            onClick={handleConfirm}
            type="button"
            autoFocus
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
