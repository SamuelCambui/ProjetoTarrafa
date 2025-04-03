import pytest
from unittest.mock import patch, MagicMock
from protos.out.messages_pb2 import PpgRequest
from google.protobuf.json_format import MessageToDict

# @pytest.fixture
# def mock_redis():
#     with patch('backend.db.cache.RedisConnector') as mock:
#         redis_instance = MagicMock()
#         mock.return_value = redis_instance
#         yield redis_instance

@pytest.fixture
def grpc_context():
    return MagicMock()

@pytest.fixture
def ppg_service():
    from backend.app.api.grpc_v1.ppg.ppg_grpc import PPG
    return PPG()

@pytest.fixture
def base_request():
    request = PpgRequest()
    request.id_ppg = "3727"
    request.anoi = 2017
    request.anof = 2022
    request.nota = "4"
    return request

@pytest.fixture
def mock_task_result():
    return [
        {
            "nome": "graficoPPG",
            "json": '{"dados": "teste"}'
        }
    ]

def test_obtem_informacao_ppg_sucesso(ppg_service, base_request, grpc_context, mock_task_result):
    """Testa o método ObtemInformacaoPPG com um caso de sucesso"""
    
    # Mock do grupo de tarefas
    with patch('backend.worker.tasks_ppg.task_ppg.agrupar_tarefas_ppg') as mock_agrupar:
        # Mock do retorno do grupo de tarefas
        mock_group = MagicMock()
        mock_group.apply_async.return_value.get.return_value = mock_task_result
        with patch('backend.app.api.grpc_v1.ppg.ppg_grpc.group', return_value=mock_group):
            
            # Executa o método
            response = ppg_service.ObtemInformacaoPPG(base_request, grpc_context)
            
            # Verificações
            assert response is not None
            assert len(response.item) == 1
            assert MessageToDict(response.item[0])["nome"] == "graficoPPG"
            
            # Verifica se o método de agrupar tarefas foi chamado corretamente
            mock_agrupar.assert_called_once_with(base_request.id_ppg)

def test_obtem_informacao_ppg_erro(ppg_service, base_request, grpc_context):
    """Testa o método ObtemInformacaoPPG com um caso de erro"""
    
    with patch('backend.worker.tasks_ppg.task_ppg.agrupar_tarefas_ppg', side_effect=Exception("Erro teste")):
        response = ppg_service.ObtemInformacaoPPG(base_request, grpc_context)
        assert response is None

def test_obtem_indicadores_sucesso(ppg_service, base_request, grpc_context, mock_task_result):
    """Testa o método ObtemIndicadores com um caso de sucesso"""
    
    with patch('backend.worker.tasks_ppg.task_indicadores.agrupar_tarefas_indicadores') as mock_agrupar:
        mock_group = MagicMock()
        mock_group.apply_async.return_value.get.return_value = mock_task_result
        with patch('backend.app.api.grpc_v1.ppg.ppg_grpc.group', return_value=mock_group):
            
            response = ppg_service.ObtemIndicadores(base_request, grpc_context)
            
            assert response is not None
            assert len(response.item) == 1
            
            mock_agrupar.assert_called_once_with(
                base_request.id_ppg,
                base_request.anoi,
                base_request.anof,
                base_request.nota
            )

def test_obtem_indicadores_erro(ppg_service, base_request, grpc_context):
    """Testa o método ObtemIndicadores com um caso de erro"""
    
    with patch('backend.worker.tasks_ppg.task_indicadores.agrupar_tarefas_indicadores', side_effect=Exception("Erro teste")):
        response = ppg_service.ObtemIndicadores(base_request, grpc_context)
        assert response is None

def test_obtem_bancas_sucesso(ppg_service, base_request, grpc_context, mock_task_result):
    """Testa o método ObtemBancas com um caso de sucesso"""
    
    with patch('backend.worker.tasks_ppg.task_bancas.agrupar_tarefas_bancas') as mock_agrupar:
        mock_group = MagicMock()
        mock_group.apply_async.return_value.get.return_value = mock_task_result
        with patch('backend.app.api.grpc_v1.ppg.ppg_grpc.group', return_value=mock_group):
            
            response = ppg_service.ObtemBancas(base_request, grpc_context)
            
            assert response is not None
            assert len(response.item) == 1
            
            mock_agrupar.assert_called_once_with(
                base_request.id_ppg,
                base_request.anoi,
                base_request.anof
            )

