from google.protobuf.json_format import MessageToDict
import json
import re

from protos.out import messages_pb2
from backend.schemas.grafico import DadosGrafico, DataSet, Grafico
from backend.worker.crud.ppgls.queries.cursos_ppgls import queries_cursos
from backend.worker.celery_start_queries import app_celery_queries


@app_celery_queries.task
def tarefa_lista_cursos():
    """
    Retorna todos os cursos de pós graduação latu sensu a partir de 10 anos atrás.
    """
    try:
        respostaDict = queries_cursos.lista_cursos()
        retorno = messages_pb2.PPGLSJason(nome='lista_cursos', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJason())

@app_celery_queries.task
def tarefa_retorna_curso(id: str):
    """
    Retorna dados de um curso em específico.

    Parâmetros:
        id(str): Código do curso.
    """
    try:
        respostaDict = queries_cursos.retorna_curso(id)
        retorno = messages_pb2.PPGLSJason(nome='dados_cursos', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJason())

@app_celery_queries.task
def tarefa_quantidade_alunos_por_semestre(id: str, anoi: int, anof: int):
    """
    Retorna a quantidade de alunos por semestre de um curso ao longo do tempo a partir de um ano inicial.

    Parâmetros:
        id(str): Código do curso.
        ano(int): Ano inicial.
        anof(int): Ano final.
    """
    try:
        respostaDict = queries_cursos.quantidade_alunos_por_semestre(id, anoi, anof)
        retorno = messages_pb2.PPGLSJason(nome='quant_alunos_por_semestre', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJason())
    

@app_celery_queries.task
def tarefa_media_idades_por_ano(id: str, anoi: int, anof: int):
    """
        Retorna a media das idades dos alunos de um curso de pós-graduação latu sensu por semestre em um determinado periodo

        Parâmetros:
            id(str): Código do curso.
            anoi(int): Ano inicial.
            anof(int): Ano final.
    """
    try:
        respostaDict = queries_cursos.media_idades_por_ano(id, anoi, anof)
        retorno = messages_pb2.PPGLSJason(nome='media_idade_por_ano', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJason())

@app_celery_queries.task
def tarefa_quant_alunos_e_alunas_por_semestre(id: str, anoi: int, anof: int):
    """
        Retorna a quantidade de alunos homens e mulhes de um curso de pós-graduação latu sensu em um determinado periodo

        Parâmetros:
            id(str): Código do curso.
            anoi(int): Ano inicial.
            anof(int): Ano final.
    """
    try:
        respostaDict = queries_cursos.quant_alunos_e_alunas_por_semestre(id, anoi, anof)
        retorno = messages_pb2.PPGLSJason(nome='quant_alunos_alunas', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJason())

@app_celery_queries.task
def tarefa_nota_media_por_semestre(id: str, anoi: int, anof: int):
    """
        Retorna a nota média de um curso em um determinado período.

        Parâmetros:
            id(str): Código do curso.
            anoi(int): Ano inicial.
            anof(int): Ano final.
    """
    try:
        respostaDict = queries_cursos.nota_media_por_semestre(id, anoi, anof)
        retorno = messages_pb2.PPGLSJason(nome='nota_media_por_semestre', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJason())

@app_celery_queries.task
def tarefa_nota_media_por_curso_por_semestre(id: str, anoi: int, anof: int):
    """
        Retorna a média das notas de das turmas de um semestre por ano de um curso de pós-graduação latu sensu em um determinado período.
        Parâmetros:
            id(str): Código do curso.
            anoi(int): Ano inicial.
            anof(int): Ano final.
    """
    try:
        respostaDict = queries_cursos.nota_media_por_curso_por_semestre(id, anoi, anof)
        retorno = messages_pb2.PPGLSJason(nome='nota_media_por_curso_por_semestre', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJason())

@app_celery_queries.task
def tarefa_quant_curso_por_modali_por_ano( anoi: int, anof: int):
    """
        Retorna a quantidade de cursos por modalidade em um determinado periodo de ano 
        Parâmetros:
            anoi(int): Ano inicial.
            anof(int): Ano final.
    """
    try:
        respostaDict = queries_cursos.quant_resi_por_modali_por_ano(anoi, anof)
        retorno = messages_pb2.PPGLSJason(nome='quant_curso_por_modali', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJason())
    

@app_celery_queries.task
def tarefa_quant_resi_por_modali_por_ano( anoi: int, anof: int):
    """
        Retorna a quantidade de cursos por modalidade em um determinado periodo de ano 
        Parâmetros:
            anoi(int): Ano inicial.
            anof(int): Ano final.
    """
    try:
        respostaDict = queries_cursos.quant_curso_por_modali_por_ano(anoi, anof)
        retorno = messages_pb2.PPGLSJason(nome='quant_resi_por_modali', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJason())

@app_celery_queries.task
def tarefa_quant_alunos_grad_e_posgra():
    """
        Retorna a quantidade de alunos que fizeram graduação e pós graduação e a quantidade de alunos que fizeram apenas graduação

    """
    try:
        respostaDict = queries_cursos.quant_alu_grad_e_posgra()
        retorno = messages_pb2.PPGLSJason(nome='quant_alunos_grad_e_posgra', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJason())
    

