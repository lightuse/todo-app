# Sphinx Documentation Setup

This guide explains how to set up and generate Python API documentation using Sphinx for the Todo App backend.

## 📋 Overview

Sphinx is used to automatically generate comprehensive API documentation from Python docstrings in the backend code. The generated documentation is integrated into the MKDocs site and deployed to GitHub Pages.

## 🏗️ Architecture

```
backend/
├── conf.py              # Sphinx configuration
├── index.rst            # Main documentation page
├── build-sphinx.py      # Build automation script
├── _static/             # Custom CSS and assets
├── _build/              # Generated documentation (ignored)
├── *.rst                # Auto-generated module docs (ignored)
└── *.py                 # Source code with docstrings
```

## 🚀 Quick Start

### Prerequisites

```bash
# Install required packages
pip install sphinx sphinx-rtd-theme
```

### Generate Documentation

```bash
cd backend
python3 build-sphinx.py
```

The generated documentation will be available at `../docs/api/python/`.

## 📝 Writing Documentation

### Docstring Format

Use Google-style docstrings for consistency:

```python
def create_todo(todo: schemas.TodoCreate, db: Session = Depends(get_db)):
    """
    Create a new Todo item.
    
    This endpoint creates a new Todo item in the database with the provided
    information. The Todo will be assigned a unique ID automatically.
    
    Args:
        todo (schemas.TodoCreate): The Todo data to create
        db (Session): Database session dependency
        
    Returns:
        schemas.Todo: The created Todo item with assigned ID
        
    Raises:
        HTTPException: If the Todo creation fails
        
    Example:
        >>> todo_data = TodoCreate(title="Learn Python", completed=False)
        >>> created_todo = create_todo(todo_data, db)
        >>> print(created_todo.id)
        1
    """
    # Implementation here...
```

### Class Documentation

```python
class Todo(Base):
    """
    Todo item database model.
    
    This class represents a Todo item in the database with support for
    title, completion status, and tags.
    
    Attributes:
        id (int): Unique identifier for the Todo item
        title (str): The Todo item title
        completed (bool): Completion status
        tags (list[str]): List of associated tags
        
    Example:
        >>> todo = Todo(title="Learn SQLAlchemy", completed=False)
        >>> todo.tags = ["learning", "database"]
        >>> print(todo.title)
        Learn SQLAlchemy
    """
```

## ⚙️ Configuration

### Sphinx Configuration (`conf.py`)

Key settings:

```python
# Extensions for enhanced documentation
extensions = [
    'sphinx.ext.autodoc',      # Automatic documentation from docstrings
    'sphinx.ext.viewcode',     # Add source code links
    'sphinx.ext.napoleon',     # Google/NumPy docstring support
    'sphinx.ext.intersphinx',  # Cross-referencing
]

# Napoleon settings for Google-style docstrings
napoleon_google_docstring = True
napoleon_numpy_docstring = True
napoleon_include_init_with_doc = False
```

### Auto-documentation Settings

```python
autodoc_default_options = {
    'members': True,                # Document all members
    'member-order': 'bysource',     # Order by source code
    'special-members': '__init__',  # Include __init__ methods
    'undoc-members': True,          # Include undocumented members
}
```

## 🔨 Build Process

### Manual Build

```bash
cd backend

# Step 1: Generate RST files from Python modules
sphinx-apidoc -o . . conf.py build-sphinx.py

# Step 2: Build HTML documentation
sphinx-build -b html . _build/html

# Step 3: Copy to MKDocs integration directory
cp -r _build/html/* ../docs/api/python/
```

### Automated Build Script

The `build-sphinx.py` script automates the entire process:

```python
#!/usr/bin/env python3
def main():
    # Generate modules.rst automatically
    run_command("sphinx-apidoc -o . . conf.py build-sphinx.py")
    
    # Build HTML documentation
    run_command("sphinx-build -b html . _build/html")
    
    # Copy to integration directory
    shutil.copytree(build_dir, docs_dir)
```

### GitHub Actions Integration

The documentation is automatically generated in CI/CD:

```yaml
- name: Generate Python documentation
  run: |
    cd backend
    python3 build-sphinx.py
    
    # Verify generation
    if [ -f "../docs/api/python/index.html" ]; then
      echo "✅ Sphinx documentation generated successfully"
    else
      echo "❌ Sphinx generation failed"
      exit 1
    fi
```

