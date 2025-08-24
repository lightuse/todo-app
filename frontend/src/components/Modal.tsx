import { useEffect, useRef } from 'react';
import '../styles/Modal.css';

/**
 * Modalコンポーネントのプロパティ型定義
 */
interface ModalProps {
  /** モーダルの表示状態 */
  isOpen: boolean;
  /** モーダルを閉じるコールバック関数 */
  onClose: () => void;
  /** モーダルのタイトル */
  title: string;
  /** モーダルの内容 */
  children: React.ReactNode;
}

/**
 * アクセシブルなモーダルダイアログコンポーネント
 * @param props - Modalコンポーネントのプロパティ
 * @returns JSX.Element | null
 * @description WAI-ARIA標準に準拠したモーダルダイアログ。キーボードナビゲーションとスクリーンリーダーをサポート
 */
export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // モーダルを開く時：現在のフォーカス要素を記録し、モーダルにフォーカスを移動
      previousFocusRef.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();
    } else {
      // モーダルを閉じる時：以前のフォーカス位置に戻す
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    /**
     * Escapeキーでモーダルを閉じる
     */
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    /**
     * フォーカストラップ - Tabキーでのフォーカス移動をモーダル内に制限
     */
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const modal = modalRef.current;
      if (!modal) return;

      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        // Shift+Tab: 最初の要素でバックタブした場合、最後の要素に移動
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab: 最後の要素でタブした場合、最初の要素に移動
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleTab);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTab);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  /**
   * オーバーレイクリックでモーダルを閉じる（背景クリック）
   */
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
      aria-describedby="modal-body"
    >
      <div
        ref={modalRef}
        className="modal-content"
        tabIndex={-1}
        aria-labelledby="modal-title"
        role="document"
      >
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">
            {title}
          </h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="モーダルを閉じる"
            type="button"
          >
            ✕
          </button>
        </div>
        <div id="modal-body" className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}
