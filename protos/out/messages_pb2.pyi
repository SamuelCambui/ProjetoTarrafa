from google.protobuf.internal import containers as _containers
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Iterable as _Iterable, Mapping as _Mapping, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class HomeRequest(_message.Message):
    __slots__ = ("id_ies", "anoi", "anof", "produto", "fonte", "aresta")
    ID_IES_FIELD_NUMBER: _ClassVar[int]
    ANOI_FIELD_NUMBER: _ClassVar[int]
    ANOF_FIELD_NUMBER: _ClassVar[int]
    PRODUTO_FIELD_NUMBER: _ClassVar[int]
    FONTE_FIELD_NUMBER: _ClassVar[int]
    ARESTA_FIELD_NUMBER: _ClassVar[int]
    id_ies: str
    anoi: int
    anof: int
    produto: str
    fonte: str
    aresta: str
    def __init__(self, id_ies: _Optional[str] = ..., anoi: _Optional[int] = ..., anof: _Optional[int] = ..., produto: _Optional[str] = ..., fonte: _Optional[str] = ..., aresta: _Optional[str] = ...) -> None: ...

class HomeResponse(_message.Message):
    __slots__ = ("nome", "json")
    NOME_FIELD_NUMBER: _ClassVar[int]
    JSON_FIELD_NUMBER: _ClassVar[int]
    nome: str
    json: str
    def __init__(self, nome: _Optional[str] = ..., json: _Optional[str] = ...) -> None: ...

class PpgRequest(_message.Message):
    __slots__ = ("id", "anoi", "anof")
    ID_FIELD_NUMBER: _ClassVar[int]
    ANOI_FIELD_NUMBER: _ClassVar[int]
    ANOF_FIELD_NUMBER: _ClassVar[int]
    id: str
    anoi: int
    anof: int
    def __init__(self, id: _Optional[str] = ..., anoi: _Optional[int] = ..., anof: _Optional[int] = ...) -> None: ...

class PpgJson(_message.Message):
    __slots__ = ("nome", "json")
    NOME_FIELD_NUMBER: _ClassVar[int]
    JSON_FIELD_NUMBER: _ClassVar[int]
    nome: str
    json: str
    def __init__(self, nome: _Optional[str] = ..., json: _Optional[str] = ...) -> None: ...

class PpgResponse(_message.Message):
    __slots__ = ("item",)
    ITEM_FIELD_NUMBER: _ClassVar[int]
    item: _containers.RepeatedCompositeFieldContainer[PpgJson]
    def __init__(self, item: _Optional[_Iterable[_Union[PpgJson, _Mapping]]] = ...) -> None: ...

class LogoutRequest(_message.Message):
    __slots__ = ("username",)
    USERNAME_FIELD_NUMBER: _ClassVar[int]
    username: str
    def __init__(self, username: _Optional[str] = ...) -> None: ...

class LogoutResponse(_message.Message):
    __slots__ = ("logout",)
    LOGOUT_FIELD_NUMBER: _ClassVar[int]
    logout: bool
    def __init__(self, logout: bool = ...) -> None: ...

class LoginRequest(_message.Message):
    __slots__ = ("username", "password")
    USERNAME_FIELD_NUMBER: _ClassVar[int]
    PASSWORD_FIELD_NUMBER: _ClassVar[int]
    username: str
    password: str
    def __init__(self, username: _Optional[str] = ..., password: _Optional[str] = ...) -> None: ...

class LoginResponse(_message.Message):
    __slots__ = ("usuario", "erro")
    USUARIO_FIELD_NUMBER: _ClassVar[int]
    ERRO_FIELD_NUMBER: _ClassVar[int]
    usuario: UsuarioDados
    erro: bool
    def __init__(self, usuario: _Optional[_Union[UsuarioDados, _Mapping]] = ..., erro: bool = ...) -> None: ...

class LoginResponseFormulario(_message.Message):
    __slots__ = ("usuario", "erro")
    USUARIO_FIELD_NUMBER: _ClassVar[int]
    ERRO_FIELD_NUMBER: _ClassVar[int]
    usuario: UsuarioDadosFormulario
    erro: bool
    def __init__(self, usuario: _Optional[_Union[UsuarioDadosFormulario, _Mapping]] = ..., erro: bool = ...) -> None: ...

