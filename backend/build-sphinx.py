#!/usr/bin/env python3
"""
Sphinx documentation build script for Todo App Backend.

This script generates API documentation from Python docstrings using Sphinx
and converts it for integration with MKDocs.
"""

import os
import subprocess
import shutil
import sys
from pathlib import Path

# HTML template for redirect page
REDIRECT_HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Python API Documentation</title>
    <meta http-equiv="refresh" content="0; url=index.html">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background-color: #f5f5f5;
        }
        .container {
            text-align: center;
            padding: 2rem;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        a {
            color: #3498db;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="spinner"></div>
        <h1>Python API Documentation</h1>
        <p>Redirecting to the documentation...</p>
        <p>If you are not redirected automatically, <a href="index.html">click here</a>.</p>
    </div>
</body>
</html>
"""

def run_command(command, cwd=None):
    """Run a command and handle errors."""
    print(f"Running: {command}")
    try:
        result = subprocess.run(
            command, 
            shell=True, 
            check=True, 
            capture_output=True, 
            text=True,
            cwd=cwd
        )
        if result.stdout:
            print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {command}")
        print(f"Error: {e.stderr}")
        return False

def main():
    """Main function to build Sphinx documentation."""
    # Get the backend directory
    backend_dir = Path(__file__).parent
    docs_dir = backend_dir.parent / "docs" / "api" / "python"
    
    print("🐍 Starting Python API documentation generation...")
    
    # Create the output directory
    docs_dir.mkdir(parents=True, exist_ok=True)
    
    # Change to backend directory
    os.chdir(backend_dir)
    
    # Generate modules.rst automatically
    print("📝 Generating modules.rst...")
    if not run_command("sphinx-apidoc -o . . conf.py build-sphinx.py", cwd=backend_dir):
        print("❌ Failed to generate modules.rst")
        return False
    
    # Build HTML documentation
    print("🔨 Building HTML documentation...")
    build_dir = backend_dir / "_build" / "html"
    if not run_command(f"sphinx-build -b html . {build_dir}", cwd=backend_dir):
        print("❌ Failed to build HTML documentation")
        return False
    
    # Copy built documentation to docs directory
    if build_dir.exists():
        print(f"📋 Copying documentation to {docs_dir}...")
        if docs_dir.exists():
            shutil.rmtree(docs_dir)
        shutil.copytree(build_dir, docs_dir)
        
        # Create a simple index.html that redirects to the main page
        index_content = REDIRECT_HTML_TEMPLATE
        
        # Write the redirect page
        with open(docs_dir / "redirect.html", "w") as f:
            f.write(index_content)
        
        print("✅ Python API documentation generated successfully!")
        print(f"📄 Documentation available at: {docs_dir}")
        
        # List generated files
        html_files = list(docs_dir.glob("*.html"))
        print(f"📊 Generated {len(html_files)} HTML files")
        
        return True
    else:
        print("❌ Build directory not found")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
