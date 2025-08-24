#!/usr/bin/env python3
"""
Debug script for MkDocs configuration and plugin issues.
This helps diagnose why mkdocstrings plugin might not be found in CI.
"""

import sys
import importlib.util
import pkg_resources
from pathlib import Path

def check_package_installation():
    """Check if required packages are installed."""
    print("🔍 Checking package installation...")
    
    packages = [
        'mkdocs',
        'mkdocs_material', 
        'mkdocstrings',
        'mkdocstrings.plugin'
    ]
    
    for package in packages:
        try:
            if package == 'mkdocstrings.plugin':
                # Special handling for plugin module
                import mkdocstrings.plugin
                print(f"✅ {package} - Available")
            else:
                spec = importlib.util.find_spec(package)
                if spec is not None:
                    module = importlib.import_module(package)
                    version = getattr(module, '__version__', 'unknown')
                    print(f"✅ {package} - Version: {version}")
                else:
                    print(f"❌ {package} - Not found")
        except ImportError as e:
            print(f"❌ {package} - Import error: {e}")
        except Exception as e:
            print(f"⚠️  {package} - Error: {e}")

def check_entry_points():
    """Check if mkdocstrings plugin is registered as an entry point."""
    print("\n🔍 Checking entry points...")
    
    try:
        # Check for mkdocs plugins entry points
        for entry_point in pkg_resources.iter_entry_points('mkdocs.plugins'):
            if 'mkdocstrings' in entry_point.name:
                print(f"✅ Found plugin entry point: {entry_point.name} -> {entry_point.module_name}")
    except Exception as e:
        print(f"❌ Error checking entry points: {e}")

def test_mkdocs_config():
    """Test loading MkDocs configuration."""
    print("\n🔍 Testing MkDocs config loading...")
    
    try:
        import mkdocs.config
        import os
        
        # Change to the correct directory if not already there
        config_path = Path(__file__).parent.parent / "docs" / "config"
        if config_path.exists():
            os.chdir(config_path)
            print(f"📂 Changed to config directory: {config_path}")
        
        config = mkdocs.config.load_config()
        print(f"✅ Config loaded successfully")
        print(f"📄 Site name: {config['site_name']}")
        print(f"🔌 Plugins configured: {list(config['plugins'].keys())}")
        
        # Try to access mkdocstrings plugin specifically
        if 'mkdocstrings' in config['plugins']:
            plugin = config['plugins']['mkdocstrings']
            print(f"✅ mkdocstrings plugin found in config: {type(plugin)}")
        else:
            print("❌ mkdocstrings plugin not found in config")
            
    except Exception as e:
        print(f"❌ Config loading failed: {e}")
        import traceback
        traceback.print_exc()

def main():
    """Main diagnostic function."""
    print("🔧 MkDocs Debug Script")
    print("=" * 50)
    
    print(f"🐍 Python version: {sys.version}")
    print(f"📂 Working directory: {Path.cwd()}")
    print(f"📋 Python path: {sys.path[:3]}...")
    
    check_package_installation()
    check_entry_points()
    test_mkdocs_config()
    
    print("\n" + "=" * 50)
    print("🏁 Debug complete")

if __name__ == "__main__":
    main()
