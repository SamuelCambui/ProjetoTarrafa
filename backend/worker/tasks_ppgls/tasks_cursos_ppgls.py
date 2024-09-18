from google.protobuf.json_format import MessageToDict
import json
import re
from celery import group
from celery import chain
from protos.out.messages_pb2 import PPGLSResponse
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
        retorno = messages_pb2.PPGLSJson(nome='lista_cursos', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJson())

@app_celery_queries.task
def tarefa_retorna_curso(id: str):
    """
    Retorna dados de um curso em específico.

    Parâmetros:
        id(str): Código do curso.
    """
    try:
        resposta = queries_cursos.retorna_curso(id)
        retorno = messages_pb2.PPGLSJson(nome='dados_cursos', json=json.dumps(dict(resposta)))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJson())

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
        dataset = DataSet()
        dados_grafico = DadosGrafico()
        dataset.label = 'Quantidade de Alunos'

        respostaDict = queries_cursos.quantidade_alunos_por_semestre(id, anoi, anof)
        dataset.data = ([item['quantidade'] for item in respostaDict])
        dados_grafico.labels = ['/'.join([str(item['ano_letivo']), str(item['semestre'])]) for item in respostaDict]

        dados_grafico.datasets.append(dataset)

        grafico = Grafico()
        grafico.data = dados_grafico

        retorno = messages_pb2.PPGLSJson(nome='quant_alunos_por_semestre', json=json.dumps(grafico.to_dict()))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJson())
    

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
        dataset = DataSet()
        dados_grafico = DadosGrafico()
        dataset.label = 'Média das Idades dos Alunos'

        # Chama a função que faz a consulta SQL e retorna os resultados
        respostaDict = queries_cursos.media_idades_por_ano(id, anoi, anof)

        # Converte os valores de 'media_idade' de Decimal para float
        dataset.data = [float(item['media_idade']) if item['media_idade'] is not None else None for item in respostaDict]
        
        # Formata os labels com o ano e semestre
        dados_grafico.labels = ['/'.join([str(item['ano']), str(item['semestre'])]) for item in respostaDict]

        # Adiciona o dataset formatado ao gráfico
        dados_grafico.datasets.append(dataset)

        grafico = Grafico()
        grafico.data = dados_grafico

        # Gera o retorno como JSON
        retorno = messages_pb2.PPGLSJson(nome='media_idade_por_ano', json=json.dumps(grafico.to_dict()))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJson())

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
        alunos = queries_cursos.quant_alunos_e_alunas_por_semestre(id=id, anoi=anoi, anof=anof)
        dataset_masculino = DataSet()
        dataset_feminino = DataSet()
        dados_grafico = DadosGrafico()
        dataset_masculino.label = 'Masculino'
        dataset_feminino.label = 'Feminino'

        dataset_masculino.data = [item['quantidade'] for item in alunos if item['sexo'] == 'M']
        print(f"Dataset Masculino: {dataset_masculino.data}")
        dataset_feminino.data = [item['quantidade'] for item in alunos if item['sexo'] == 'F']
        print(f"Dataset Feminino: {dataset_feminino.data}")
        labels = ['/'.join([str(item['ano_letivo']), str(item['semestre'])]) for item in alunos]
        dados_grafico.labels = sorted(set(labels))
        print(f"Labels: {dados_grafico.labels}")

        # Adiciona os datasets corretamente
        dados_grafico.datasets.append(dataset_masculino)
        print(f"Dataset Feminino: {dados_grafico.datasets}")
        dados_grafico.datasets.append(dataset_feminino)
        print(f"Dataset Feminino: {dados_grafico.labels}")

        # Gera o gráfico
        grafico = Grafico()
        grafico.data = dados_grafico

        # Retorna o JSON corretamente com os datasets
        message = messages_pb2.PPGLSJson(nome='graficoAlunosSexo', json=json.dumps(grafico.to_dict()))
        return MessageToDict(message)

    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJson())

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
        # Conversão para float e arredondamento da média
        for item in respostaDict:
            if 'media' in item:
                item['media'] = round(float(item['media']), 2)
        dataset = DataSet()
        dados_grafico = DadosGrafico()
        dataset.label = 'Nota Média por Semestre'
        dataset.data = ([float(item['media']) for item in respostaDict])
        dados_grafico.labels = ['/'.join([str(item['ano_letivo']), str(item['semestre'])]) for item in respostaDict]
        dados_grafico.datasets = [dataset]
        grafico = Grafico()
        grafico.data = dados_grafico

       
        retorno = messages_pb2.PPGLSJson(nome='nota_media_por_semestre', json=json.dumps(grafico.to_dict()))
        
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJson())

