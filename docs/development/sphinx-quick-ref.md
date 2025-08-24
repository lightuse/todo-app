# Sphinx Quick Reference

Quick commands and examples for Sphinx documentation.

## 🚀 Quick Commands

```bash
# Generate documentation
cd backend && python3 build-sphinx.py

# Manual build (if needed)
sphinx-apidoc -o . . conf.py build-sphinx.py
sphinx-build -b html . _build/html

# Install dependencies
pip install sphinx sphinx-rtd-theme

# Clean build
rm -rf _build/ && python3 build-sphinx.py
```

## 📝 Docstring Template

```python
def function_name(param1: Type1, param2: Type2) -> ReturnType:
    """
    Brief description of the function.
    
    Longer description with more details about the function's
    purpose and behavior.
    
    Args:
        param1 (Type1): Description of parameter 1
        param2 (Type2): Description of parameter 2
        
    Returns:
        ReturnType: Description of return value
        
    Raises:
        ExceptionType: When this exception occurs
        
    Example:
        >>> result = function_name("value1", 42)
        >>> print(result)
        expected_output
    """
```

## 🏗️ Class Template

```python
class ClassName:
    """
    Brief description of the class.
    
    Longer description of the class purpose and usage.
    
    Attributes:
        attr1 (Type): Description of attribute 1
        attr2 (Type): Description of attribute 2
        
    Example:
        >>> obj = ClassName(param="value")
        >>> print(obj.attr1)
        expected_value
    """
    
    def __init__(self, param: str):
        """
        Initialize the class.
        
        Args:
            param (str): Initialization parameter
        """
```

## 📁 Files Overview

| File | Purpose |
|------|---------|
| `conf.py` | Sphinx configuration |
| `index.rst` | Main documentation page |
| `build-sphinx.py` | Automated build script |
| `_static/custom.css` | Custom styling |
| `*.rst` (auto) | Generated module docs |
| `_build/` | HTML output |

## 🔧 Common Fixes

```bash
# Fix import errors
export PYTHONPATH="${PYTHONPATH}:$(pwd)"

# Fix missing dependencies
pip install -r requirements.txt sphinx sphinx-rtd-theme

# Fix build errors
rm -rf _build/ *.rst !index.rst
python3 build-sphinx.py

# Check warnings
sphinx-build -W -b html . _build/html
```

For detailed information, see the [complete Sphinx setup guide](sphinx-setup.md).
