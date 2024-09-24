import sys
from pathlib import Path

# Adiciona o diretório raiz do projeto ao sys.path
diretorio_raiz = Path(__name__).resolve().parent
sys.path.append(str(diretorio_raiz))

from frontend.flaskmiddle.core import app, config

if __name__ == "__main__":
    app.run(host=config.FRONTEND,port=config.FRONTEND_PORT, debug=config.DEBUG, threaded=True)
