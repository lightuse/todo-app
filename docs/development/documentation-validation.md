# Documentation Validation Guide

プロジェクトドキュメントの品質と整合性を保つための検証手順書です。

## 🎯 概要

このガイドでは、Todo Appプロジェクトのすべてのドキュメントが正しく、最新で、整合性が取れていることを確認するための体系的な検証手順を説明します。

## 📋 検証チェックリスト

### Phase 1: 基本構造の検証

#### 1.1 プロジェクト構造確認
```bash
# プロジェクトルートでの確認
ls -la

# 必須ディレクトリの存在確認
[ -d "docs" ] && echo "✅ docs directory exists" || echo "❌ docs directory missing"
[ -d "frontend" ] && echo "✅ frontend directory exists" || echo "❌ frontend directory missing"
[ -d "backend" ] && echo "✅ backend directory exists" || echo "❌ backend directory missing"
[ -d "client" ] && echo "✅ client directory exists" || echo "❌ client directory missing"

# 重要ファイルの存在確認
[ -f "README.md" ] && echo "✅ Main README exists" || echo "❌ Main README missing"
[ -f "docs/config/mkdocs.yml" ] && echo "✅ MkDocs config exists" || echo "❌ MkDocs config missing"
```

#### 1.2 ドキュメントファイル一覧
```bash
# 全マークダウンファイルの検索
find . -name "*.md" -type f | grep -v node_modules | grep -v venv | sort

# 期待される最小ファイルセット
expected_files=(
    "README.md"
    "docs/index.md"
    "docs/modal-accessibility.md"
    "docs/getting-started/installation.md"
    "docs/getting-started/quick-start.md"
    "docs/frontend/architecture.md"
    "docs/frontend/components.md"
    "docs/frontend/testing.md"
    "docs/backend/api.md"
    "docs/backend/database.md"
    "docs/backend/models.md"
    "docs/development/setup.md"
    "docs/development/sphinx-setup.md"
    "docs/development/sphinx-quick-ref.md"
    "docs/development/contributing.md"
    "docs/development/deployment.md"
    "docs/api/index.md"
    "frontend/README.md"
    "frontend/TESTING.md"
    "backend/README.md"
)

# ファイル存在確認
for file in "${expected_files[@]}"; do
    [ -f "$file" ] && echo "✅ $file" || echo "❌ $file MISSING"
done
```

### Phase 2: MkDocs設定と構造検証

#### 2.1 MkDocs設定検証
```bash
# MkDocs設定の構文チェック
python3 -c "import yaml; yaml.safe_load(open('mkdocs.yml'))" && echo "✅ mkdocs.yml syntax OK" || echo "❌ mkdocs.yml syntax error"

# MkDocs設定内のファイル参照確認
grep -E "^\s*-\s+.*\.md" mkdocs.yml | sed 's/.*: //' | while read file; do
    if [ -f "docs/$file" ]; then
        echo "✅ docs/$file exists"
    else
        echo "❌ docs/$file referenced in mkdocs.yml but missing"
    fi
done
```

#### 2.2 MkDocsビルド検証
```bash
# ストリクトモードでのビルド（警告でも失敗）
mkdocs build --strict

# ビルド結果の確認
if [ $? -eq 0 ]; then
    echo "✅ MkDocs build successful"
    echo "📊 Generated files:"
    ls -la site/
else
    echo "❌ MkDocs build failed"
    echo "🔍 Check the errors above for missing files or broken links"
fi
```

#### 2.3 MkDocsサーバーテスト
```bash
# 開発サーバーの起動テスト（バックグラウンドで5秒間）
mkdocs serve --dev-addr=127.0.0.1:8001 &
SERVER_PID=$!
sleep 5

# サーバーレスポンス確認
if curl -s http://127.0.0.1:8001/ > /dev/null; then
    echo "✅ MkDocs server responding"
else
    echo "❌ MkDocs server not responding"
fi

# サーバー停止
kill $SERVER_PID 2>/dev/null
```

### Phase 3: APIドキュメント検証

#### 3.1 TypeScript APIドキュメント生成
```bash
cd frontend

# TypeDoc実行前の準備確認
[ -f "package.json" ] && echo "✅ package.json exists" || echo "❌ package.json missing"
[ -f "tsconfig.json" ] && echo "✅ tsconfig.json exists" || echo "❌ tsconfig.json missing"

# 依存関係確認
if command -v pnpm &> /dev/null; then
    echo "✅ pnpm available"
else
    echo "❌ pnpm not available"
    exit 1
fi

# TypeDoc実行
echo "🔧 Generating TypeScript API documentation..."
pnpm run typedoc

# 生成結果確認
if [ -f "../docs/api/typescript/index.html" ]; then
    echo "✅ TypeScript API documentation generated"
    echo "📄 Files generated:"
    ls -la ../docs/api/typescript/ | head -10
else
    echo "❌ TypeScript API documentation generation failed"
fi

cd ..
```

