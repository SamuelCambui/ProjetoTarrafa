#baseado no projeto padrão FASTAPI: https://github.com/tiangolo/full-stack-fastapi-postgresql

import sys

from pathlib import Path

# Adiciona o diretório raiz do projeto ao sys.path
diretorio_raiz = Path(__name__).resolve().parent.parent  # Ajuste conforme a necessidade
sys.path.append(str(diretorio_raiz))

from backend.db.db import DBConnectorGRAD, DBConnectorPPG

# import backend.worker.despachante as dp

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from .api.api_v1.api import api_router_v1
from backend.core.config import settings

from backend.app import connection

conn = None

app = FastAPI(
    openapi_url=f"{settings.API_STR}/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],

    #allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router_v1, prefix=settings.API_STR)
#app.include_router(api_router_v1, prefix="/api/latest")

@app.on_event("startup")
async def startup():
    # try:
    #     dp.despachante()
    # except Exception as e:
    #     print(e)
        
    pass


@app.on_event("shutdown")
async def shutdown():
    connection.close()
    DBConnectorGRAD().close()
    DBConnectorPPG().close()
