import pytest

@pytest.fixture
def params_tasks_id_ppg():
    return {
        "id_ppg": "32014015006P0"
    }
    
@pytest.fixture
def mocker(pytestconfig):
    """Fixture that provides the mocker"""
    from pytest_mock import MockerFixture
    return MockerFixture(pytestconfig)

def test_tarefa_retorna_informacao_ppg(params_tasks_id_ppg):
    from backend.worker.tasks_ppg.task_ppg import tarefa_retorna_informacao_ppg
    
    resultado = tarefa_retorna_informacao_ppg(**params_tasks_id_ppg)
    
    assert resultado['nome'] == 'informacaoPpg'
    assert "json" in resultado

def test_tarefa_retorna_anos_ppg(params_tasks_id_ppg):
    from backend.worker.tasks_ppg.task_ppg import tarefa_retorna_anos_ppg
    
    resultado = tarefa_retorna_anos_ppg(**params_tasks_id_ppg)
    
    assert resultado['nome'] == 'anosPpg'
    assert "json" in resultado

def test_agrupar_tarefas_ppg(params_tasks_id_ppg):
    from backend.worker.tasks_ppg.task_ppg import agrupar_tarefas_ppg
    
    resultado = agrupar_tarefas_ppg(**params_tasks_id_ppg)
    
    assert isinstance(resultado, list)
    assert len(resultado) == 2  # Verifica se retorna duas tarefas
    
def test_tarefa_retorna_informacao_ppg_com_erro(params_tasks_id_ppg, mocker):
    from backend.worker.tasks_ppg.task_ppg import tarefa_retorna_informacao_ppg
    
    # Simula um erro no crud
    mocker.patch('backend.worker.tasks_ppg.task_ppg.crud.queries_ppg.retorna_informacao_ppg', 
                 side_effect=Exception('Erro simulado'))
    
    resultado = tarefa_retorna_informacao_ppg(**params_tasks_id_ppg)
    
    assert resultado['nome'] == 'informacaoPpg'
    assert "json" not in resultado

def test_tarefa_retorna_anos_ppg_com_erro(params_tasks_id_ppg, mocker):
    from backend.worker.tasks_ppg.task_ppg import tarefa_retorna_anos_ppg
    
    # Simula um erro no crud
    mocker.patch('backend.worker.tasks_ppg.task_ppg.crud.queries_ppg.retorna_anos', 
                 side_effect=Exception('Erro simulado'))
    
    resultado = tarefa_retorna_anos_ppg(**params_tasks_id_ppg)
    
    assert resultado['nome'] == 'anosPpg'
    assert "json" not in resultado