class UsuarioDados(_message.Message):
    __slots__ = ("id_lattes", "email", "nome", "is_superuser", "is_admin", "id_ies", "nome_ies", "sigla_ies", "link_avatar")
    ID_LATTES_FIELD_NUMBER: _ClassVar[int]
    EMAIL_FIELD_NUMBER: _ClassVar[int]
    NOME_FIELD_NUMBER: _ClassVar[int]
    IS_SUPERUSER_FIELD_NUMBER: _ClassVar[int]
    IS_ADMIN_FIELD_NUMBER: _ClassVar[int]
    ID_IES_FIELD_NUMBER: _ClassVar[int]
    NOME_IES_FIELD_NUMBER: _ClassVar[int]
    SIGLA_IES_FIELD_NUMBER: _ClassVar[int]
    LINK_AVATAR_FIELD_NUMBER: _ClassVar[int]
    id_lattes: str
    email: str
    nome: str
    is_superuser: bool
    is_admin: bool
    id_ies: str
    nome_ies: str
    sigla_ies: str
    link_avatar: str
    def __init__(self, id_lattes: _Optional[str] = ..., email: _Optional[str] = ..., nome: _Optional[str] = ..., is_superuser: bool = ..., is_admin: bool = ..., id_ies: _Optional[str] = ..., nome_ies: _Optional[str] = ..., sigla_ies: _Optional[str] = ..., link_avatar: _Optional[str] = ...) -> None: ...

class UsuarioDadosFormulario(_message.Message):
    __slots__ = ("id_lattes", "nome", "email", "is_coordenador", "is_admin")
    ID_LATTES_FIELD_NUMBER: _ClassVar[int]
    NOME_FIELD_NUMBER: _ClassVar[int]
    EMAIL_FIELD_NUMBER: _ClassVar[int]
    IS_COORDENADOR_FIELD_NUMBER: _ClassVar[int]
    IS_ADMIN_FIELD_NUMBER: _ClassVar[int]
    id_lattes: str
    nome: str
    email: str
    is_coordenador: bool
    is_admin: bool
    def __init__(self, id_lattes: _Optional[str] = ..., nome: _Optional[str] = ..., email: _Optional[str] = ..., is_coordenador: bool = ..., is_admin: bool = ...) -> None: ...

class CriacaoUsuarioRequest(_message.Message):
    __slots__ = ("usuario_base", "password")
    USUARIO_BASE_FIELD_NUMBER: _ClassVar[int]
    PASSWORD_FIELD_NUMBER: _ClassVar[int]
    usuario_base: UsuarioDados
    password: str
    def __init__(self, usuario_base: _Optional[_Union[UsuarioDados, _Mapping]] = ..., password: _Optional[str] = ...) -> None: ...

class CriacaoUsuarioFormularioRequest(_message.Message):
    __slots__ = ("usuario_base", "password")
    USUARIO_BASE_FIELD_NUMBER: _ClassVar[int]
    PASSWORD_FIELD_NUMBER: _ClassVar[int]
    usuario_base: UsuarioDadosFormulario
    password: str
    def __init__(self, usuario_base: _Optional[_Union[UsuarioDadosFormulario, _Mapping]] = ..., password: _Optional[str] = ...) -> None: ...

class UsuarioRequest(_message.Message):
    __slots__ = ("email",)
    EMAIL_FIELD_NUMBER: _ClassVar[int]
    email: str
    def __init__(self, email: _Optional[str] = ...) -> None: ...

class UsuarioResponse(_message.Message):
    __slots__ = ("usuario",)
    USUARIO_FIELD_NUMBER: _ClassVar[int]
    usuario: UsuarioDados
    def __init__(self, usuario: _Optional[_Union[UsuarioDados, _Mapping]] = ...) -> None: ...

class UsuarioFormularioResponse(_message.Message):
    __slots__ = ("usuario",)
    USUARIO_FIELD_NUMBER: _ClassVar[int]
    usuario: UsuarioDadosFormulario
    def __init__(self, usuario: _Optional[_Union[UsuarioDadosFormulario, _Mapping]] = ...) -> None: ...

class ListaUsuariosFormularioResponse(_message.Message):
    __slots__ = ("item",)
    ITEM_FIELD_NUMBER: _ClassVar[int]
    item: _containers.RepeatedCompositeFieldContainer[UsuarioDadosFormulario]
    def __init__(self, item: _Optional[_Iterable[_Union[UsuarioDadosFormulario, _Mapping]]] = ...) -> None: ...

