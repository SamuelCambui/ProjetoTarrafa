from protos.out import ppgls_pb2_grpc
from backend.worker.tasks_ppgls import tasks_formulario_ppgls
from protos.out.messages_pb2 import FormularioPPGLSRequest, FormularioIndicadoresRequest,FormularioPPGLSResponse
from celery import group
from google.protobuf import json_format
import json
from datetime import datetime, date

class FormularioPPGLSServicer(ppgls_pb2_grpc.DadosFormularioPosGraduacaoLSServicer):
    
    
     
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
    

    def ListarFormularios(self, request, context):
        """
        Função para listar todos os formulários de pós-graduação lato sensu.
        """
        consultas = []
        consultas.append(tasks_formulario_ppgls.tarefa_listar_formularios_ppgls.s())

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

        # Adiciona a tarefa de buscar o formulário à lista de consultas
        consultas.append(tasks_formulario_ppgls.tarefa_buscar_formulario_ppgls.s(
            nome_formulario=request.nome_formulario, 
            data_preenchimento=request.data_preenchimento
        ))

        # Cria um grupo de tarefas
        job = group(consultas)

        result = job.apply_async()
        
        
        try:
            # Obtém o resultado das tarefas
            result = result.get()
            print("Resultado final da task:")
            print(result)

            # Prepara a resposta
            response = result
        except Exception as e:
            # Log de erro se ocorrer uma exceção
            print(f"Erro ao obter resultados das tarefas: {e}")
            response = []  # ou qualquer outro valor padrão que faça sentido

        # Retorna a resposta no formato esperado
        return FormularioPPGLSResponse(item=response)