#### 3.2 Python APIドキュメント生成
```bash
cd backend

# Sphinx実行前の準備確認
[ -f "conf.py" ] && echo "✅ conf.py exists" || echo "❌ conf.py missing"
[ -f "build-sphinx.py" ] && echo "✅ build-sphinx.py exists" || echo "❌ build-sphinx.py missing"

# Python環境確認
if command -v python3 &> /dev/null; then
    echo "✅ python3 available"
else
    echo "❌ python3 not available"
    exit 1
fi

# Sphinx実行
echo "🔧 Generating Python API documentation..."
python3 build-sphinx.py

# 生成結果をdocsフォルダにコピー
cp -r _build/html/* ../docs/api/python/

# 生成結果確認
if [ -f "../docs/api/python/index.html" ]; then
    echo "✅ Python API documentation generated"
    echo "📄 Files generated:"
    ls -la ../docs/api/python/ | head -10
else
    echo "❌ Python API documentation generation failed"
fi

cd ..
```

### Phase 4: コンテンツ整合性検証

#### 4.1 技術スタック情報の整合性
```bash
echo "🔍 Checking technology stack consistency..."

# README.mdから技術情報を抽出
echo "Main README.md:"
grep -E "(React|TypeScript|FastAPI|SQLAlchemy)" README.md | head -5

# Frontend READMEから技術情報を抽出
echo "Frontend README.md:"
grep -E "(React|TypeScript|Vite)" frontend/README.md | head -3

# Backend READMEから技術情報を抽出
echo "Backend README.md:"
grep -E "(FastAPI|SQLAlchemy|Python)" backend/README.md | head -3

# package.jsonのバージョン確認
echo "Package versions:"
grep -E '"(react|typescript|vite|fastapi)"' frontend/package.json || echo "No exact matches in package.json"
```

#### 4.2 リンク整合性チェック
```bash
echo "🔗 Checking internal links..."

# README.mdの相対リンクチェック
echo "Checking README.md links:"
grep -oE '\[.*\]\([^)]+\.md\)' README.md | while read link; do
    file=$(echo "$link" | sed 's/.*(\([^)]*\)).*/\1/' | sed 's|^\./||')
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (referenced in README.md)"
    fi
done

# ドキュメント間の相互リンクチェック
echo "Checking cross-references in docs:"
find docs -name "*.md" -exec grep -l "\.md)" {} \; | while read doc; do
    echo "Links in $doc:"
    grep -oE '\[.*\]\([^)]+\.md\)' "$doc" | head -3
done
```

#### 4.3 コードサンプル整合性
```bash
echo "📝 Checking code sample consistency..."

# README.mdのコマンドサンプル確認
echo "Commands in README.md:"
grep -A 1 -B 1 "```bash" README.md | grep -E "(pnpm|uvicorn|python)" | head -5

# Frontend READMEのコマンド確認
echo "Commands in frontend/README.md:"
grep -A 2 "```bash" frontend/README.md | grep -E "(pnpm|npm)" | head -3

# 実際のpackage.jsonスクリプトとの比較
echo "Actual scripts in package.json:"
grep -A 10 '"scripts"' frontend/package.json | grep -E '"(dev|build|test)"'
```

### Phase 5: 自動化されたテスト

#### 5.1 包括的検証スクリプト
```bash
#!/bin/bash
# 保存先: scripts/validate-docs.sh

set -e  # エラー時に停止

echo "🚀 Starting comprehensive documentation validation..."

# 全チェック項目のカウンター
TOTAL_CHECKS=0
PASSED_CHECKS=0

check_result() {
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    if [ $1 -eq 0 ]; then
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        echo "✅ $2"
    else
        echo "❌ $2"
    fi
}

# Phase 1: Basic structure
echo "📁 Phase 1: Basic Structure Validation"
[ -f "README.md" ] && check_result 0 "Main README exists" || check_result 1 "Main README missing"
[ -f "mkdocs.yml" ] && check_result 0 "MkDocs config exists" || check_result 1 "MkDocs config missing"
[ -d "docs" ] && check_result 0 "docs directory exists" || check_result 1 "docs directory missing"

# Phase 2: MkDocs validation
echo "🏗️ Phase 2: MkDocs Validation"
mkdocs build --strict > /dev/null 2>&1
check_result $? "MkDocs build (strict mode)"

# Phase 3: API documentation
echo "📚 Phase 3: API Documentation"
if [ -f "docs/api/typescript/index.html" ]; then
    check_result 0 "TypeScript API docs exist"
else
    cd frontend && pnpm run typedoc > /dev/null 2>&1
    check_result $? "TypeScript API docs generation"
    cd ..
fi

if [ -f "docs/api/python/index.html" ]; then
    check_result 0 "Python API docs exist"
