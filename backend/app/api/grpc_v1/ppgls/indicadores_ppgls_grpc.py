from protos.out import ppgls_pb2_grpc
from backend.worker.tasks_ppgls import tasks_disciplinas_ppgls, tasks_cursos_ppgls
from protos.out.messages_pb2 import PPGLSRequest, PPGLSResponse
import json
from celery import group

class IndicadoresPPGLSServicer(ppgls_pb2_grpc.IndicadoresPosGraduacaoLSServicer):
    def GetAbaDisciplinas(self, request: PPGLSRequest, context):
        curso = tasks_cursos_ppgls.tarefa_retorna_curso.delay(id=request.id).get()
        curso = json.loads(curso['json'])
        serie_inicial, serie_final = curso['serie_inicial'], curso['serie_final']

        consultas = []
        tasks_disciplinas_ppgls.tarefa_lista_disciplinas_por_curso(id=request.id)
        consultas.append(tasks_disciplinas_ppgls.tarefa_lista_disciplinas_por_curso.s(id=request.id))

    
        # Retorna as reprovações e notas médias de todas as disciplinas de todos os períodos do curso
        for serie in range(serie_inicial, serie_final + 1):
            consultas.append(tasks_disciplinas_ppgls.tarefa_reprovacoes_por_serie.s(id=request.id, anoi=request.anoi, anof=request.anof, serie=serie))
            consultas.append(tasks_disciplinas_ppgls.tarefa_media_disciplinas_por_serie.s(id=request.id, anoi=request.anoi, anof=request.anof, serie=serie))

        job = group(consultas)
        result = job.apply_async()
        result = result.get()
        response = [item for item in result]

        return PPGLSResponse(item=response)

    def GetIndicadoresDisciplina(self, request: PPGLSRequest, context):
        id_disciplina = int(request.id)
        consultas = []
        consultas.append(tasks_disciplinas_ppgls.tarefa_quant_alunos_por_semestre.s(id=id_disciplina, anoi=request.anoi, anof=request.anof))
        consultas.append(tasks_disciplinas_ppgls.tarefa_reprovacoes_por_semestre_curso.s(id=id_disciplina, anoi=request.anoi, anof=request.anof))
        consultas.append(tasks_disciplinas_ppgls.tarefa_reprovacoes_por_falta_por_semestre_curso.s(id=id_disciplina, anoi=request.anoi, anof=request.anof))
        consultas.append(tasks_disciplinas_ppgls.tarefa_aprovacoes_por_semestre_curso.s(id=id_disciplina, anoi=request.anoi, anof=request.anof))
        consultas.append(tasks_disciplinas_ppgls.tarefa_aprovacoes_por_falta_por_semestre_curso.s(id=id_disciplina, anoi=request.anoi, anof=request.anof))
        consultas.append(tasks_disciplinas_ppgls.tarefa_reprovacoes_por_semestre.s(id=id_disciplina, anoi=request.anoi, anof=request.anof))
        consultas.append(tasks_disciplinas_ppgls.tarefa_aprovacoes_por_semestre.s(id=id_disciplina, anoi=request.anoi, anof=request.anof))
        consultas.append(tasks_disciplinas_ppgls.tarefa_media_disciplinas_por_serie.s(id=id_disciplina, anoi=request.anoi, anof=request.anof))
       

        job = group(consultas)
        result = job.apply_async()
        result = result.get()
        response = [item for item in result]
        return PPGLSResponse(item=response)
    
    
    def GetAbaIndicadoresCurso(self, request: PPGLSRequest, context):
    
        consultas = []
        
        consultas.append(tasks_cursos_ppgls.tarefa_retorna_curso.s(id=request.id))
        consultas.append(tasks_cursos_ppgls.tarefa_quantidade_alunos_por_semestre.s(id=request.id, anoi=request.anoi, anof=request.anof))
        consultas.append(tasks_cursos_ppgls.tarefa_media_idades_por_ano.s(id=request.id, anoi=request.anoi, anof=request.anof))
        consultas.append(tasks_cursos_ppgls.tarefa_quant_alunos_e_alunas_por_semestre.s(id=request.id, anoi=request.anoi, anof=request.anof))
        consultas.append(tasks_cursos_ppgls.tarefa_nota_media_por_semestre.s(id=request.id, anoi=request.anoi, anof=request.anof))
        consultas.append(tasks_cursos_ppgls.tarefa_nota_media_por_curso_por_semestre.s(id=request.id, anoi=request.anoi, anof=request.anof))
        consultas.append(tasks_cursos_ppgls.tarefa_quant_curso_por_modali_por_ano.s(anoi=request.anoi, anof=request.anof))
        consultas.append(tasks_cursos_ppgls.tarefa_quant_resi_por_modali_por_ano.s(anoi=request.anoi, anof=request.anof))
        consultas.append(tasks_cursos_ppgls.tarefa_forma_ingresso.s(id=request.id, anoi=request.anoi, anof=request.anof))
        consultas.append(tasks_cursos_ppgls.tarefa_alunos_necessidade_especial.s(id=request.id, anoi=request.anoi, anof=request.anof))
        consultas.append(tasks_cursos_ppgls.tarefa_natu_alunos.s(id=request.id, anoi=request.anoi, anof=request.anof))
        consultas.append(tasks_cursos_ppgls.tarefa_quant_alunos_por_cor.s(id=request.id, anoi=request.anoi, anof=request.anof))

    
        # Cria um grupo de tarefas Celery para que as consultas sejam executadas paralelamente.
        job = group(consultas)
        result = job.apply_async()
        result = result.get()    
        response = [item for item in result]

        return PPGLSResponse(item=response)
    
    def GetAbaReressos(self, request: PPGLSRequest, context):
        consultas = []
        consultas.append(tasks_cursos_ppgls.tarefa_quant_alunos_vieram_gradu_por_curso.s(id=request.id))
        consultas.append(tasks_cursos_ppgls.tarefa_quant_alunos_nao_vieram_gradu_por_curso.s(id=request.id))
        consultas.append(tasks_cursos_ppgls.tarefa_quant_alunos_grad_e_posgra.s())
        consultas.append(tasks_cursos_ppgls.tarefa_temp_med_conclu_por_curso.s(id=request.id))

      
        job = group(consultas)
        result = job.apply_async()
        result = result.get()
        response = [item for item in result]

        return PPGLSResponse(item=response)
    
    def GetAbaProfessores(self, request: PPGLSRequest, context):
        consultas = []
        consultas.append(tasks_cursos_ppgls.tarefa_professores.s(request.id))

        # Cria um grupo de tarefas Celery para que as consultas sejam executadas paralelamente.
        job = group(consultas)
        result = job.apply_async()
        result = result.get()
        response = [item for item in result]

        return PPGLSResponse(item=response)
    
    
    
   
