from backend.db.cache import cache_grpc_grad
from protos.out import grad_pb2_grpc
from protos.out.messages_pb2 import GradRequest, GradResponse, GradDisciplinasRequest
from backend.worker.tasks_grad import tasks_cursos, tasks_disciplinas, tasks_grad
import json
from celery import group


#   Classe que implementa os serviços dos Indicadores de Graduação.
#
#   Todos os métodos seguem o mesmo padrão de utilizar tasks(consultas)
#   de maneira paralela.
#
class IndicadoresGraduacaoServicer(grad_pb2_grpc.IndicadoresGraduacaoServicer):
    @cache_grpc_grad()
    def GetAbaDisciplinas(self, request: GradDisciplinasRequest, context):
        curso = tasks_cursos.get_curso.delay(
            id_curso=request.id_curso, id_ies=request.id_ies
        ).get()
        curso = json.loads(curso["json"])
        serie_inicial, serie_final = curso["serie_inicial"], curso["serie_final"]

        consultas = []
        consultas.append(
            tasks_disciplinas.get_disciplinas.s(
                id_grade=request.id_grade,
                id_curso=request.id_curso,
                id_ies=request.id_ies,
            )
        )

        for serie in range(serie_inicial, serie_final + 1):
            consultas.append(
                tasks_disciplinas.get_boxplot_notas_grade.s(
                    id_curso=request.id_curso,
                    id_ies=request.id_ies,
                    serie=serie,
                    id_grade=request.id_grade,
                )
            )
            consultas.append(
                tasks_disciplinas.get_taxa_aprovacao_reprovacao_serie.s(
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

        return GradResponse(item=response)

    @cache_grpc_grad()
    def GetAbaEgressos(self, request: GradRequest, context):
        consultas = []
        consultas.append(
            tasks_cursos.get_egressos.s(
                id_curso=request.id,
                id_ies=request.id_ies,
                anoi=request.anoi,
                anof=request.anof,
            )
        )
        consultas.append(
            tasks_cursos.get_tempo_formacao.s(
                id_curso=request.id,
                id_ies=request.id_ies,
                anoi=request.anoi,
            )
        )
        job = group(consultas)
        result = job.apply_async()
        result = result.get()
        response = [item for item in result]

        return GradResponse(item=response)

    # @cache_grpc_grad()
    def GetAbaIndicadoresCurso(self, request: GradRequest, context):
        consultas = []
        consultas.append(
            tasks_cursos.get_curso.s(id_curso=request.id, id_ies=request.id_ies)
        )
        consultas.append(
            tasks_cursos.get_quantidade_alunos_por_sexo.s(
                id_curso=request.id,
                id_ies=request.id_ies,
                anoi=request.anoi,
                anof=request.anof,
            )
        )
        consultas.append(
            tasks_cursos.get_forma_ingresso.s(
                id_curso=request.id,
                id_ies=request.id_ies,
                anoi=request.anoi,
                anof=request.anof,
            )
        )
        consultas.append(
            tasks_cursos.get_alunos_necessidade_especial.s(
                id_curso=request.id,
                id_ies=request.id_ies,
                anoi=request.anoi,
                anof=request.anof,
            )
        )
        consultas.append(
            tasks_cursos.get_naturalidade_alunos.s(
                id_curso=request.id,
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

        return GradResponse(item=response)

    @cache_grpc_grad()
    def GetAbaProfessores(self, request: GradRequest, context):
        consultas = []
        consultas.append(
            tasks_cursos.get_professores.s(
                id_curso=request.id,
                id_ies=request.id_ies,
                anoi=request.anoi,
                anof=request.anof,
            )
        )
        job = group(consultas)
        result = job.apply_async()
        result = result.get()
        response = [item for item in result]

        return GradResponse(item=response)

    @cache_grpc_grad()
    def GetIndicadoresDisciplina(self, request: GradDisciplinasRequest, context):
        consultas = []
        consultas.append(
            tasks_disciplinas.get_quantidade_alunos_disciplina.s(
                id_disc=request.id_disc,
                id_ies=request.id_ies,
                anoi=request.anoi,
                anof=request.anof,
            )
        )
        consultas.append(
            tasks_disciplinas.get_aprovacoes_reprovacoes_por_semestre.s(
                id_disc=request.id_disc,
                id_curso=request.id_curso,
                id_ies=request.id_ies,
                anoi=request.anoi,
                anof=request.anof,
            ),
        )
        consultas.append(
            tasks_disciplinas.get_boxplot_notas_disciplina.s(
                id_disc=request.id_disc,
                id_ies=request.id_ies,
                anoi=request.anoi,
                anof=request.anof,
            )
        )
        consultas.append(
            tasks_disciplinas.get_histograma_notas_disciplina.s(
                id_disc=request.id_disc,
                id_ies=request.id_ies,
                anoi=request.anoi,
                anof=request.anof,
            )
        )
        consultas.append(
            tasks_disciplinas.get_quantidade_prova_final.s(
                id_disc=request.id_disc,
                id_ies=request.id_ies,
                anoi=request.anoi,
                anof=request.anof,
            )
        )
        consultas.append(
            tasks_disciplinas.get_boxplot_notas_prova_final.s(
                id_disc=request.id_disc,
                id_ies=request.id_ies,
                anoi=request.anoi,
                anof=request.anof,
            )
        )
        consultas.append(
            tasks_disciplinas.get_evasao_disciplina.s(
                id_disc=request.id_disc,
                id_curso=request.id_curso,
                id_ies=request.id_ies,
                anoi=request.anoi,
                anof=request.anof,
            )
        )
        consultas.append(
            tasks_disciplinas.get_boxplot_notas_evasao.s(
                id_disc=request.id_disc,
                id_curso=request.id_curso,
                id_ies=request.id_ies,
                anoi=request.anoi,
                anof=request.anof,
            )
        )
        consultas.append(
            tasks_disciplinas.get_boxplot_desempenho_cotistas.s(
                id_disc=request.id_disc,
                id_ies=request.id_ies,
            )
        )
        consultas.append(
            tasks_disciplinas.get_histograma_desempenho_cotistas.s(
                id_disc=request.id_disc,
                id_ies=request.id_ies,
            )
        )

        job = group(consultas)
        result = job.apply_async()
        result = result.get()
        response = [item for item in result]
        return GradResponse(item=response)

    # @cache_grpc_grad()
    def GetIndicadoresGlobais(self, request: GradRequest, context):
        consultas = []
        consultas.append(
            tasks_grad.get_naturalidade_alunos.s(
                id_ies=request.id_ies,
                anoi=request.anoi,
                anof=request.anof,
            )
        )
        consultas.append(
            tasks_grad.get_sexo_alunos.s(
                id_ies=request.id_ies,
                anoi=request.anoi,
                anof=request.anof,
            )
        )
        consultas.append(
            tasks_grad.get_egressos.s(
                id_ies=request.id_ies,
                anoi=request.anoi,
                anof=request.anof,
            )
        )

        job = group(consultas)
        result = job.apply_async()
        result = result.get()
        response = [item for item in result]

        return GradResponse(item=response)
