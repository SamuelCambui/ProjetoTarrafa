from protos.out import ppgls_pb2_grpc
from backend.worker.tasks_ppgls import tasks_disciplinas_ppgls, tasks_cursos_ppgls
from protos.out.messages_pb2 import PPGLSRequest, PPGLSResponse
from backend.db.cache import cache_grpc_ppgls
import json

class DadosPPGLSServicer(ppgls_pb2_grpc.DadosPosGraduacaoLSServicer):
    @cache_grpc_ppgls()
    def GetCurso(self, request: PPGLSRequest, context):
        curso = tasks_cursos_ppgls.get_curso.delay(id_curso=request.id_curso, id_ies=request.id_ies).get()
        return PPGLSResponse(item=[curso])
    
    @cache_grpc_ppgls()
    def GetCursosPPGLSForm(self, request, context):
        cursos = tasks_cursos_ppgls.get_lista_cursos_ppgls_form.delay(id_ies=request.id_ies).get()
        return PPGLSResponse(item=[cursos])
    
    @cache_grpc_ppgls()
    def GetCursos(self, request, context):
        cursos = tasks_cursos_ppgls.get_cursos.delay(id_ies=request.id_ies).get()
        return PPGLSResponse(item=[cursos])
    
    def GetDisciplina(self, request: PPGLSRequest, context):
        disciplina = tasks_disciplinas_ppgls.get_disciplina.delay(id_disc=request.id_disc, id_ies=request.id_ies ).get()
        return PPGLSResponse(item=[disciplina])

 
    def GetDisciplinas(self, request: PPGLSRequest, context):
        disciplinas = tasks_disciplinas_ppgls.get_disciplinas.delay(id_curso=request.id_curso,id_ies=request.id_ies).get()
        return PPGLSResponse(item=[disciplinas])



