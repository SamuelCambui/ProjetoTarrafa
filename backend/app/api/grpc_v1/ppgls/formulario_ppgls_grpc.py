from protos.out import ppgls_pb2_grpc
from backend.worker.tasks_ppgls import tasks_formulario_ppgls
from protos.out.messages_pb2 import FormularioPPGLSRequest, FormularioSerchPPGLSRequest, FormularioIndicadoresRequest,FormularioPPGLSResponse
from celery import group
from google.protobuf import json_format
import json

class FormularioPPGLSServicer(ppgls_pb2_grpc.DadosFormularioPosGraduacaoLSServicer):
    
    def SearchRegistrosFormualario(self, request: FormularioSerchPPGLSRequest, context):
        #exemplo de requisição:
        #{
        # "masp": 123456,
        # "tipo": 2
        # }

        # Cria uma lista de tarefas
        consultas = [
            tasks_formulario_ppgls.tarefa_tarefa_buscar_registros_formulario_ppgls.s(masp=request.masp, tipo=request.tipo)
        ]
        
        # Cria um grupo de tarefas
        job = group(consultas)
        
        # Executa as tarefas e obtém o resultado
        result = job.apply_async()
        
        try:
            # Obtém o resultado das tarefas
            result = result.get()
            # Prepare a resposta
            response = [item for item in result]
        except Exception as e:
            # Log de erro se ocorrer uma exceção
            print(f"Erro ao obter resultados das tarefas: {e}")
            response = []  # ou qualquer outro valor padrão que faça sentido
        
        # Retorna a resposta
        return FormularioPPGLSResponse(item=response)
     
    def InsertFormulario(self, request: FormularioPPGLSRequest, context):

        # Converter o request em um dicionário
        try:
            kwargs = json_format.MessageToDict(request, preserving_proto_field_name=True)
            print("Conteúdo de kwargs do método:", kwargs)
        except Exception as e:
            print("Erro ao converter o request para dict:", e)
            kwargs = {}

        # print("Conteúdo de kwargs do método:", kwargs)
        result = tasks_formulario_ppgls.tarefa_inserir_formulario_ppgls.delay(**kwargs)


        try:
            result = result.get()
            response = result
            print("Resultado Final:", response)
        except Exception as e:
            print("Erro ao obter o resultado:", str(e))

        return FormularioPPGLSResponse(item=[response])

    
    def UpdateFormulario(self, request: FormularioPPGLSRequest, context):
        
        # Converter o request em um dicionário
        try:
            kwargs = json_format.MessageToDict(request, preserving_proto_field_name=True)
            print("Conteúdo de kwargs do método:", kwargs)
        except Exception as e:
            print("Erro ao converter o request para dict:", e)
            kwargs = {}

        result = tasks_formulario_ppgls.tarefa_alterar_formulario_ppgls.delay(**kwargs)

        try:
            result = result.get()
            response = result
            print("Resultado Final:", response)
        except Exception as e:
            print("Erro ao obter o resultado:", str(e))

        return FormularioPPGLSResponse(item=[response])
    
    def DeleteFormulario(self, request: FormularioIndicadoresRequest, context):
        
        consultas = []

        consultas.append(tasks_formulario_ppgls.tarefa_excluir_formulario_ppgls.s(nome_formulario=request.nome_formulario, data_inicio=request.data_inicio))

        # Cria um grupo de tarefas
        job = group(consultas)

        # Executa as tarefas e obtém o resultado
        result = job.apply_async()

        try:
            # Obtém o resultado das tarefas
            result = result.get()
            # Prepara a resposta
            response = result
        except Exception as e:
            # Log de erro se ocorrer uma exceção
            print(f"Erro ao obter resultados das tarefas: {e}")
            response = []  # ou qualquer outro valor padrão que faça sentido

        # Retorna a resposta no formato esperado
        return FormularioPPGLSResponse(item=response)
       
        
    def GetIndicadoresFormulario(self, request: FormularioIndicadoresRequest, context):
        
        consultas = []

        
        consultas.append(tasks_formulario_ppgls.tarefa_buscar_formulario_ppgls.s(nome_formulario=request.nome_formulario, data_inicio=request.data_inicio))

        # Cria um grupo de tarefas
        job = group(consultas)

        # Executa as tarefas e obtém o resultado
        result = job.apply_async()

        try:
            # Obtém o resultado das tarefas
            result = result.get()
            # Prepara a resposta
            response = result
        except Exception as e:
            # Log de erro se ocorrer uma exceção
            print(f"Erro ao obter resultados das tarefas: {e}")
            response = []  # ou qualquer outro valor padrão que faça sentido

        # Retorna a resposta no formato esperado
        return FormularioPPGLSResponse(item=response)