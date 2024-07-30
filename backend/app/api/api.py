# from fastapi import APIRouter

# from .endpoints import login, super_user, users

# # from .endpoints import login, users, prp, super_user
# from .endpoints.ppg import geral, indicadores, docentes, projetos, bancas, tarefas, flower
# from .endpoints.grad import formulario

from __future__ import print_function
from concurrent import futures
import sys
from pathlib import Path

import asyncio

import grpc
from google.protobuf.json_format import ParseDict
from grpc_reflection.v1alpha import reflection
import json

# Adiciona o diretório raiz do projeto ao sys.path
diretorio_raiz = Path(__name__).resolve().parent
sys.path.append(str(diretorio_raiz))

from protos.out import ppg_pb2_grpc, ppg_pb2, usuario_pb2_grpc, usuario_pb2
from backend.app.api.grpc_v1.indicadores_grpc import Indicadores
from backend.app.api.grpc_v1.login_grpc import Usuario
from backend.core.config import settings

async def serve():
    server = grpc.aio.server()
    #server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    ppg_pb2_grpc.add_IndicadoresServicer_to_server(Indicadores(), server)
    usuario_pb2_grpc.add_UsuarioServicer_to_server(Usuario(), server)

    # # Habilitar reflexão
    # SERVICE_NAMES = (
    #     ppg_pb2.DESCRIPTOR.services_by_name['Indicadores'].full_name,
    #     usuario_pb2.DESCRIPTOR.services_by_name['Usuario'].full_name,
    #     reflection.SERVICE_NAME,
    # )

    # reflection.enable_server_reflection(SERVICE_NAMES, server)

    server.add_insecure_port('[::]:50052')

    await server.start()
    await server.wait_for_termination()


if __name__ == '__main__':
    print("Starting server in: %s" % (settings.GRPC_SERVER_HOST))
    # Inicia o servidor
    asyncio.run(serve())