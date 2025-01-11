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
    __slots__ = ("id_ies", "id_ppg", "anoi", "anof", "nota")
    ID_IES_FIELD_NUMBER: _ClassVar[int]
    ID_PPG_FIELD_NUMBER: _ClassVar[int]
    ANOI_FIELD_NUMBER: _ClassVar[int]
    ANOF_FIELD_NUMBER: _ClassVar[int]
    NOTA_FIELD_NUMBER: _ClassVar[int]
    id_ies: str
    id_ppg: str
    anoi: int
    anof: int
    nota: str
    def __init__(self, id_ies: _Optional[str] = ..., id_ppg: _Optional[str] = ..., anoi: _Optional[int] = ..., anof: _Optional[int] = ..., nota: _Optional[str] = ...) -> None: ...

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
    __slots__ = ("avatar", "nome", "email", "idlattes", "erro")
    AVATAR_FIELD_NUMBER: _ClassVar[int]
    NOME_FIELD_NUMBER: _ClassVar[int]
    EMAIL_FIELD_NUMBER: _ClassVar[int]
    IDLATTES_FIELD_NUMBER: _ClassVar[int]
    ERRO_FIELD_NUMBER: _ClassVar[int]
    avatar: str
    nome: str
    email: str
    idlattes: str
    erro: bool
    def __init__(self, avatar: _Optional[str] = ..., nome: _Optional[str] = ..., email: _Optional[str] = ..., idlattes: _Optional[str] = ..., erro: bool = ...) -> None: ...

class UsuarioDados(_message.Message):
    __slots__ = ("idLattes", "email", "nome", "isSuperuser", "isAdmin", "idIes", "nomeIes", "siglaIes")
    IDLATTES_FIELD_NUMBER: _ClassVar[int]
    EMAIL_FIELD_NUMBER: _ClassVar[int]
    NOME_FIELD_NUMBER: _ClassVar[int]
    ISSUPERUSER_FIELD_NUMBER: _ClassVar[int]
    ISADMIN_FIELD_NUMBER: _ClassVar[int]
    IDIES_FIELD_NUMBER: _ClassVar[int]
    NOMEIES_FIELD_NUMBER: _ClassVar[int]
    SIGLAIES_FIELD_NUMBER: _ClassVar[int]
    idLattes: str
    email: str
    nome: str
    isSuperuser: bool
    isAdmin: bool
    idIes: str
    nomeIes: str
    siglaIes: str
    def __init__(self, idLattes: _Optional[str] = ..., email: _Optional[str] = ..., nome: _Optional[str] = ..., isSuperuser: bool = ..., isAdmin: bool = ..., idIes: _Optional[str] = ..., nomeIes: _Optional[str] = ..., siglaIes: _Optional[str] = ...) -> None: ...

class CriacaoUsuarioRequest(_message.Message):
    __slots__ = ("usuarioBase", "password")
    USUARIOBASE_FIELD_NUMBER: _ClassVar[int]
    PASSWORD_FIELD_NUMBER: _ClassVar[int]
    usuarioBase: UsuarioDados
    password: str
    def __init__(self, usuarioBase: _Optional[_Union[UsuarioDados, _Mapping]] = ..., password: _Optional[str] = ...) -> None: ...

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
    __slots__ = ("id_disc", "id_ies", "id_curso", "id_grade", "anoi", "anof")
    ID_DISC_FIELD_NUMBER: _ClassVar[int]
    ID_IES_FIELD_NUMBER: _ClassVar[int]
    ID_CURSO_FIELD_NUMBER: _ClassVar[int]
    ID_GRADE_FIELD_NUMBER: _ClassVar[int]
    ANOI_FIELD_NUMBER: _ClassVar[int]
    ANOF_FIELD_NUMBER: _ClassVar[int]
    id_disc: str
    id_ies: str
    id_curso: str
    id_grade: str
    anoi: int
    anof: int
    def __init__(self, id_disc: _Optional[str] = ..., id_ies: _Optional[str] = ..., id_curso: _Optional[str] = ..., id_grade: _Optional[str] = ..., anoi: _Optional[int] = ..., anof: _Optional[int] = ...) -> None: ...

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
    __slots__ = ("masp", "tipo")
    MASP_FIELD_NUMBER: _ClassVar[int]
    TIPO_FIELD_NUMBER: _ClassVar[int]
    masp: int
    tipo: int
    def __init__(self, masp: _Optional[int] = ..., tipo: _Optional[int] = ...) -> None: ...

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

class GradRequest(_message.Message):
    __slots__ = ("id", "anoi", "anof", "id_ies")
    ID_FIELD_NUMBER: _ClassVar[int]
    ANOI_FIELD_NUMBER: _ClassVar[int]
    ANOF_FIELD_NUMBER: _ClassVar[int]
    ID_IES_FIELD_NUMBER: _ClassVar[int]
    id: str
    anoi: int
    anof: int
    id_ies: str
    def __init__(self, id: _Optional[str] = ..., anoi: _Optional[int] = ..., anof: _Optional[int] = ..., id_ies: _Optional[str] = ...) -> None: ...

class GradDisciplinasRequest(_message.Message):
    __slots__ = ("id_disc", "id_ies", "id_curso", "id_grade", "anoi", "anof")
    ID_DISC_FIELD_NUMBER: _ClassVar[int]
    ID_IES_FIELD_NUMBER: _ClassVar[int]
    ID_CURSO_FIELD_NUMBER: _ClassVar[int]
    ID_GRADE_FIELD_NUMBER: _ClassVar[int]
    ANOI_FIELD_NUMBER: _ClassVar[int]
    ANOF_FIELD_NUMBER: _ClassVar[int]
    id_disc: str
    id_ies: str
    id_curso: str
    id_grade: str
    anoi: int
    anof: int
    def __init__(self, id_disc: _Optional[str] = ..., id_ies: _Optional[str] = ..., id_curso: _Optional[str] = ..., id_grade: _Optional[str] = ..., anoi: _Optional[int] = ..., anof: _Optional[int] = ...) -> None: ...

class GradJson(_message.Message):
    __slots__ = ("nome", "json")
    NOME_FIELD_NUMBER: _ClassVar[int]
    JSON_FIELD_NUMBER: _ClassVar[int]
    nome: str
    json: str
    def __init__(self, nome: _Optional[str] = ..., json: _Optional[str] = ...) -> None: ...

class GradResponse(_message.Message):
    __slots__ = ("item",)
    ITEM_FIELD_NUMBER: _ClassVar[int]
    item: _containers.RepeatedCompositeFieldContainer[GradJson]
    def __init__(self, item: _Optional[_Iterable[_Union[GradJson, _Mapping]]] = ...) -> None: ...
