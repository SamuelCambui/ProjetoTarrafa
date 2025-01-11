import pytest
from unittest.mock import patch, Mock
import json
from google.protobuf.json_format import MessageToDict
from protos.out import messages_pb2
from backend.worker.tasks_ppg.task_ppg import (
    tarefa_retorna_informacao_ppg,
    tarefa_retorna_anos_ppg,
    agrupar_tarefas_ppg
)

# Dados fictícios para testes
MOCK_PPG_INFO = {
    "nome": "Programa de Pós-Graduação Test",
    "codigo": "12345"
}

MOCK_PPG_ANOS = {
    "anos": [2020, 2021, 2022]
}

@pytest.fixture
def mock_crud():
    with patch('backend.worker.crud.ppg.queries_ppg') as mock:
        yield mock

class TestTarefaPpg:
    def test_tarefa_retorna_informacao_ppg_sucesso(self, mock_crud):
        # Arrange
        id_ppg = "12345"
        mock_crud.retorna_informacao_ppg.return_value = MOCK_PPG_INFO
        
        # Act
        resultado = tarefa_retorna_informacao_ppg(id_ppg)
        
        # Assert
        assert resultado['nome'] == 'informacaoPpg'
        assert json.loads(resultado['json']) == MOCK_PPG_INFO
        mock_crud.retorna_informacao_ppg.assert_called_once_with(id_ppg)

    def test_tarefa_retorna_informacao_ppg_erro(self, mock_crud):
        # Arrange
        id_ppg = "12345"
        mock_crud.retorna_informacao_ppg.side_effect = Exception("Erro de teste")
        
        # Act
        resultado = tarefa_retorna_informacao_ppg(id_ppg)
        
        # Assert
        assert resultado['nome'] == 'informacaoPpg'
        assert resultado['json'] is None

    def test_tarefa_retorna_anos_ppg_sucesso(self, mock_crud):
        # Arrange
        id_ppg = "12345"
        mock_crud.retorna_anos.return_value = MOCK_PPG_ANOS
        
        # Act
        resultado = tarefa_retorna_anos_ppg(id_ppg)
        
        # Assert
        assert resultado['nome'] == 'anosPpg'
        assert json.loads(resultado['json']) == MOCK_PPG_ANOS
        mock_crud.retorna_anos.assert_called_once_with(id_ppg)

    def test_tarefa_retorna_anos_ppg_erro(self, mock_crud):
        # Arrange
        id_ppg = "12345"
        mock_crud.retorna_anos.side_effect = Exception("Erro de teste")
        
        # Act
        resultado = tarefa_retorna_anos_ppg(id_ppg)
        
        # Assert
        assert resultado['nome'] == 'anosPpg'
        assert resultado['json'] is None

    def test_agrupar_tarefas_ppg(self):
        # Arrange
        id_ppg = "12345"
        
        # Act
        tarefas = agrupar_tarefas_ppg(id_ppg)
        
        # Assert
        assert len(tarefas) == 2
        assert all(hasattr(tarefa, 'apply_async') for tarefa in tarefas)