@app_celery_queries.task
def tarefa_quant_curso_por_modali_por_ano(anoi: int, anof: int):
    """
        Retorna a quantidade de cursos por modalidade em um determinado periodo de ano 
        Parâmetros:
            anoi(int): Ano inicial.
            anof(int): Ano final.
    """
    try:
        # Consulta a quantidade de cursos por modalidade e ano
        respostaDictCursos = queries_cursos.quant_curso_por_modali_por_ano(anoi=anoi, anof=anof)
        print("Resultado da Consulta Cursos:", respostaDictCursos)

        # Consulta a quantidade de residências por modalidade e ano
        respostaDictResidencias = queries_cursos.quant_resi_por_modali_por_ano(anoi=anoi, anof=anof)
        print("Resultado da Consulta Residências:", respostaDictResidencias)

        # Verifica se as respostas não são None e são listas
        if (respostaDictCursos is None or not isinstance(respostaDictCursos, list) or
            respostaDictResidencias is None or not isinstance(respostaDictResidencias, list)):
            raise ValueError("As respostas das consultas são inválidas ou estão vazias.")

        # Cria datasets para cursos e residências
        dataset_cursos_presencial = DataSet()
        dataset_cursos_distancia = DataSet()
        dataset_residencias_presencial = DataSet()
        dataset_residencias_distancia = DataSet()
        
        dados_grafico = DadosGrafico()
        
        dataset_cursos_presencial.label = 'Cursos Presenciais'
        dataset_cursos_distancia.label = 'Cursos A Distância'
        dataset_residencias_presencial.label = 'Residências Presenciais'
        dataset_residencias_distancia.label = 'Residências A Distância'

        # Preenche os datasets de cursos
        dataset_cursos_presencial.data = [float(item['qtd_especializacoes']) for item in respostaDictCursos if item['modalidade'] == 'P']
        dataset_cursos_distancia.data = [float(item['qtd_especializacoes']) for item in respostaDictCursos if item['modalidade'] == 'D']
        
        # Preenche os datasets de residências
        dataset_residencias_presencial.data = [float(item['qtd_especializacoes']) for item in respostaDictResidencias if item['modalidade'] == 'P']
        dataset_residencias_distancia.data = [float(item['qtd_especializacoes']) for item in respostaDictResidencias if item['modalidade'] == 'D']
        
        # Define os rótulos dos gráficos com os anos distintos
        labels_cursos = [str(item['ano']) for item in respostaDictCursos]
        labels_residencias = [str(item['ano']) for item in respostaDictResidencias]
        dados_grafico.labels = sorted(set(labels_cursos + labels_residencias))

        # Adiciona os datasets ao gráfico
        dados_grafico.datasets.append(dataset_cursos_presencial)
        dados_grafico.datasets.append(dataset_cursos_distancia)
        dados_grafico.datasets.append(dataset_residencias_presencial)
        dados_grafico.datasets.append(dataset_residencias_distancia)
        
        print(f"Dataset Cursos Presenciais: {dataset_cursos_presencial.data}")
        print(f"Dataset Cursos A Distância: {dataset_cursos_distancia.data}")
        print(f"Dataset Residências Presenciais: {dataset_residencias_presencial.data}")
        print(f"Dataset Residências A Distância: {dataset_residencias_distancia.data}")
        print(f"Dataset dados: {dados_grafico.datasets}")
        print(f"Dataset labels: {dados_grafico.labels}")

        # Cria o objeto Grafico e define os dados
        grafico = Grafico()
        grafico.data = dados_grafico

        # Converte o gráfico para JSON e cria a resposta
        retorno = messages_pb2.PPGLSJson(nome='grafico_quant_cursos_e_residencias_por_modali', json=json.dumps(grafico.to_dict()))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJson())
    

