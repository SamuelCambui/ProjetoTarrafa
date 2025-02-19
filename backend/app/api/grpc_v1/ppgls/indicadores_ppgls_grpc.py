from protos.out import ppgls_pb2_grpc
from backend.worker.tasks_ppgls import tasks_disciplinas_ppgls, tasks_cursos_ppgls, tasks_ppgls
from protos.out.messages_pb2 import PPGLSRequest, PPGLSResponse
import json
from backend.db.cache import cache_grpc_ppgls
from celery import group

class IndicadoresPPGLSServicer(ppgls_pb2_grpc.IndicadoresPosGraduacaoLSServicer):
    # @cache_grpc_ppgls()
    def GetAbaDisciplinas(self, request: PPGLSRequest, context):
        curso = tasks_cursos_ppgls.get_curso.delay(
            id_curso=request.id_curso, id_ies=request.id_ies
        ).get()
        curso = json.loads(curso["json"])
        serie_inicial, serie_final = curso["serie_inicial"], curso["serie_final"]

        consultas = []
        consultas.append(
            tasks_disciplinas_ppgls.get_disciplinas.s(
                id_grade=request.id_grade,
                id_curso=request.id_curso,
                id_ies=request.id_ies,
            )
        )
        consultas.append(
            tasks_cursos_ppgls.get_grades.s(
                id_curso=request.id_curso, 
                id_ies=request.id_ies
            )
        )

        for serie in range(serie_inicial, serie_final + 1):
            consultas.append(
                tasks_disciplinas_ppgls.get_boxplot_notas_grade.s(
                    id_curso=request.id_curso,
                    id_ies=request.id_ies,
                    serie=serie,
                    id_grade=request.id_grade,
                )
            )
            consultas.append(
                tasks_disciplinas_ppgls.get_taxa_aprovacao_reprovacao_serie.s(
                    id_curso=request.id_curso,
                    id_ies=request.id_ies,
                    serie=serie,
                    id_grade=request.id_grade,
                )
            )

        job = group(consultas)
        result = job.apply_async()
        result = result.get()
        response = [item for item in result]


        return PPGLSResponse(item=response)
    
    @cache_grpc_ppgls()
    def GetIndicadoresDisciplina(self, request: PPGLSRequest, context):

        consultas = []

       
        consultas.append(
            tasks_disciplinas_ppgls.get_quantidade_alunos_disciplina.s(
                id_disc=request.id_disc,
                id_ies=request.id_ies,
                anoi=request.anoi,
                anof=request.anof,
            )
        )
        consultas.append(
            tasks_disciplinas_ppgls.get_aprovacoes_reprovacoes_por_semestre.s(
                id_disc=request.id_disc,
                id_curso=request.id_curso,
                id_ies=request.id_ies,
                anoi=request.anoi,
                anof=request.anof,
            ),
        )
        consultas.append(
            tasks_disciplinas_ppgls.get_boxplot_notas_disciplina.s(
                id_disc=request.id_disc,
                id_ies=request.id_ies,
                anoi=request.anoi,
                anof=request.anof,
            )
        )
        consultas.append(
            tasks_disciplinas_ppgls.get_histograma_notas_disciplina.s(
                id_disc=request.id_disc,
                id_ies=request.id_ies,
                anoi=request.anoi,
                anof=request.anof,
            )
        )
        consultas.append(
            tasks_disciplinas_ppgls.get_evasao_disciplina.s(
                id_disc=request.id_disc,
                id_curso=request.id_curso,
                id_ies=request.id_ies,
                anoi=request.anoi,
                anof=request.anof,
            )
        )
        consultas.append(
            tasks_disciplinas_ppgls.get_boxplot_notas_evasao.s(
                id_disc=request.id_disc,
                id_curso=request.id_curso,
                id_ies=request.id_ies,
                anoi=request.anoi,
                anof=request.anof,
            )
        )
        consultas.append(
            tasks_disciplinas_ppgls.get_boxplot_desempenho_cotistas.s(
                id_disc=request.id_disc,
                id_ies=request.id_ies,
            )
        )
        consultas.append(
            tasks_disciplinas_ppgls.get_histograma_desempenho_cotistas.s(
                id_disc=request.id_disc,
                id_ies=request.id_ies,
            )
        )
        consultas.append(
            tasks_disciplinas_ppgls.get_boxplot_desempenho_alunos_professor.s(
                id_disc=request.id_disc,
                id_ies=request.id_ies,
                anoi=request.anoi,
                anof=request.anof
            )
        )


        job = group(consultas)
        result = job.apply_async()
        result = result.get()
        response = [item for item in result]

        
        job = group(consultas)
        result = job.apply_async()
        result = result.get()
        response = [item for item in result]
        return PPGLSResponse(item=response)
    
    @cache_grpc_ppgls()
    def GetAbaIndicadoresCurso(self, request: PPGLSRequest, context):
    
        consultas = []
        
        consultas.append(
            tasks_cursos_ppgls.get_quantidade_alunos_por_sexo.s(
                id_curso=request.id_curso,
                id_ies=request.id_ies,
                anoi=request.anoi,
                anof=request.anof,
            )
        )
        consultas.append(
            tasks_cursos_ppgls.get_forma_ingresso.s(
                id_curso=request.id_curso,
                id_ies=request.id_ies,
                anoi=request.anoi,
                anof=request.anof,
            )
        )
        consultas.append(
            tasks_cursos_ppgls.get_alunos_necessidade_especial.s(
                id_curso=request.id_curso,
                id_ies=request.id_ies,
                anoi=request.anoi,
                anof=request.anof,
            )
        )
        consultas.append(
            tasks_cursos_ppgls.get_boxplot_idade.s(
                id_curso=request.id_curso,
                id_ies=request.id_ies,
                anoi=request.anoi,
                anof=request.anof,
            )
        )
        consultas.append(
            tasks_cursos_ppgls.get_naturalidade_alunos.s(
                id_curso=request.id_curso,
                id_ies=request.id_ies,
                anoi=request.anoi,
                anof=request.anof,
            )
        )

        # Cria um grupo de tarefas Celery para que as consultas sejam executadas paralelamente.
        job = group(consultas)
        result = job.apply_async()
        result = result.get()
        response = [item for item in result]


        return PPGLSResponse(item=response)
    
    @cache_grpc_ppgls()
    def GetAbaRegressos(self, request: PPGLSRequest, context):
        consultas = []
        consultas.append(
            tasks_cursos_ppgls.get_quant_alunos_vieram_gradu_e_nao_vieram_por_curso.s(
                id_curso=request.id_curso,
                id_ies=request.id_ies,
                anoi=request.anoi,
                anof=request.anof,
            )
        )
        
        job = group(consultas)
        result = job.apply_async()
        result = result.get()
        response = [item for item in result]

        return PPGLSResponse(item=response)
    
    @cache_grpc_ppgls()
    def GetAbaProfessores(self, request: PPGLSRequest, context):
        consultas = []
        consultas.append(
            tasks_cursos_ppgls.get_professores.s(
                id_curso=request.id_curso,
                id_ies=request.id_ies,
                anoi=request.anoi,
                anof=request.anof,
            )
        )
        job = group(consultas)
        result = job.apply_async()
        result = result.get()
        response = [item for item in result]

        return PPGLSResponse(item=response)
    
    @cache_grpc_ppgls()
    def GetIndicadoresGlobais(self, request: PPGLSRequest, context):
        consultas = []
        consultas.append(
            tasks_ppgls.get_naturalidade_alunos.s(
                id_ies=request.id_ies,
                anoi=request.anoi,
                anof=request.anof,
            )
        )
        consultas.append(
            tasks_ppgls.get_quantidade_alunos_por_sexo.s(
                id_ies=request.id_ies,
                anoi=request.anoi,
                anof=request.anof,
            )
        )
    
        consultas.append(
            tasks_ppgls.get_boxplot_idade.s(
                id_ies=request.id_ies,
                anoi=request.anoi,
                anof=request.anof,
            )
        )
        consultas.append(
            tasks_ppgls.get_taxa_matriculas.s(
                id_ies=request.id_ies,
                anoi=request.anoi,
                anof=request.anof
            )
        )
        consultas.append(
            tasks_ppgls.get_taxa_matriculas_por_cota.s(
                id_ies=request.id_ies,
                anoi=request.anoi,
                anof=request.anof
            )
        )

        job = group(consultas)
        result = job.apply_async()
        result = result.get()
        response = [item for item in result]

        return PPGLSResponse(item=response)
    
    
   
