import pytest
from unittest.mock import Mock, patch
from google.protobuf.json_format import ParseDict
from protos.out import messages_pb2
# from backend.schemas.usuario import UsuarioCriacao, UsuarioAtualizacao
from backend.app.api.grpc_v1.usuario_grpc import Usuario

@pytest.fixture
def usuario_service():
    return Usuario()

class MockUsuario:
    def __init__(self, **kwargs):
        self._data = kwargs
        self.is_active = kwargs.get('is_active', True)
    
    def dict(self):
        return self._data

@pytest.fixture
def mock_context():
    return Mock()

@pytest.fixture
def usuario_mock():
    return {
        'id_lattes': '123456',
        'email': 'test@example.com',
        'nome': 'Test User',
        'id_ies': '789',
        'is_active': True,
        'is_superuser': False,
        'is_admin': False,
        'nome_ies': 'Unimontes',
        'sigla_ies': 'UNI',
        'link_avatar': 'link'
    }

@pytest.fixture
def login_request():
    request = Mock()
    request.username = 'test@example.com'
    request.password = 'test_password'
    return request

@pytest.fixture
def usuario_request():
    request = Mock()
    request.id_lattes = '123456'
    return request

@pytest.fixture
def lista_usuarios_request(usuario_mock):
    request = Mock()
    usuario_dados = messages_pb2.UsuarioDadosFront()
    ParseDict(usuario_mock, usuario_dados)
    request.usuario = usuario_dados
    return request

@pytest.fixture
def atualizar_usuario_request(usuario_mock):
    request = Mock()
    usuario_dados = messages_pb2.UsuarioDadosFront()
    ParseDict(usuario_mock, usuario_dados)
    request.usuario = usuario_dados
    request.password = 'new_password'
    return request


def test_login_successo(usuario_service, login_request, mock_context, usuario_mock):
    with patch('backend.worker.task_users.tarefa_autentica_usuario.apply') as mock_auth:
        mock_auth.return_value.get.return_value = MockUsuario(**usuario_mock)
        
        response = usuario_service.Login(login_request, mock_context)
        
        assert not response.erro
        assert response.usuario.id_lattes == usuario_mock['id_lattes']
        assert response.usuario.email == usuario_mock['email']
        mock_auth.assert_called_once_with(
            kwargs={'username': 'test@example.com', 'password': 'test_password'}
        )


def test_login_falha(usuario_service, login_request, mock_context):
    with patch('backend.worker.task_users.tarefa_autentica_usuario.apply') as mock_auth:
        mock_auth.return_value.get.return_value = None
        
        response = usuario_service.Login(login_request, mock_context)
        
        assert response.erro


def test_obtem_usuario_success(usuario_service, usuario_request, mock_context, usuario_mock):
    with patch('backend.worker.task_users.tarefa_verifica_usuario.apply') as mock_verify:
        mock_verify.return_value.get.return_value = MockUsuario(**usuario_mock)
        
        response = usuario_service.ObtemUsuario(usuario_request, mock_context)
        
        assert response.usuario.id_lattes == usuario_mock['id_lattes']
        mock_verify.assert_called_once_with(
            kwargs={'idlattes': '123456'}
        )


def test_obtem_lista_usuarios(usuario_service, lista_usuarios_request, mock_context, usuario_mock):
    with patch('backend.worker.task_users.tarefa_retorna_lista_usuarios.apply') as mock_list:
        mock_list.return_value.get.return_value = [MockUsuario(**usuario_mock)]
        
        response = usuario_service.ObtemListaUsuarios(lista_usuarios_request, mock_context)
        
        assert len(response.item) == 1
        assert response.item[0].usuario.id_lattes == usuario_mock['id_lattes']


def test_atualizar_usuario(usuario_service, atualizar_usuario_request, mock_context):
    with patch('backend.worker.crud.crud_user.user.atualizar_usuario') as mock_update:
        mock_update.return_value = (True, "Usuário atualizado com sucesso")
        
        response = usuario_service.AtualizarUsuario(atualizar_usuario_request, mock_context)
        
        assert response.status
        assert response.menssagem == "Usuário atualizado com sucesso"


def test_criar_usuario(usuario_service, atualizar_usuario_request, mock_context):
    with patch('backend.worker.crud.crud_user.user.criacao_usuario') as mock_create:
        mock_create.return_value = (True, "Usuário criado com sucesso")
        
        response = usuario_service.CriarUsuario(atualizar_usuario_request, mock_context)
        
        assert response.status
        assert response.menssagem == "Usuário criado com sucesso"


def test_deletar_usuario(usuario_service, usuario_request, mock_context):
    with patch('backend.worker.crud.crud_user.user.deletar_usuario') as mock_delete:
        mock_delete.return_value = (True, "Usuário deletado com sucesso")
        
        response = usuario_service.DeletarUsuario(usuario_request, mock_context)
        
        assert response.status
        assert response.menssagem == "Usuário deletado com sucesso"


def test_alternar_status_usuario(usuario_service, usuario_request, mock_context):
    with patch('backend.worker.crud.crud_user.user.alternar_ativo_usuario') as mock_toggle:
        mock_toggle.return_value = (True, "Status do usuário alterado com sucesso")
        
        response = usuario_service.AlternarStatusUsuario(usuario_request, mock_context)
        
        assert response.status
        assert response.menssagem == "Status do usuário alterado com sucesso"