@app_celery_queries.task
def tarefa_quant_resi_por_modali_por_ano( anoi: int, anof: int):
    """
        Retorna a quantidade de cursos por modalidade em um determinado periodo de ano 
        Parâmetros:
            anoi(int): Ano inicial.
            anof(int): Ano final.
    """
    try:
        respostaDict = queries_cursos.quant_resi_por_modali_por_ano(anoi, anof)
        print("Resultado da Consulta:", respostaDict)
        
        # Verifica se a resposta não é None e é uma lista
        if respostaDict is None or not isinstance(respostaDict, list):
            raise ValueError("A resposta da consulta é inválida ou está vazia.")
        
    
        dataset_presencial = DataSet()
        dataset_distancia = DataSet()
        dados_grafico = DadosGrafico()
        dataset_presencial.label = 'Presencial'
        dataset_distancia.label = 'A Distância'

        dataset_presencial.data = [float(item['qtd_especializacoes']) for item in respostaDict if item['modalidade'] == 'P']
        print(f"Dataset Presencial: {dataset_presencial.data}")

        dataset_distancia.data = [float(item['qtd_especializacoes']) for item in respostaDict if item['modalidade'] == 'D']
        print(f"Dataset A Distância: {dataset_distancia.data}")

        # Define os rótulos dos gráficos com os anos distintos
        labels = [str(item['ano']) for item in respostaDict]
        dados_grafico.labels = sorted(set(labels))

        dados_grafico.datasets.append(dataset_presencial)
        print(f"Dataset dados: {dados_grafico.datasets}")
        dados_grafico.datasets.append(dataset_distancia)
        print(f"Dataset labels: {dados_grafico.labels}")
        
        # Cria o objeto Grafico e define os dados
        grafico = Grafico()
        grafico.data = dados_grafico

        # Converte o gráfico para JSON e cria a resposta
        retorno = messages_pb2.PPGLSJson(nome='grafico_quant_resi_por_modali', json=json.dumps(grafico.to_dict()))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJson())

@app_celery_queries.task
def tarefa_quant_alunos_grad_e_posgra():
    """
        Retorna a quantidade de alunos que fizeram graduação e pós graduação e a quantidade de alunos que fizeram apenas graduação

    """
    try:
    
        # Obter dados da consulta
        respostaDict = queries_cursos.quant_alu_grad_e_posgra()

        # Configurar datasets
        dataset_graduacao_e_pos = DataSet(label='Graduação e Pós-Graduação')
        dataset_graduacao = DataSet(label='Apenas Graduação')

        # Preencher os dados de cada dataset com base na consulta
        dataset_graduacao_e_pos.data = [float(item['total_matriculas']) for item in respostaDict if item['tipo'] == 'Graduacao_e_Pos']
        dataset_graduacao.data = [float(item['total_matriculas']) for item in respostaDict if item['tipo'] == 'Apenas_Graduacao']

        # Criar o objeto DadosGrafico e configurar labels
        dados_grafico = DadosGrafico(
            labels=['Graduação e Pós-Graduação', 'Apenas Graduação'],
            datasets=[dataset_graduacao_e_pos, dataset_graduacao]
        )

        # Criar o objeto Grafico e associar os dados
        grafico = Grafico(data=dados_grafico)

        # Converter o gráfico em JSON e retornar
        retorno = messages_pb2.PPGLSJson(nome='quant_alunos_grad_e_posgra', json=json.dumps(grafico.to_dict()))
        return MessageToDict(retorno)

    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJson())
    
@app_celery_queries.task
def sub_tarefa_quant_alunos_vieram_gradu_por_curso(id: str):
    respostaDict = queries_cursos.quant_alunos_vieram_gradu_por_curso(id)
    return respostaDict

@app_celery_queries.task
def sub_tarefa_quant_alunos_nao_vieram_gradu_por_curso(id: str):
    respostaDict2 = queries_cursos.quant_alunos_nao_vieram_gradu_por_curso(id)
    return respostaDict2


