import pytest

@pytest.fixture
def params_tasks_projetos():
    return {
        "id": "32014015006P0",
        "anoi": 2017,
        "anof": 2022
    }

@pytest.fixture
def mocker(pytestconfig):
    from pytest_mock import MockerFixture
    return MockerFixture(pytestconfig)

def test_tarefa_retorna_dados_de_projetos(params_tasks_projetos):
    from backend.worker.tasks_ppg.task_projetos import tarefa_retorna_dados_de_projetos
    
    resultado = tarefa_retorna_dados_de_projetos(**params_tasks_projetos)
    
    assert resultado['nome'] == 'dadosDeProjetos'
    assert 'json' in resultado

def test_tarefa_retorna_dados_de_linhas_de_pesquisa(params_tasks_projetos):
    from backend.worker.tasks_ppg.task_projetos import tarefa_retorna_dados_de_linhas_de_pesquisa
    
    resultado = tarefa_retorna_dados_de_linhas_de_pesquisa(**params_tasks_projetos)
    
    assert resultado['nome'] == 'dadosDeLinhasDePesquisa'
    assert 'json' in resultado

def test_tarefa_retorna_dados_de_projetos_e_linhas_de_pesquisa(params_tasks_projetos):
    from backend.worker.tasks_ppg.task_projetos import tarefa_retorna_dados_de_projetos_e_linhas_de_pesquisa
    
    resultado = tarefa_retorna_dados_de_projetos_e_linhas_de_pesquisa(**params_tasks_projetos)
    
    assert resultado['nome'] == 'dadosDeProjetoseLinhasDePesquisa'
    assert 'json' in resultado

def test_tarefa_retorna_dados_de_projetos_com_erro(params_tasks_projetos, mocker):
    from backend.worker.tasks_ppg.task_projetos import tarefa_retorna_dados_de_projetos
    
    mocker.patch('backend.worker.tasks_ppg.task_projetos.crud.queries_ppg.retorna_dados_de_projetos', 
                 side_effect=Exception('Erro simulado'))
    
    resultado = tarefa_retorna_dados_de_projetos(**params_tasks_projetos)
    
    assert resultado['nome'] == 'dadosDeProjetos'
    assert 'json' not in resultado

def test_tarefa_retorna_dados_de_linhas_de_pesquisa_com_erro(params_tasks_projetos, mocker):
    from backend.worker.tasks_ppg.task_projetos import tarefa_retorna_dados_de_linhas_de_pesquisa
    
    mocker.patch('backend.worker.tasks_ppg.task_projetos.crud.queries_ppg.retorna_dados_de_linhas_de_pesquisa', 
                 side_effect=Exception('Erro simulado'))
    
    resultado = tarefa_retorna_dados_de_linhas_de_pesquisa(**params_tasks_projetos)
    
    assert resultado['nome'] == 'dadosDeLinhasDePesquisa'
    assert 'json' not in resultado

def test_tarefa_retorna_dados_de_projetos_e_linhas_de_pesquisa_com_erro(params_tasks_projetos, mocker):
    from backend.worker.tasks_ppg.task_projetos import tarefa_retorna_dados_de_projetos_e_linhas_de_pesquisa
    
    mocker.patch('backend.worker.tasks_ppg.task_projetos.crud.queries_ppg.retorna_dados_de_projetos_e_linhas_de_pesquisa', 
                 side_effect=Exception('Erro simulado'))
    
    resultado = tarefa_retorna_dados_de_projetos_e_linhas_de_pesquisa(**params_tasks_projetos)
    
    assert resultado['nome'] == 'dadosDeProjetoseLinhasDePesquisa'
    assert 'json' not in resultado

def test_agrupar_tarefas_projetos(params_tasks_projetos):
    from backend.worker.tasks_ppg.task_projetos import agrupar_tarefas_projetos
    
    resultado = agrupar_tarefas_projetos(**params_tasks_projetos)
    
    assert isinstance(resultado, list)
    assert len(resultado) == 3  # Verifica se retorna as três tarefas esperadas