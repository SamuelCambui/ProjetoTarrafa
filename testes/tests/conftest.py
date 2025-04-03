# testes/tests/conftest.py
import os
import sys
from pathlib import Path

from dotenv import load_dotenv

# Forçar o carregamento do .env.desenvolvimento
load_dotenv(dotenv_path='.env.desenvolvimento', override=True)

# Adiciona o diretório raiz do projeto ao PYTHONPATH
root_dir = Path(__file__).parent.parent.parent
sys.path.append(str(root_dir))

