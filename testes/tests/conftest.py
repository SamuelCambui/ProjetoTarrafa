# conftest.py
import pytest
from dotenv import load_dotenv
import os

# def pytest_configure():
#     # Carrega um arquivo .env específico antes de iniciar os testes
#     dotenv_path = os.path.join(os.path.dirname(__file__), '../..', '.env.desenvolvimento')
#     print(dotenv_path)
#     load_dotenv(dotenv_path=dotenv_path)
