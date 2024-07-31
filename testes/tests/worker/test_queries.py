import pytest
from unittest.mock import patch
from celery.exceptions import Ignore

import os
import sys

from pathlib import Path

diretorio_raiz = Path(__name__).resolve().parent.parent
sys.path.append(str(diretorio_raiz))
print(str(diretorio_raiz))

from backend.worker.queries import *