def test_obtem_bancas_erro(ppg_service, base_request, grpc_context):
    """Testa o método ObtemBancas com um caso de erro"""
    
    with patch('backend.worker.tasks_ppg.task_bancas.agrupar_tarefas_bancas', side_effect=Exception("Erro teste")):
        response = ppg_service.ObtemBancas(base_request, grpc_context)
        assert response is None

def test_obtem_docentes_sucesso(ppg_service, base_request, grpc_context, mock_task_result):
    """Testa o método ObtemDocentes com um caso de sucesso"""
    
    with patch('backend.worker.tasks_ppg.task_docentes.agrupar_tarefas_docentes') as mock_agrupar:
        mock_group = MagicMock()
        mock_group.apply_async.return_value.get.return_value = mock_task_result
        with patch('backend.app.api.grpc_v1.ppg.ppg_grpc.group', return_value=mock_group):
            
            response = ppg_service.ObtemDocentes(base_request, grpc_context)
            
            assert response is not None
            assert len(response.item) == 1
            
            mock_agrupar.assert_called_once_with(
                base_request.id_ppg,
                base_request.anoi,
                base_request.anof
            )

def test_obtem_docentes_erro(ppg_service, base_request, grpc_context):
    """Testa o método ObtemDocentes com um caso de erro"""
    
    with patch('backend.worker.tasks_ppg.task_docentes.agrupar_tarefas_docentes', side_effect=Exception("Erro teste")):
        response = ppg_service.ObtemDocentes(base_request, grpc_context)
        assert response is None

def test_obtem_egressos_sucesso(ppg_service, base_request, grpc_context, mock_task_result):
    """Testa o método ObtemEgressos com um caso de sucesso"""
    
    with patch('backend.worker.tasks_ppg.task_egressos.agrupar_tarefas_egressos') as mock_agrupar:
        mock_group = MagicMock()
        mock_group.apply_async.return_value.get.return_value = mock_task_result
        with patch('backend.app.api.grpc_v1.ppg.ppg_grpc.group', return_value=mock_group):
            
            response = ppg_service.ObtemEgressos(base_request, grpc_context)
            
            assert response is not None
            assert len(response.item) == 1
            
            mock_agrupar.assert_called_once_with(
                base_request.id_ppg,
                base_request.anoi,
                base_request.anof
            )

def test_obtem_egressos_erro(ppg_service, base_request, grpc_context):
    """Testa o método ObtemEgressos com um caso de erro"""
    
    with patch('backend.worker.tasks_ppg.task_egressos.agrupar_tarefas_egressos', side_effect=Exception("Erro teste")):
        response = ppg_service.ObtemEgressos(base_request, grpc_context)
        assert response is None

def test_obtem_projetos_sucesso(ppg_service, base_request, grpc_context, mock_task_result):
    """Testa o método ObtemProjetos com um caso de sucesso"""
    
    with patch('backend.worker.tasks_ppg.task_projetos.agrupar_tarefas_projetos') as mock_agrupar:
        mock_group = MagicMock()
        mock_group.apply_async.return_value.get.return_value = mock_task_result
        with patch('backend.app.api.grpc_v1.ppg.ppg_grpc.group', return_value=mock_group):
            
            response = ppg_service.ObtemProjetos(base_request, grpc_context)
            
            assert response is not None
            assert len(response.item) == 1
            
            mock_agrupar.assert_called_once_with(
                base_request.id_ppg,
                base_request.anoi,
                base_request.anof
            )

def test_obtem_projetos_erro(ppg_service, base_request, grpc_context):
    """Testa o método ObtemProjetos com um caso de erro"""
    
    with patch('backend.worker.tasks_ppg.task_projetos.agrupar_tarefas_projetos', side_effect=Exception("Erro teste")):
        response = ppg_service.ObtemProjetos(base_request, grpc_context)
        assert response is None