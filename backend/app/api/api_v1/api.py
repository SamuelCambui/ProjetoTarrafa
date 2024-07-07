# from fastapi import APIRouter

# from .endpoints import login, super_user, users

# # from .endpoints import login, users, prp, super_user
# from .endpoints.ppg import geral, indicadores, docentes, projetos, bancas, tarefas, flower
# from .endpoints.grad import formulario

from __future__ import print_function
from concurrent import futures
import sys
from pathlib import Path

import grpc
from google.protobuf.json_format import ParseDict
import json

# Adiciona o diretório raiz do projeto ao sys.path
diretorio_raiz = Path(__name__).resolve().parent
sys.path.append(str(diretorio_raiz))

from proto.out import ppg_pb2_grpc, ppg_pb2
from backend.app.api.api_v1.endpoints.ppg.indicadores_grpc import Indicadores

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    ppg_pb2_grpc.add_IndicadoresServicer_to_server(Indicadores(), server)
    server.add_insecure_port('[::]:50052')

    # Inicia o servidor
    server.start()

    # Aguarda a finalização do servidor
    server.wait_for_termination()


if __name__ == '__main__':
    print("Starting server in: %s" % ('localhost:50052'))
    # Inicia o servidor
    serve()