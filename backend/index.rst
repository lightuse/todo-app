Todo App Backend API Documentation
====================================

Welcome to the Todo App Backend API documentation!

This documentation provides comprehensive information about the Python backend API
built with FastAPI, SQLAlchemy, and Pydantic.

.. toctree::
   :maxdepth: 2
   :caption: Contents:

   modules

Quick Start
-----------

The Todo App backend provides a REST API for managing todo items with the following features:

* Create, read, update, and delete todo items
* Tag-based organization and filtering
* FastAPI automatic interactive documentation
* SQLAlchemy ORM for database operations
* Pydantic models for data validation

API Overview
------------

The API consists of the following main components:

* **Models** (``models.py``): SQLAlchemy database models
* **Schemas** (``schemas.py``): Pydantic validation schemas  
* **Main** (``main.py``): FastAPI application and route handlers
* **Database** (``database.py``): Database connection and session management

Installation
------------

1. Install dependencies::

    pip install -r requirements.txt

2. Run the development server::

    python main.py

The API will be available at ``http://localhost:8000`` with interactive docs at ``http://localhost:8000/docs``.

Modules
-------

.. automodule:: models
   :members:
   :undoc-members:
   :show-inheritance:

.. automodule:: schemas
   :members:
   :undoc-members:
   :show-inheritance:

.. automodule:: main
   :members:
   :undoc-members:
   :show-inheritance:

.. automodule:: database
   :members:
   :undoc-members:
   :show-inheritance:

Indices and tables
==================

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`
