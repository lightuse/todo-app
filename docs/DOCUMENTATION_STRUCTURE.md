# 📝 Documentation Management Guide

このファイルは、Todo Appプロジェクトのドキュメント管理における最新の構成について説明します。

## 🗂️ 新しいディレクトリ構造

### ドキュメント設定ファイルの場所変更

ドキュメント関連の設定ファイルを整理するため、以下のファイルを `docs/config/` ディレクトリに移動しました：

```
docs/
├── config/
│   ├── mkdocs.yml          # MkDocs設定ファイル（旧：プロジェクトルート）
│   └── requirements.txt    # ドキュメント用Python依存関係（旧：プロジェクトルート）
├── index.md
├── modal-accessibility.md
├── api/
├── assets/
├── backend/
├── development/
├── frontend/
└── getting-started/
```

### 設定変更内容

#### mkdocs.yml の調整
```yaml
# 新しい設定
docs_dir: ../          # docs/ディレクトリを参照
site_dir: ../../site   # プロジェクトルートのsite/ディレクトリに出力

plugins:
  - mkdocstrings:
      handlers:
        python:
          paths: [../../backend]  # バックエンドコードへの相対パス
```

## 🛠️ 使用方法

### ドキュメントのビルド

```bash
# MkDocsビルド（新しい方法）
cd docs/config
mkdocs build --strict

# または、プロジェクトルートから
cd docs/config && mkdocs build --strict
```

### ドキュメントサーバーの起動

```bash
# 開発サーバー起動
cd docs/config
mkdocs serve

# または、カスタムアドレスで起動
cd docs/config
mkdocs serve --dev-addr=0.0.0.0:8001
```

### 検証スクリプト

検証スクリプトは新しいファイル場所に自動対応済みです：

```bash
# プロジェクトルートから
./scripts/validate-docs.sh
```

## 🔄 自動化システムの更新

### GitHub Actions
- ワークフローファイルを新しいパスに対応
- ビルドコマンドに `cd docs/config` を追加

### Pre-commit Hooks
- MkDocs設定ファイルのパスを更新
- ビルドコマンドを調整

### 検証スクリプト
- `docs/config/mkdocs.yml` の存在確認
- MkDocsビルド時の作業ディレクトリ変更

## 📋 移行の利点

### 1. **整理された構造**
- ドキュメント関連ファイルの集約
- プロジェクトルートの簡素化

### 2. **明確な責任分離**
- ドキュメント設定の独立性
- メインプロジェクトとの分離

### 3. **保守性の向上**
- 設定ファイルの場所が直感的
- ドキュメント専用の依存関係管理

## 🔧 トラブルシューティング

### MkDocsビルドエラー
```bash
# エラー: Config file 'mkdocs.yml' does not exist
# 解決: 正しいディレクトリに移動してからビルド
cd docs/config
mkdocs build
```

### 相対パスの問題
```bash
# エラー: docs_dirやpathsの設定が正しくない
# 解決: mkdocs.ymlの設定を確認
docs_dir: ../          # docs/ディレクトリ
paths: [../../backend] # バックエンドディレクトリ
```

### GitHub Actionsでのエラー
```yaml
# 作業ディレクトリを設定
- name: Build docs
  run: |
    cd docs/config
    mkdocs build --strict
```

## 📊 影響範囲

### 更新されたファイル
- [x] `docs/config/mkdocs.yml` - MkDocs設定
- [x] `docs/config/requirements.txt` - Python依存関係
- [x] `scripts/validate-docs.sh` - 検証スクリプト
- [x] `.github/workflows/docs-validation.yml` - GitHub Actions
- [x] `.pre-commit-config.yaml` - Pre-commitフック
- [x] `docs/development/documentation-validation.md` - 検証ガイド

### 検証済み項目
- [x] MkDocsビルド成功（strict mode）
- [x] 検証スクリプト実行成功（41/41チェック通過）
- [x] API ドキュメント生成正常
- [x] 全ドキュメントファイル存在確認

## 🎯 今後の運用

### 日常的な使用
```bash
# ドキュメント編集後のビルド確認
cd docs/config && mkdocs build --strict

# 開発サーバーで内容確認
cd docs/config && mkdocs serve

# 包括的検証
./scripts/validate-docs.sh
```

### 継続的インテグレーション
- GitHub Actionsが自動的に新しいパスでビルド
- Pre-commitフックが設定ファイル変更を検知
- デプロイメントも自動対応

この新しい構造により、ドキュメント管理がより整理され、保守しやすくなりました。
