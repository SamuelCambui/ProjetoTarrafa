from protos.out import ppgls_pb2_grpc
from backend.worker.tasks_ppgls import tasks_disciplinas_ppgls, tasks_cursos_ppgls
from protos.out.messages_pb2 import PPGLSRequest, PPGLSResponse
from backend.db.cache import cache_grpc_ppgls
import json

class DadosPPGLSServicer(ppgls_pb2_grpc.DadosPosGraduacaoLSServicer):
    @cache_grpc_ppgls()
    def GetCurso(self, request: PPGLSRequest, context):
        curso = tasks_cursos_ppgls.tarefa_retorna_curso.delay(id=request.id).get()
        return PPGLSResponse(item=[curso])
    
    @cache_grpc_ppgls()
    def GetCursos(self, request, context):
        cursos = tasks_cursos_ppgls.tarefa_lista_cursos.delay().get()
        return PPGLSResponse(item=[cursos])
    
    @cache_grpc_ppgls()
    def GetDisciplina(self, request: PPGLSRequest, context):
        disciplina = tasks_disciplinas_ppgls.tarefa_lista_dados_disciplina.delay(id=int(request.id)).get()
        return PPGLSResponse(item=[disciplina])

    @cache_grpc_ppgls()    
    def GetDisciplinas(self, request: PPGLSRequest, context):
        disciplinas = tasks_disciplinas_ppgls.tarefa_lista_disciplinas_por_curso.delay(id=request.id).get()
        return PPGLSResponse(item=[disciplinas])
