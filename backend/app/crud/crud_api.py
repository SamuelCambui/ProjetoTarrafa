
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

from proto.out import queries_pb2, queries_pb2_grpc, messages_pb2
from backend.app import crud
from backend.db.db import DBConnectorPPG


# Implementação do serviço gRPC
class Queries(queries_pb2_grpc.QueriesServicer):
    def ObtemContagemIndprodart(self, request, context):
        print('ObtemContagemIndprodart chamada...')
        try:
            id = request.id
            anoi = request.anoi
            anof = request.anof
            respostaDict = crud.queries_ppg.retorna_contagem_de_indprodart_com_listanegra(id, anoi, anof, None)
            retorno = messages_pb2.PpgJson(nome='dadosindprods', json=json.dumps(respostaDict))
            return retorno
        except Exception as e:
            print(e)
            return None

    def ObtemContagemQualis(self, request, context):
        print('ObtemContagemQualis chamada...')
        try:
            id = request.id
            anoi = request.anoi
            anof = request.anof
            respostaDict = crud.queries_ppg.retorna_contagem_de_qualis_com_listanegra(id, anoi, anof, None)
            retorno = messages_pb2.PpgJson(nome='dadosqualis', json=json.dumps(respostaDict))
            return retorno
        except Exception as e:
            print(e)
            return None


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    queries_pb2_grpc.add_QueriesServicer_to_server(Queries(), server)
    server.add_insecure_port('[::]:50051')

    # Inicia o servidor
    server.start()

    # Aguarda a finalização do servidor
    server.wait_for_termination()


if __name__ == '__main__':
    print("Starting server in: %s" % ('localhost:50051'))
    # Inicia o servidor
    serve()