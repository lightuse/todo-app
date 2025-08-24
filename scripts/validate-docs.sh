#!/bin/bash
# ドキュメント検証スクリプト
# Usage: ./scripts/validate-docs.sh

set -e  # エラー時に停止

# 色付きの出力用
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting comprehensive documentation validation...${NC}"

# 全チェック項目のカウンター
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=()

check_result() {
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    if [ $1 -eq 0 ]; then
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        FAILED_CHECKS+=("$2")
    fi
}

info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Phase 1: Basic Structure Validation
echo -e "\n${BLUE}📁 Phase 1: Basic Structure Validation${NC}"
echo "================================================"

[ -f "README.md" ] && check_result 0 "Main README.md exists" || check_result 1 "Main README.md missing"
[ -f "docs/config/mkdocs.yml" ] && check_result 0 "MkDocs config exists" || check_result 1 "MkDocs config missing"
[ -d "docs" ] && check_result 0 "docs directory exists" || check_result 1 "docs directory missing"
[ -d "frontend" ] && check_result 0 "frontend directory exists" || check_result 1 "frontend directory missing"
[ -d "backend" ] && check_result 0 "backend directory exists" || check_result 1 "backend directory missing"

# 期待されるドキュメントファイルの確認
expected_files=(
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

info "Checking expected documentation files..."
for file in "${expected_files[@]}"; do
    [ -f "$file" ] && check_result 0 "$file exists" || check_result 1 "$file missing"
done

# Phase 2: MkDocs Validation
echo -e "\n${BLUE}🏗️ Phase 2: MkDocs Validation${NC}"
echo "===================================="

# MkDocs設定の構文チェック
python3 -c "import yaml; yaml.safe_load(open('docs/config/mkdocs.yml'))" 2>/dev/null
check_result $? "mkdocs.yml syntax validation"

# MkDocsビルドテスト
info "Testing MkDocs build (strict mode)..."
cd docs/config
if mkdocs build --strict >/dev/null 2>&1; then
    check_result 0 "MkDocs build (strict mode)"
else
    check_result 1 "MkDocs build failed (strict mode)"
    warning "Running non-strict build for more details..."
    mkdocs build 2>&1 | head -10
fi
cd ../..

# site/ディレクトリの確認
[ -d "site" ] && check_result 0 "site directory generated" || check_result 1 "site directory not generated"

# Phase 3: API Documentation Validation
echo -e "\n${BLUE}📚 Phase 3: API Documentation Validation${NC}"
echo "=============================================="

# TypeScript APIドキュメント確認
if [ -f "docs/api/typescript/index.html" ]; then
    check_result 0 "TypeScript API docs exist"
    # ファイル更新時間の確認
    typescript_age=$(find docs/api/typescript -name "index.html" -mtime +7 2>/dev/null | wc -l)
    if [ "$typescript_age" -gt 0 ]; then
        warning "TypeScript API docs are older than 7 days"
    fi
else
    warning "TypeScript API docs missing - attempting to generate..."
    if [ -d "frontend" ] && [ -f "frontend/package.json" ]; then
        cd frontend
        if command -v pnpm &> /dev/null; then
            pnpm run typedoc >/dev/null 2>&1
            check_result $? "TypeScript API docs generation"
        else
            check_result 1 "pnpm not available for TypeScript docs generation"
        fi
        cd ..
    else
        check_result 1 "Frontend directory or package.json missing"
    fi
fi

# Python APIドキュメント確認
if [ -f "docs/api/python/index.html" ]; then
    check_result 0 "Python API docs exist"
    # ファイル更新時間の確認
    python_age=$(find docs/api/python -name "index.html" -mtime +7 2>/dev/null | wc -l)
    if [ "$python_age" -gt 0 ]; then
        warning "Python API docs are older than 7 days"
    fi
else
    warning "Python API docs missing - attempting to generate..."
    if [ -d "backend" ] && [ -f "backend/build-sphinx.py" ]; then
        cd backend
        if command -v python3 &> /dev/null; then
            python3 build-sphinx.py >/dev/null 2>&1 && cp -r _build/html/* ../docs/api/python/ 2>/dev/null
            check_result $? "Python API docs generation"
        else
            check_result 1 "python3 not available for Python docs generation"
        fi
        cd ..
    else
        check_result 1 "Backend directory or build-sphinx.py missing"
    fi
fi

# Phase 4: Content Consistency Validation
echo -e "\n${BLUE}📝 Phase 4: Content Consistency Validation${NC}"
echo "==============================================="

# 技術スタック情報の存在確認
info "Checking technology stack mentions..."
react_mentions=$(grep -c "React" README.md 2>/dev/null || echo 0)
typescript_mentions=$(grep -c "TypeScript" README.md 2>/dev/null || echo 0)
fastapi_mentions=$(grep -c "FastAPI" README.md 2>/dev/null || echo 0)

[ "$react_mentions" -gt 0 ] && check_result 0 "React mentioned in README" || check_result 1 "React not mentioned in README"
[ "$typescript_mentions" -gt 0 ] && check_result 0 "TypeScript mentioned in README" || check_result 1 "TypeScript not mentioned in README"
[ "$fastapi_mentions" -gt 0 ] && check_result 0 "FastAPI mentioned in README" || check_result 1 "FastAPI not mentioned in README"

# リンク整合性の基本チェック
info "Checking internal links..."
broken_links=0

# README.mdの相対リンクチェック
if [ -f "README.md" ]; then
    while IFS= read -r line; do
        # 正規表現でマークダウンリンクを検索
        if echo "$line" | grep -q '\[.*\](.*\.md)'; then
            # sedでリンク部分を抽出
            links=$(echo "$line" | grep -o '\[.*\](.*\.md)' | sed 's/.*(\([^)]*\)).*/\1/')
            for link in $links; do
                # 相対パスを正規化
                link="${link#./}"
                if [ ! -f "$link" ]; then
                    warning "Broken link in README.md: $link"
                    broken_links=$((broken_links + 1))
                fi
            done
        fi
    done < README.md
fi

[ "$broken_links" -eq 0 ] && check_result 0 "No broken links in README.md" || check_result 1 "$broken_links broken links found in README.md"

# Phase 5: File Permissions and Format
echo -e "\n${BLUE}🔒 Phase 5: File Permissions and Format${NC}"
echo "=========================================="

# 実行可能ファイルの確認
[ -x "scripts/validate-docs.sh" ] && check_result 0 "validate-docs.sh is executable" || {
    warning "Making validate-docs.sh executable..."
    chmod +x "scripts/validate-docs.sh" 2>/dev/null
    check_result $? "validate-docs.sh made executable"
}

# マークダウンファイルのBOMチェック
bom_files=0
while IFS= read -r -d '' file; do
    if file "$file" | grep -q "UTF-8 Unicode (with BOM)"; then
        warning "BOM detected in: $file"
        bom_files=$((bom_files + 1))
    fi
done < <(find . -name "*.md" -print0 2>/dev/null)

[ "$bom_files" -eq 0 ] && check_result 0 "No BOM in markdown files" || check_result 1 "$bom_files files with BOM detected"

# 改行文字の確認 (CRLF vs LF)
crlf_files=$(find . -name "*.md" -exec file {} \; 2>/dev/null | grep -c "CRLF" || echo 0)
[ "$crlf_files" -eq 0 ] && check_result 0 "No CRLF line endings in markdown files" || warning "$crlf_files files with CRLF line endings"

# Phase 6: 依存関係と環境確認
echo -e "\n${BLUE}🛠️  Phase 6: Dependencies and Environment${NC}"
echo "============================================="

# 必要なコマンドの存在確認
commands=("python3" "mkdocs" "pnpm" "git")
for cmd in "${commands[@]}"; do
    if command -v "$cmd" &> /dev/null; then
        check_result 0 "$cmd is available"
        # バージョン表示
        version=$($cmd --version 2>&1 | head -1 | cut -d' ' -f2-3 2>/dev/null || echo "unknown")
        info "$cmd version: $version"
    else
        check_result 1 "$cmd is not available"
    fi
done

# Python依存関係の確認
if [ -f "backend/requirements.txt" ]; then
    info "Checking Python dependencies..."
    missing_packages=0
    while IFS= read -r package; do
        # コメント行とバージョン指定を除去
        package=$(echo "$package" | sed 's/#.*//' | sed 's/[>=<].*//' | tr -d '[:space:]')
        if [ -n "$package" ]; then
            if python3 -c "import $package" 2>/dev/null; then
                # 成功時は何もしない（出力が多くなりすぎるため）
                true
            else
                warning "Python package not available: $package"
                missing_packages=$((missing_packages + 1))
            fi
        fi
    done < backend/requirements.txt
    
    [ "$missing_packages" -eq 0 ] && check_result 0 "All Python packages available" || check_result 1 "$missing_packages Python packages missing"
fi

# Node.js依存関係の確認
if [ -f "frontend/package.json" ] && command -v pnpm &> /dev/null; then
    cd frontend
    if [ -d "node_modules" ]; then
        check_result 0 "Node.js dependencies installed"
    else
        warning "Node.js dependencies not installed"
        check_result 1 "Node.js dependencies missing"
    fi
    cd ..
fi

# 結果サマリー
echo -e "\n${BLUE}📊 Validation Summary${NC}"
echo "====================="
echo -e "✅ Passed: ${GREEN}$PASSED_CHECKS${NC}/$TOTAL_CHECKS checks"

if [ ${#FAILED_CHECKS[@]} -gt 0 ]; then
    echo -e "❌ Failed checks:"
    for failed in "${FAILED_CHECKS[@]}"; do
        echo -e "   ${RED}- $failed${NC}"
    done
fi

# 推奨アクション
echo -e "\n${BLUE}💡 Recommendations${NC}"
echo "=================="

if [ ! -f "docs/api/typescript/index.html" ]; then
    echo "• Generate TypeScript API docs: cd frontend && pnpm run typedoc"
fi

if [ ! -f "docs/api/python/index.html" ]; then
    echo "• Generate Python API docs: cd backend && python3 build-sphinx.py && cp -r _build/html/* ../docs/api/python/"
fi

if [ "$broken_links" -gt 0 ]; then
    echo "• Fix broken links in documentation files"
fi

if [ ! -d ".git/hooks" ] || [ ! -f ".git/hooks/pre-commit" ]; then
    echo "• Consider setting up pre-commit hooks for automated validation"
fi

# 最終結果
echo ""
if [ $PASSED_CHECKS -eq $TOTAL_CHECKS ]; then
    echo -e "${GREEN}🎉 All documentation validation checks passed!${NC}"
    exit 0
else
    failed_count=$((TOTAL_CHECKS - PASSED_CHECKS))
    echo -e "${RED}⚠️  $failed_count/$TOTAL_CHECKS checks failed. Please review the errors above.${NC}"
    exit 1
fi
