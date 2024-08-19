from __future__ import print_function
import sys
from pathlib import Path
from celery import group
from google.protobuf.json_format import Parse, MessageToJson, ParseDict

from backend.worker.queries import *
from backend.db.cache import cache_grpc
from protos.out import ppg_pb2, ppg_pb2_grpc, messages_pb2


# Implementação do serviço gRPC
class Bancas(ppg_pb2_grpc.IndicadoresServicer):
    @cache_grpc
    def ObtemBancas(self, request, context):
        return ""