else
    cd backend && python3 build-sphinx.py > /dev/null 2>&1 && cp -r _build/html/* ../docs/api/python/
    check_result $? "Python API docs generation"
    cd ..
fi

# 結果サマリー
echo ""
echo "📊 Validation Summary:"
echo "✅ Passed: $PASSED_CHECKS/$TOTAL_CHECKS checks"

if [ $PASSED_CHECKS -eq $TOTAL_CHECKS ]; then
    echo "🎉 All documentation validation checks passed!"
    exit 0
else
    echo "⚠️ Some checks failed. Please review the errors above."
    exit 1
fi
```

### Phase 6: 継続的インテグレーション

#### 6.1 GitHub Actions ワークフロー
```yaml
# 保存先: .github/workflows/docs-validation.yml
name: Documentation Validation

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
    paths: 
      - 'docs/**'
      - 'README.md'
      - 'mkdocs.yml'
      - 'frontend/README.md'
      - 'backend/README.md'

jobs:
  validate-docs:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout repository
      uses: actions/checkout@v3
      
    - name: Setup Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'
        
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install Python dependencies
      run: |
        pip install mkdocs mkdocs-material
        cd backend && pip install -r requirements.txt
        
    - name: Install pnpm
      run: npm install -g pnpm
      
    - name: Install Node.js dependencies
      run: cd frontend && pnpm install
      
    - name: Validate MkDocs build
      run: mkdocs build --strict
      
    - name: Generate TypeScript API docs
      run: cd frontend && pnpm run typedoc
      
    - name: Generate Python API docs
      run: |
        cd backend
        python build-sphinx.py
        cp -r _build/html/* ../docs/api/python/
        
    - name: Run comprehensive validation
      run: |
        chmod +x scripts/validate-docs.sh
        ./scripts/validate-docs.sh
        
    - name: Deploy docs (if main branch)
      if: github.ref == 'refs/heads/main'
      run: mkdocs gh-deploy --force
```

#### 6.2 Pre-commit Hook設定
```bash
# 保存先: .pre-commit-config.yaml
repos:
  - repo: local
    hooks:
      - id: validate-docs
        name: Validate Documentation
        entry: ./scripts/validate-docs.sh
        language: script
        files: '(README\.md|mkdocs\.yml|docs/.*\.md)$'
        require_serial: true
```

### Phase 7: トラブルシューティング

#### 7.1 よくある問題と解決法

**MkDocsビルドエラー**
```bash
# 問題: WARNING - A reference to 'path/file.md' is not found
# 解決: 該当ファイルを作成するか、mkdocs.ymlから参照を削除

# ファイル存在確認
ls -la docs/path/file.md

# mkdocs.ymlの該当行確認
grep -n "file.md" mkdocs.yml
```

**APIドキュメント生成エラー**
```bash
# TypeDoc エラー
cd frontend
pnpm install  # 依存関係再インストール
pnpm run typedoc --help  # オプション確認

# Sphinx エラー
cd backend
pip install -r requirements.txt  # 依存関係再インストール
python build-sphinx.py --help  # オプション確認
```

**リンク切れエラー**
```bash
# 全相対リンクの検索
find docs -name "*.md" -exec grep -l "\.md)" {} \;

# 存在しないリンク先の特定
find docs -name "*.md" -exec grep -H "\.md)" {} \; | while IFS=: read file link; do
    target=$(echo "$link" | sed 's/.*(\([^)]*\)).*/\1/')
    [ -f "docs/$target" ] || echo "Broken link in $file: $target"
done
```

### Phase 8: 定期メンテナンス

#### 8.1 週次チェック項目
```bash
#!/bin/bash
# 週次ドキュメントメンテナンス

echo "📅 Weekly Documentation Maintenance"

# 1. 全ドキュメントのリビルド
mkdocs build --clean

# 2. APIドキュメント更新
cd frontend && pnpm run typedoc && cd ..
cd backend && python3 build-sphinx.py && cp -r _build/html/* ../docs/api/python/ && cd ..

# 3. リンク整合性チェック
./scripts/validate-docs.sh

# 4. 更新日時の確認
echo "Recently modified documentation:"
find docs -name "*.md" -mtime -7 -exec ls -la {} \;

echo "✅ Weekly maintenance completed"
```

#### 8.2 バージョン更新時のチェック
```bash
# パッケージバージョン更新時
echo "🔄 Updating version references in documentation..."

# 新しいバージョンを変数に設定
NEW_REACT_VERSION="19.1.1"
NEW_TYPESCRIPT_VERSION="5.8"
NEW_FASTAPI_VERSION="0.104.1"

# README.mdの更新
sed -i "s/React-[0-9.]*/React-$NEW_REACT_VERSION/g" README.md
sed -i "s/TypeScript-[0-9.]*/TypeScript-$NEW_TYPESCRIPT_VERSION/g" README.md

# その他のドキュメントも同様に更新
find docs -name "*.md" -exec sed -i "s/React [0-9.]*/React $NEW_REACT_VERSION/g" {} \;

echo "✅ Version references updated"
```

## 🔄 継続的改善

### 検証プロセスの改善
1. **メトリクス収集**: ドキュメント品質の定量的評価
2. **自動化拡張**: より包括的な自動チェック
3. **フィードバック循環**: ユーザーからの問題報告を活用

### ドキュメント品質向上
1. **可読性スコア**: 文章の複雑さ分析
2. **完全性チェック**: 機能カバレッジの確認
3. **最新性維持**: コードとドキュメントの同期

この検証手順書に従って、プロジェクトドキュメントの品質と整合性を継続的に保ちます。