## 📁 File Structure

### Source Files

- **`conf.py`**: Main Sphinx configuration
- **`index.rst`**: Documentation homepage
- **`build-sphinx.py`**: Automated build script
- **`_static/custom.css`**: Custom styling

### Generated Files (Ignored by Git)

- **`modules.rst`**: Auto-generated module index
- **`*.rst`**: Individual module documentation
- **`_build/`**: HTML output directory
- **`.buildinfo`**: Build metadata

### Integration Files

- **`../docs/api/python/`**: Final documentation location
- **Integrated into MKDocs**: Accessible via `/api/python/`

## 🎨 Customization

### Custom CSS

Add custom styling in `_static/custom.css`:

```css
/* Custom API documentation styling */
.sig-name {
    color: #d73a49;
    font-weight: bold;
}

.todo-endpoint {
    background: #e8f5e8;
    border-left: 4px solid #28a745;
    padding: 15px;
    margin: 15px 0;
}
```

### Theme Configuration

```python
html_theme = 'sphinx_rtd_theme'
html_theme_options = {
    'canonical_url': '',
    'display_version': True,
    'prev_next_buttons_location': 'bottom',
    'style_nav_header_background': '#2980B9',
    'collapse_navigation': False,
    'sticky_navigation': True,
}
```

## 🔍 Best Practices

### 1. Docstring Quality

- ✅ **Complete**: Document all parameters, return values, and exceptions
- ✅ **Clear**: Use simple, descriptive language
- ✅ **Examples**: Provide practical usage examples
- ✅ **Consistent**: Use Google-style format throughout

### 2. Type Annotations

```python
def process_todos(
    todos: List[schemas.Todo], 
    filter_tag: Optional[str] = None
) -> List[schemas.Todo]:
    """Process a list of todos with optional filtering."""
```

### 3. Cross-References

```python
"""
See Also:
    :class:`Todo`: The main Todo model
    :func:`create_todo`: For creating new todos
    :mod:`schemas`: Pydantic validation schemas
"""
```

### 4. Error Documentation

```python
"""
Raises:
    HTTPException: When todo_id is not found (404)
    ValidationError: When input data is invalid (422)
    DatabaseError: When database operation fails (500)
"""
```

## 🚨 Troubleshooting

### Common Issues

1. **Import Errors**
   ```bash
   # Ensure Python path includes the backend directory
   export PYTHONPATH="${PYTHONPATH}:$(pwd)"
   ```

2. **Missing Dependencies**
   ```bash
   pip install -r requirements.txt
   pip install sphinx sphinx-rtd-theme
   ```

3. **Build Failures**
   ```bash
   # Clean build directory and retry
   rm -rf _build/
   python3 build-sphinx.py
   ```

4. **Docstring Warnings**
   ```python
   # Add missing docstrings or use autodoc_mock_imports
   autodoc_mock_imports = ['external_module']
   ```

### Debug Mode

```bash
# Build with verbose output
sphinx-build -v -b html . _build/html

# Check for warnings
sphinx-build -W -b html . _build/html
```

## 🔄 Maintenance

### Updating Documentation

1. **Edit Docstrings**: Update docstrings in source code
2. **Rebuild**: Run `python3 build-sphinx.py`
3. **Review**: Check generated HTML in `../docs/api/python/`
4. **Deploy**: Push changes trigger GitHub Actions

### Adding New Modules

1. **Create Module**: Add new `.py` file with proper docstrings
2. **Auto-detect**: `sphinx-apidoc` will automatically include it
3. **Manual Include**: Optionally add to `index.rst` manually

### Configuration Updates

Edit `conf.py` for:
- New extensions
- Theme customization
- Cross-reference mappings
- Output formatting

## 📚 Resources

- [Sphinx Documentation](https://www.sphinx-doc.org/)
- [Google Style Docstrings](https://sphinxcontrib-napoleon.readthedocs.io/en/latest/example_google.html)
- [ReadTheDocs Theme](https://sphinx-rtd-theme.readthedocs.io/)
- [autodoc Extension](https://www.sphinx-doc.org/en/master/usage/extensions/autodoc.html)

---

*This documentation is part of the Todo App project. For questions or improvements, please open an issue on GitHub.*
