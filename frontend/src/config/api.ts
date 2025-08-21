/**
 * APIベースURL
 * 
 * @description 環境変数VITE_API_BASE_URLから取得するAPIのベースURL。
 * 環境変数が設定されていない場合は、開発用のlocalhostを使用します。
 * 
 * @example
 * ```bash
 * # 環境変数設定例
 * VITE_API_BASE_URL=https://api.example.com
 * ```
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';