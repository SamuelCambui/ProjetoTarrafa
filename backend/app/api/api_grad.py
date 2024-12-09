from __future__ import print_function
import sys
from pathlib import Path
import asyncio
import grpc

# Adiciona o diretório raiz do projeto ao sys.path
# Necessário para que as importações a seguir sejam encontradas no path
diretorio_raiz = Path(__name__).resolve().parent
sys.path.append(str(diretorio_raiz))
from protos.out import grad_pb2_grpc
from backend.app.api.grpc_v1.grad.dados_grad_grpc import DadosGraduacaoServicer
from backend.app.api.grpc_v1.grad.indicadores_grad_grpc import IndicadoresGraduacaoServicer
from backend.core.config import settings

async def serve():
    server = grpc.aio.server()
    grad_pb2_grpc.add_DadosGraduacaoServicer_to_server(DadosGraduacaoServicer(), server)
    grad_pb2_grpc.add_IndicadoresGraduacaoServicer_to_server(IndicadoresGraduacaoServicer(), server)

    server.add_insecure_port('[::]:50053')
    
    await server.start()
    await server.wait_for_termination()

if __name__ == '__main__':
    print("Starting server in: %s" % (settings.GRPC_SERVER_GRAD))
    # Inicia o servidor
    asyncio.run(serve())