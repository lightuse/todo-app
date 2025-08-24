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
        index_content = """<!DOCTYPE html>
<html>
<head>
    <title>Python API Documentation</title>
    <meta http-equiv="refresh" content="0; url=index.html">
    <link rel="canonical" href="index.html">
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            text-align: center; 
        }
        .loading { 
            background: #f5f5f5; 
            padding: 20px; 
            border-radius: 5px; 
        }
    </style>
</head>
<body>
    <div class="loading">
        <h1>Python API Documentation</h1>
        <p>Redirecting to API documentation...</p>
        <p><a href="index.html">Click here if you are not redirected automatically</a></p>
    </div>
</body>
</html>"""
        
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
