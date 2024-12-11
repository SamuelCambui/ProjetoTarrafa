from protos.out import grad_pb2_grpc
from backend.worker.tasks_grad import tasks_disciplinas, tasks_cursos
from protos.out.messages_pb2 import GradResponse, GradRequest, GradDisciplinasRequest


class DadosGraduacaoServicer(grad_pb2_grpc.DadosGraduacaoServicer):
    def GetCurso(self, request: GradRequest, context):
        curso = tasks_cursos.get_curso.delay(
            id_curso=request.id, id_ies=request.id_ies
        ).get()   
        curso = tasks_cursos.get_curso(id_curso=request.id, id_ies=request.id_ies)
        return GradResponse(item=[curso])

    def GetCursos(self, request: GradRequest, context):
        cursos = tasks_cursos.get_cursos.delay(id_ies=request.id_ies).get()
        return GradResponse(item=[cursos])

    def GetDisciplina(self, request: GradDisciplinasRequest, context):
        disciplina = tasks_disciplinas.get_disciplina.delay(
            id=request.id_disc, id_ies=request.id_ies
        ).get()
        return GradResponse(item=[disciplina])

    def GetDisciplinas(self, request: GradDisciplinasRequest, context):
        disciplinas = tasks_disciplinas.get_disciplinas.delay(
            id_grade=request.id_grade, id_curso=request.id_curso, id_ies=request.id_ies
        ).get()
        return GradResponse(item=[disciplinas])
