from protos.out import ppgls_pb2_grpc
from backend.worker.tasks_ppgls import tasks_formulario_ppgls
from protos.out.messages_pb2 import FormularioPPGLSRequest, FormularioPPGLSResponse
import json

class FormularioPPGLSServicer(ppgls_pb2_grpc.DadosFormularioPosGraduacaoLSServicer):
    def InsertFormulario(self, request: FormularioPPGLSRequest, context):
        kwargs = request.data_formulario
        formulario_create = tasks_formulario_ppgls.tarefa_inserir_formulario_ppgls.delay(kwargs=kwargs).get()
        return FormularioPPGLSResponse(item=[formulario_create])
    
    def DeleteFormulario(self, request, context):
        kwargs = request.data_formulario
        formulario_delete = tasks_formulario_ppgls.tarefa_excluir_formulario_ppgls.delay(kwargs=kwargs).get()
        return FormularioPPGLSResponse(item=[formulario_delete])
    
    def UpdateFormulario(self, request: FormularioPPGLSRequest, context):
        kwargs = request.data_formulario
        formulario_update = tasks_formulario_ppgls.tarefa_alterar_formulario_ppgls.delay(kwargs=kwargs).get()
        return FormularioPPGLSResponse(item=[formulario_update])
        
    def GetIndicadoresFormulario(self, request: FormularioPPGLSRequest, context):
        kwargs = request.data_formulario
        formulario_read = tasks_formulario_ppgls.tarefa_buscar_formulario_ppgls.delay(kwargs=kwargs).get()
        return FormularioPPGLSResponse(item=[formulario_read])