@app_celery_queries.task
def tarefa_quant_alunos_vieram_gradu_por_curso(id: str):
    """
       Retorna a quantidade de alunos que vieram de cada curso da graduação em um determinado curso de pós graduação latu sensu em um determinado curso
        
        Parâmetros:
            id(str): Código do curso.

    """
    try:
        respostaDict = queries_cursos.quant_alunos_vieram_gradu_por_curso(id)
        retorno = messages_pb2.PPGLSJason(nome='quant_alunos_vieram_gradu_por_curso', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJason())

@app_celery_queries.task
def tarefa_quant_alunos_nao_vieram_gradu_por_curso(id: str):
    """
       Retorna a quantidade de alunos que não vieram da graduação em um determinado curso de pós graduação latu sensu
        Parâmetros:
            id(str): Código do curso.
    """
    try:
        respostaDict = queries_cursos.quant_alunos_nao_vieram_gradu_por_curso(id)
        retorno = messages_pb2.PPGLSJason(nome='quant_alunos_nao_vieram_gradu_por_curso', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJason())

@app_celery_queries.task
def tarefa_temp_med_conclu_por_curso(id: str):
    """
       Retorna o tempo medio de conclusao determinado curso de pós graduação latu sensu
        Parâmetros:
            id(str): Código do curso.
    """
    try:
        respostaDict = queries_cursos.temp_med_conclu_por_curso(id)
        retorno = messages_pb2.PpgJson(nome='temp_med_conclu_por_curso', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson())

@app_celery_queries.task
def tarefa_forma_ingresso(id: str, anoi: int, anof :int):
    """
       Retorna a quantidade de alunos entrantes por cada modalidade de forma de ingresso.\n

        Parâmetros:\n
            id(str): Código do curso.
            anoi(int): Ano inicial.
            anof(int): Ano final.
    """
    try:
        respostaDict = queries_cursos.forma_ingresso(id, anoi, anof)
        retorno = messages_pb2.PPGLSJason(nome='form_ingr', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJason())

@app_celery_queries.task
def tarefa_alunos_necessidade_especial(id: str, anoi: int, anof :int):
    """
       Retorna a necessidade especial e a quantidade de alunos que a tem, por curso. \n
        
        Parâmetros:\n
            id(str): Código do curso.
            anoi(int): Ano inicial.
            anof(int): Ano final.
    """
    try:
        respostaDict = queries_cursos.alunos_necessidade_especial(id, anoi, anof)

        # Tratamento do campo necessidade especial
        for entry in respostaDict:
            if 'necespecial' in entry:
                # Colocando em maiúsculas e removendo texto entre parênteses
                entry['necespecial'] = re.sub(r'\s*\(.*?\)\s*', '', entry['necespecial']).upper()
        
        retorno = messages_pb2.PPGLSJason(nome='alunos_necessidade_espec', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJason())

@app_celery_queries.task
def tarefa_natu_alunos(id: str, anoi: int, anof :int):
    """
       Retorna a naturalidade dos alunos dos cursos e das residências de pós-graduação latu sensu em um determinado periodo
        Parâmetros:
            id(str): Código do curso.
            anoi(int): Ano inicial.
            anof(int): Ano final.
    """
    try:
        respostaDict = queries_cursos.natu_alunos_por_ano(id, anoi, anof)
        retorno = messages_pb2.PPGLSJason(nome='natu_alunos', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJason())

@app_celery_queries.task
def tarefa_quant_alunos_por_cor(id: str, anoi: int, anof :int):
    """
       Retorna a quantidade de alunos de cada cor de pele dos cursos e das residências de pós-graduação latu sensu em um determinado periodo 
        Parâmetros:
            id(str): Código do curso.
            anoi(int): Ano inicial.
            anof(int): Ano final.
    """
    try:
        respostaDict = queries_cursos.quant_alunos_por_cor_por_ano(id, anoi, anof)
        retorno = messages_pb2.PPGLSJason(nome='quant_alunos_por_cor', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJason())

@app_celery_queries.task
def tarefa_quant_cursos_ofertados_por_ano(anoi: int, anof :int):
    """
       Retorna a quantidade de cursos e residências de pós-graduação latu sensu ofertados em um determinado periodo

        Parâmetros:
            anoi(int): Ano inicial.
            anof(int): Ano final.
    """
    try:
        respostaDict = queries_cursos.quant_cursos_ofertados_por_ano(anoi, anof)
        retorno = messages_pb2.PPGLSJason(nome='quant_cursos_ofertados_por_ano', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJason())


@app_celery_queries.task
def tarefa_professores(anoi: int, anof :int):
    """
       Retorna todos os professores de cursos de pós-graduação latu

        Parâmetros:
            id(str): Código do curso.
    """
    try:
        respostaDict = queries_cursos.professores(anoi, anof)
        retorno = messages_pb2.PPGLSJason(nome='professores', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJason())