class AlteracaoUsuarioResponse(_message.Message):
    __slots__ = ("status", "menssagem")
    STATUS_FIELD_NUMBER: _ClassVar[int]
    MENSSAGEM_FIELD_NUMBER: _ClassVar[int]
    status: bool
    menssagem: str
    def __init__(self, status: bool = ..., menssagem: _Optional[str] = ...) -> None: ...

class ListaUsuariosResponse(_message.Message):
    __slots__ = ("item",)
    ITEM_FIELD_NUMBER: _ClassVar[int]
    item: _containers.RepeatedCompositeFieldContainer[UsuarioResponse]
    def __init__(self, item: _Optional[_Iterable[_Union[UsuarioResponse, _Mapping]]] = ...) -> None: ...

class PPGLSRequest(_message.Message):
    __slots__ = ("id_disc", "id_ies", "id_curso", "anoi", "anof")
    ID_DISC_FIELD_NUMBER: _ClassVar[int]
    ID_IES_FIELD_NUMBER: _ClassVar[int]
    ID_CURSO_FIELD_NUMBER: _ClassVar[int]
    ANOI_FIELD_NUMBER: _ClassVar[int]
    ANOF_FIELD_NUMBER: _ClassVar[int]
    id_disc: str
    id_ies: str
    id_curso: str
    anoi: int
    anof: int
    def __init__(self, id_disc: _Optional[str] = ..., id_ies: _Optional[str] = ..., id_curso: _Optional[str] = ..., anoi: _Optional[int] = ..., anof: _Optional[int] = ...) -> None: ...

class PPGLSJson(_message.Message):
    __slots__ = ("nome", "json")
    NOME_FIELD_NUMBER: _ClassVar[int]
    JSON_FIELD_NUMBER: _ClassVar[int]
    nome: str
    json: str
    def __init__(self, nome: _Optional[str] = ..., json: _Optional[str] = ...) -> None: ...

class PPGLSResponse(_message.Message):
    __slots__ = ("item",)
    ITEM_FIELD_NUMBER: _ClassVar[int]
    item: _containers.RepeatedCompositeFieldContainer[PPGLSJson]
    def __init__(self, item: _Optional[_Iterable[_Union[PPGLSJson, _Mapping]]] = ...) -> None: ...

class FormularioSerchPPGLSRequest(_message.Message):
    __slots__ = ("cpf", "tipo")
    CPF_FIELD_NUMBER: _ClassVar[int]
    TIPO_FIELD_NUMBER: _ClassVar[int]
    cpf: str
    tipo: int
    def __init__(self, cpf: _Optional[str] = ..., tipo: _Optional[int] = ...) -> None: ...

class FormularioIndicadoresRequest(_message.Message):
    __slots__ = ("nome_formulario", "data_inicio")
    NOME_FORMULARIO_FIELD_NUMBER: _ClassVar[int]
    DATA_INICIO_FIELD_NUMBER: _ClassVar[int]
    nome_formulario: str
    data_inicio: str
    def __init__(self, nome_formulario: _Optional[str] = ..., data_inicio: _Optional[str] = ...) -> None: ...

class FormularioPPGLSRequest(_message.Message):
    __slots__ = ("item",)
    ITEM_FIELD_NUMBER: _ClassVar[int]
    item: _containers.RepeatedCompositeFieldContainer[FormularioPPGLSJson]
    def __init__(self, item: _Optional[_Iterable[_Union[FormularioPPGLSJson, _Mapping]]] = ...) -> None: ...

class FormularioPPGLSJson(_message.Message):
    __slots__ = ("nome", "json")
    NOME_FIELD_NUMBER: _ClassVar[int]
    JSON_FIELD_NUMBER: _ClassVar[int]
    nome: str
    json: str
    def __init__(self, nome: _Optional[str] = ..., json: _Optional[str] = ...) -> None: ...

class FormularioPPGLSResponse(_message.Message):
    __slots__ = ("item",)
    ITEM_FIELD_NUMBER: _ClassVar[int]
    item: _containers.RepeatedCompositeFieldContainer[FormularioPPGLSJson]
    def __init__(self, item: _Optional[_Iterable[_Union[FormularioPPGLSJson, _Mapping]]] = ...) -> None: ...
