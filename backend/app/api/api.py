from __future__ import print_function
import sys
from pathlib import Path
import asyncio
import grpc

# Adiciona o diretório raiz do projeto ao sys.path
# Necessário para que as importações a seguir sejam encontradas no path
diretorio_raiz = Path(__name__).resolve().parent
sys.path.append(str(diretorio_raiz))
from protos.out import ppg_pb2_grpc, usuarios_pb2_grpc
from backend.app.api.grpc_v1.ppgls.dados_ppgls_grpc import DadosPPGLSServicer
from backend.app.api.grpc_v1.ppgls.indicadores_ppgls_grpc import IndicadoresPPGLSServicer
from backend.app.api.grpc_v1.ppgls.formulario_ppgls_grpc import FormularioPPGLSServicer
from backend.core.config import settings

async def serve():
    server = grpc.aio.server()

    ppg_pb2_grpc.add_IndicadoresServicer_to_server(Indicadores(), server)
    usuarios_pb2_grpc.add_UsuarioServicer_to_server(Usuario(), server)


    server.add_insecure_port(f'[::]:{settings.GRPC_SERVER_HOST}')

    await server.start()
    await server.wait_for_termination()


if __name__ == '__main__':
    print("Starting server in: %s" % (settings.GRPC_SERVER_HOST))
    # Inicia o servidor
    asyncio.run(serve())