@app_celery_queries.task
def tarefa_quant_alunos_vieram_gradu_e_nao_vieram_por_curso(id: str):
    """
/*       Retorna a quantidade de alunos que vieram de cada curso da graduação em um determinado curso de pós graduação latu sensu em um determinado curso
        
        Parâmetros:
            id(str): Código do curso.

    """
    try:

        sub1 = sub_tarefa_quant_alunos_vieram_gradu_por_curso.delay(id).get(disable_sync_subtasks=False)
        sub2 = sub_tarefa_quant_alunos_nao_vieram_gradu_por_curso.delay(id).get(disable_sync_subtasks=False)


        respostaDict = sub1
        respostaDict2 = sub2

        dataset_alunos_vieram_gradu_por_curso = DataSet()
        dataset_alunos_nao_vieram_gradu_por_curso = DataSet()
        dados_grafico = DadosGrafico()
        dataset_alunos_vieram_gradu_por_curso.label = 'Quantidade Alunos Vieram da Graduçao'
        dataset_alunos_nao_vieram_gradu_por_curso.label = 'Quantidade Alunos Não Vieram da Graduçao'

        dataset_alunos_vieram_gradu_por_curso.data = [float(item['quantidade']) for item in respostaDict]
        dados_grafico.labels = [item['curso_graduacao'] for item in respostaDict]
        print(f"Dataset Alunos Vieram Graduação: {dataset_alunos_vieram_gradu_por_curso.data}")

    
        dataset_alunos_nao_vieram_gradu_por_curso.data = [float(item['total_matriculas']) for item in respostaDict2]
        dados_grafico.labels.append('Não Vieram da Graduçao')
        print(f"Dataset Alunos Não Vieram Graduação: {dataset_alunos_nao_vieram_gradu_por_curso.data}")
       
        dados_grafico.datasets.append(dataset_alunos_vieram_gradu_por_curso)
        print(f"Dataset dados: {dados_grafico.datasets}")
        dados_grafico.datasets.append(dataset_alunos_nao_vieram_gradu_por_curso)
        print(f"Dataset labels: {dados_grafico.labels}")
        
        # Cria o objeto Grafico e define os dados
        grafico = Grafico()
        grafico.data = dados_grafico


        retorno = messages_pb2.PPGLSJson(nome='quant_alunos_vieram_gradu_e_nao_vieram_por_curso', json=json.dumps(grafico.to_dict()))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        print("ERRO")
        return MessageToDict(messages_pb2.PPGLSJson())

