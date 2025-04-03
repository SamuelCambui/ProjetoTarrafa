from __future__ import print_function

import asyncio
import sys
from pathlib import Path

import grpc

# Adiciona o diretório raiz do projeto ao sys.path
# Necessário para que as importações a seguir sejam encontradas no path
diretorio_raiz = Path(__name__).resolve().parent
sys.path.append(str(diretorio_raiz))
from backend.app.api.grpc_v1.usuario_grpc import Usuario
from backend.core.config import settings
from protos.out import usuarios_pb2_grpc


async def serve():
    server = grpc.aio.server()
    usuarios_pb2_grpc.add_UsuarioServicer_to_server(Usuario(), server)

    server.add_insecure_port(f"[::]:{settings.GRPC_SERVER_USUARIOS}")

    await server.start()
    await server.wait_for_termination()


if __name__ == "__main__":
    print("Starting server in: %s" % (settings.GRPC_SERVER_USUARIOS))
    print("Rodando o servidor de login")
    # Inicia o servidor
    asyncio.run(serve())