@app_celery_queries.task
def tarefa_temp_med_conclu_por_curso(id: str):
    """
       Retorna o tempo medio de conclusao determinado curso de pós graduação latu sensu
        Parâmetros:
            id(str): Código do curso.
    """
    try:
        respostaDict = queries_cursos.temp_med_conclu_por_curso(id)
        dataset = DataSet()
        dados_grafico = DadosGrafico()
        dataset.label = 'Tempo Médio de Conclusão'

        dataset.data = [float(item['media_quantidade_meses']) for item in respostaDict]

        dados_grafico.datasets.append(dataset)

        grafico = Grafico()
        grafico.data = dados_grafico
        
        retorno = messages_pb2.PpgJson(nome='temp_med_conclu_por_curso', json=json.dumps(grafico.to_dict()))
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

        formas = queries_cursos.forma_ingresso(id=id, anoi=anoi, anof=anof)
        dataset = DataSet()
        dados_grafico = DadosGrafico()
        dataset.label = 'Quantidade de Ingressantes'

        dataset.data = [item['descricao'] for item in formas]
        dados_grafico.labels = [item['count'] for item in formas]
        
        dados_grafico.datasets.append(dataset)

        grafico = Grafico()
        grafico.data = dados_grafico
        message = messages_pb2.PPGLSJson(nome='graficoFormaIngresso', json=json.dumps(grafico.to_dict()))
        return MessageToDict(message)

    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJson())

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
        dataset = DataSet()
        dados_grafico = DadosGrafico()
        dataset.label = 'Deficiência'

        # Tratamento do campo necessidade especial
        for entry in respostaDict:
            if 'necespecial' in entry:
                # Colocando em maiúsculas e removendo texto entre parênteses
                entry['necespecial'] = re.sub(r'\s*\(.*?\)\s*', '', entry['necespecial']).upper()

        dataset.data = [item['count'] for item in respostaDict]
        dados_grafico.labels = [item['necespecial'] for item in respostaDict]

        dados_grafico.datasets.append(dataset)

        grafico = Grafico()
        grafico.data = dados_grafico
        retorno = messages_pb2.PPGLSJson(nome='alunos_necessidade_espec', json=json.dumps(grafico.to_dict()))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJson())

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
        dataset_naturalidade = DataSet()
        dataset_latitude = DataSet()
        dataset_longitude = DataSet()
        dataset_estado = DataSet()
        dataset_quantidade_alunos = DataSet()
        dados_grafico = DadosGrafico()

        dataset_naturalidade.label = 'Naturalidade'
        dataset_latitude.label = 'latitude'
        dataset_longitude.label = 'longitude'
        dataset_estado.label = 'estado'
        dataset_quantidade_alunos.label = 'quantidade_alunos'


        dataset_naturalidade.data = [item['naturalidade'] for item in respostaDict]
        print(f"Dataset Naturalidade: {dataset_naturalidade.data}")
        dataset_latitude.data = [float(item['latitude']) for item in respostaDict]
        print(f"Dataset Naturalidade: {dataset_latitude.data}")
        dataset_longitude.data = [float(item['longitude']) for item in respostaDict]
        print(f"Dataset Naturalidade: {dataset_longitude.data}")
        dataset_estado.data = [[item['estado']] for item in respostaDict]
        print(f"Dataset Naturalidade: {dataset_estado.data}")
        dataset_quantidade_alunos.data = [float(item['quantidade_alunos']) for item in respostaDict]
        print(f"Dataset Naturalidade: {dataset_quantidade_alunos.data}")



        dados_grafico.datasets.append(dataset_naturalidade)
        dados_grafico.datasets.append(dataset_latitude)
        dados_grafico.datasets.append(dataset_longitude)
        dados_grafico.datasets.append(dataset_estado)
        dados_grafico.datasets.append(dataset_quantidade_alunos)

        grafico = Grafico()
        grafico.data = dados_grafico
        retorno = messages_pb2.PPGLSJson(nome='natu_alunos', json=json.dumps(grafico.to_dict()))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJson())

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
        dataset_muito_branca = DataSet()
        dataset_branca = DataSet()
        dataset_morena_clara = DataSet()
        dataset_media = DataSet()
        dataset_morena_escura = DataSet()
        dataset_negra = DataSet()

        dataset_muito_branca.label = 'Muito Branca'
        dataset_branca.label = 'Branca'
        dataset_morena_clara.label = 'Morena Clara'
        dataset_media.label = 'Média'
        dataset_morena_escura.label = 'Morena Escura'
        dataset_negra.label = 'Negra'

        dados_grafico = DadosGrafico()

        dataset_muito_branca.data = [float(item['numero_alunos']) for item in respostaDict if item['cor'] == '1']
        print(f"Dataset Muito Branca: {dataset_muito_branca.data}")
        dataset_branca.data = [float(item['numero_alunos']) for item in respostaDict if item['cor'] == '2']
        print(f"Dataset Branca: {dataset_branca.data}")
        dataset_morena_clara.data = [float(item['numero_alunos']) for item in respostaDict if item['cor'] == '3']
        print(f"Dataset Morena Clara: {dataset_morena_clara.data}")
        dataset_media.data = [float(item['numero_alunos']) for item in respostaDict if item['cor'] == '4']
        print(f"Dataset Média: {dataset_media.data}")
        dataset_morena_escura.data = [float(item['numero_alunos']) for item in respostaDict if item['cor'] == '5']
        print(f"Morena Escura: {dataset_morena_escura.data}")
        dataset_negra.data = [float(item['numero_alunos']) for item in respostaDict if item['cor'] == '6']
        print(f"Negra: {dataset_negra.data}")

        labels = [str(item['ano']) for item in respostaDict]
        dados_grafico.labels = sorted(set(labels))

        dados_grafico.datasets.append(dataset_muito_branca)
        dados_grafico.datasets.append(dataset_branca)
        dados_grafico.datasets.append(dataset_morena_clara)
        dados_grafico.datasets.append(dataset_media)
        dados_grafico.datasets.append(dataset_morena_escura)
        dados_grafico.datasets.append(dataset_negra)
        
        grafico = Grafico()
        grafico.data = dados_grafico
        
        retorno = messages_pb2.PPGLSJson(nome='quant_alunos_por_cor', json=json.dumps(grafico.to_dict()))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJson())


@app_celery_queries.task
def tarefa_professores(anoi: int, anof :int):
    """
       Retorna todos os professores de cursos de pós-graduação latu

        Parâmetros:
            id(str): Código do curso.
    """
    try:
        respostaDict = queries_cursos.professores(anoi, anof)
        retorno = messages_pb2.PPGLSJson(nome='professores', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJson())


