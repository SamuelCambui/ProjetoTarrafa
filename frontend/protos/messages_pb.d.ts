// package: protos
// file: messages.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class Empty extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Empty.AsObject;
    static toObject(includeInstance: boolean, msg: Empty): Empty.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Empty, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Empty;
    static deserializeBinaryFromReader(message: Empty, reader: jspb.BinaryReader): Empty;
}

export namespace Empty {
    export type AsObject = {
    }
}

export class HomeRequest extends jspb.Message { 

    hasIdIes(): boolean;
    clearIdIes(): void;
    getIdIes(): string | undefined;
    setIdIes(value: string): HomeRequest;

    hasAnoi(): boolean;
    clearAnoi(): void;
    getAnoi(): number | undefined;
    setAnoi(value: number): HomeRequest;

    hasAnof(): boolean;
    clearAnof(): void;
    getAnof(): number | undefined;
    setAnof(value: number): HomeRequest;

    hasProduto(): boolean;
    clearProduto(): void;
    getProduto(): string | undefined;
    setProduto(value: string): HomeRequest;

    hasFonte(): boolean;
    clearFonte(): void;
    getFonte(): string | undefined;
    setFonte(value: string): HomeRequest;

    hasAresta(): boolean;
    clearAresta(): void;
    getAresta(): string | undefined;
    setAresta(value: string): HomeRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): HomeRequest.AsObject;
    static toObject(includeInstance: boolean, msg: HomeRequest): HomeRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: HomeRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): HomeRequest;
    static deserializeBinaryFromReader(message: HomeRequest, reader: jspb.BinaryReader): HomeRequest;
}

export namespace HomeRequest {
    export type AsObject = {
        idIes?: string,
        anoi?: number,
        anof?: number,
        produto?: string,
        fonte?: string,
        aresta?: string,
    }
}

export class HomeResponse extends jspb.Message { 

    hasNome(): boolean;
    clearNome(): void;
    getNome(): string | undefined;
    setNome(value: string): HomeResponse;

    hasJson(): boolean;
    clearJson(): void;
    getJson(): string | undefined;
    setJson(value: string): HomeResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): HomeResponse.AsObject;
    static toObject(includeInstance: boolean, msg: HomeResponse): HomeResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: HomeResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): HomeResponse;
    static deserializeBinaryFromReader(message: HomeResponse, reader: jspb.BinaryReader): HomeResponse;
}

export namespace HomeResponse {
    export type AsObject = {
        nome?: string,
        json?: string,
    }
}

export class PpgRequest extends jspb.Message { 

    hasIdIes(): boolean;
    clearIdIes(): void;
    getIdIes(): string | undefined;
    setIdIes(value: string): PpgRequest;

    hasIdPpg(): boolean;
    clearIdPpg(): void;
    getIdPpg(): string | undefined;
    setIdPpg(value: string): PpgRequest;

    hasAnoi(): boolean;
    clearAnoi(): void;
    getAnoi(): number | undefined;
    setAnoi(value: number): PpgRequest;

    hasAnof(): boolean;
    clearAnof(): void;
    getAnof(): number | undefined;
    setAnof(value: number): PpgRequest;

    hasNota(): boolean;
    clearNota(): void;
    getNota(): string | undefined;
    setNota(value: string): PpgRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PpgRequest.AsObject;
    static toObject(includeInstance: boolean, msg: PpgRequest): PpgRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PpgRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PpgRequest;
    static deserializeBinaryFromReader(message: PpgRequest, reader: jspb.BinaryReader): PpgRequest;
}

export namespace PpgRequest {
    export type AsObject = {
        idIes?: string,
        idPpg?: string,
        anoi?: number,
        anof?: number,
        nota?: string,
    }
}

export class PpgJson extends jspb.Message { 

    hasNome(): boolean;
    clearNome(): void;
    getNome(): string | undefined;
    setNome(value: string): PpgJson;

    hasJson(): boolean;
    clearJson(): void;
    getJson(): string | undefined;
    setJson(value: string): PpgJson;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PpgJson.AsObject;
    static toObject(includeInstance: boolean, msg: PpgJson): PpgJson.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PpgJson, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PpgJson;
    static deserializeBinaryFromReader(message: PpgJson, reader: jspb.BinaryReader): PpgJson;
}

export namespace PpgJson {
    export type AsObject = {
        nome?: string,
        json?: string,
    }
}

export class PpgResponse extends jspb.Message { 
    clearItemList(): void;
    getItemList(): Array<PpgJson>;
    setItemList(value: Array<PpgJson>): PpgResponse;
    addItem(value?: PpgJson, index?: number): PpgJson;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PpgResponse.AsObject;
    static toObject(includeInstance: boolean, msg: PpgResponse): PpgResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PpgResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PpgResponse;
    static deserializeBinaryFromReader(message: PpgResponse, reader: jspb.BinaryReader): PpgResponse;
}

export namespace PpgResponse {
    export type AsObject = {
        itemList: Array<PpgJson.AsObject>,
    }
}

export class LogoutRequest extends jspb.Message { 
    getUsername(): string;
    setUsername(value: string): LogoutRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): LogoutRequest.AsObject;
    static toObject(includeInstance: boolean, msg: LogoutRequest): LogoutRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: LogoutRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): LogoutRequest;
    static deserializeBinaryFromReader(message: LogoutRequest, reader: jspb.BinaryReader): LogoutRequest;
}

export namespace LogoutRequest {
    export type AsObject = {
        username: string,
    }
}

export class LogoutResponse extends jspb.Message { 
    getLogout(): boolean;
    setLogout(value: boolean): LogoutResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): LogoutResponse.AsObject;
    static toObject(includeInstance: boolean, msg: LogoutResponse): LogoutResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: LogoutResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): LogoutResponse;
    static deserializeBinaryFromReader(message: LogoutResponse, reader: jspb.BinaryReader): LogoutResponse;
}

export namespace LogoutResponse {
    export type AsObject = {
        logout: boolean,
    }
}

export class LoginRequest extends jspb.Message { 
    getUsername(): string;
    setUsername(value: string): LoginRequest;
    getPassword(): string;
    setPassword(value: string): LoginRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): LoginRequest.AsObject;
    static toObject(includeInstance: boolean, msg: LoginRequest): LoginRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: LoginRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): LoginRequest;
    static deserializeBinaryFromReader(message: LoginRequest, reader: jspb.BinaryReader): LoginRequest;
}

export namespace LoginRequest {
    export type AsObject = {
        username: string,
        password: string,
    }
}

export class LoginResponse extends jspb.Message { 

    hasUsuario(): boolean;
    clearUsuario(): void;
    getUsuario(): UsuarioDados | undefined;
    setUsuario(value?: UsuarioDados): LoginResponse;
    getErro(): boolean;
    setErro(value: boolean): LoginResponse;

    hasAccessToken(): boolean;
    clearAccessToken(): void;
    getAccessToken(): string | undefined;
    setAccessToken(value: string): LoginResponse;

    hasRefreshToken(): boolean;
    clearRefreshToken(): void;
    getRefreshToken(): string | undefined;
    setRefreshToken(value: string): LoginResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): LoginResponse.AsObject;
    static toObject(includeInstance: boolean, msg: LoginResponse): LoginResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: LoginResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): LoginResponse;
    static deserializeBinaryFromReader(message: LoginResponse, reader: jspb.BinaryReader): LoginResponse;
}

export namespace LoginResponse {
    export type AsObject = {
        usuario?: UsuarioDados.AsObject,
        erro: boolean,
        accessToken?: string,
        refreshToken?: string,
    }
}

export class CriacaoUsuarioRequest extends jspb.Message { 

    hasUsuarioBase(): boolean;
    clearUsuarioBase(): void;
    getUsuarioBase(): UsuarioDados | undefined;
    setUsuarioBase(value?: UsuarioDados): CriacaoUsuarioRequest;

    hasPassword(): boolean;
    clearPassword(): void;
    getPassword(): string | undefined;
    setPassword(value: string): CriacaoUsuarioRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CriacaoUsuarioRequest.AsObject;
    static toObject(includeInstance: boolean, msg: CriacaoUsuarioRequest): CriacaoUsuarioRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CriacaoUsuarioRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CriacaoUsuarioRequest;
    static deserializeBinaryFromReader(message: CriacaoUsuarioRequest, reader: jspb.BinaryReader): CriacaoUsuarioRequest;
}

export namespace CriacaoUsuarioRequest {
    export type AsObject = {
        usuarioBase?: UsuarioDados.AsObject,
        password?: string,
    }
}

export class LoginResponseFormulario extends jspb.Message { 

    hasUsuario(): boolean;
    clearUsuario(): void;
    getUsuario(): UsuarioDadosFormulario | undefined;
    setUsuario(value?: UsuarioDadosFormulario): LoginResponseFormulario;
    getErro(): boolean;
    setErro(value: boolean): LoginResponseFormulario;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): LoginResponseFormulario.AsObject;
    static toObject(includeInstance: boolean, msg: LoginResponseFormulario): LoginResponseFormulario.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: LoginResponseFormulario, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): LoginResponseFormulario;
    static deserializeBinaryFromReader(message: LoginResponseFormulario, reader: jspb.BinaryReader): LoginResponseFormulario;
}

export namespace LoginResponseFormulario {
    export type AsObject = {
        usuario?: UsuarioDadosFormulario.AsObject,
        erro: boolean,
    }
}

export class UsuarioDados extends jspb.Message { 

    hasIdLattes(): boolean;
    clearIdLattes(): void;
    getIdLattes(): string | undefined;
    setIdLattes(value: string): UsuarioDados;

    hasEmail(): boolean;
    clearEmail(): void;
    getEmail(): string | undefined;
    setEmail(value: string): UsuarioDados;

    hasNome(): boolean;
    clearNome(): void;
    getNome(): string | undefined;
    setNome(value: string): UsuarioDados;

    hasIsSuperuser(): boolean;
    clearIsSuperuser(): void;
    getIsSuperuser(): boolean | undefined;
    setIsSuperuser(value: boolean): UsuarioDados;

    hasIsAdmin(): boolean;
    clearIsAdmin(): void;
    getIsAdmin(): boolean | undefined;
    setIsAdmin(value: boolean): UsuarioDados;

    hasIsActive(): boolean;
    clearIsActive(): void;
    getIsActive(): boolean | undefined;
    setIsActive(value: boolean): UsuarioDados;

    hasIdIes(): boolean;
    clearIdIes(): void;
    getIdIes(): string | undefined;
    setIdIes(value: string): UsuarioDados;

    hasNomeIes(): boolean;
    clearNomeIes(): void;
    getNomeIes(): string | undefined;
    setNomeIes(value: string): UsuarioDados;

    hasSiglaIes(): boolean;
    clearSiglaIes(): void;
    getSiglaIes(): string | undefined;
    setSiglaIes(value: string): UsuarioDados;

    hasLinkAvatar(): boolean;
    clearLinkAvatar(): void;
    getLinkAvatar(): string | undefined;
    setLinkAvatar(value: string): UsuarioDados;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UsuarioDados.AsObject;
    static toObject(includeInstance: boolean, msg: UsuarioDados): UsuarioDados.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UsuarioDados, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UsuarioDados;
    static deserializeBinaryFromReader(message: UsuarioDados, reader: jspb.BinaryReader): UsuarioDados;
}

export namespace UsuarioDados {
    export type AsObject = {
        idLattes?: string,
        email?: string,
        nome?: string,
        isSuperuser?: boolean,
        isAdmin?: boolean,
        isActive?: boolean,
        idIes?: string,
        nomeIes?: string,
        siglaIes?: string,
        linkAvatar?: string,
    }
}

export class UsuarioDadosFormulario extends jspb.Message { 

    hasIdlattes(): boolean;
    clearIdlattes(): void;
    getIdlattes(): string | undefined;
    setIdlattes(value: string): UsuarioDadosFormulario;

    hasNome(): boolean;
    clearNome(): void;
    getNome(): string | undefined;
    setNome(value: string): UsuarioDadosFormulario;

    hasEmail(): boolean;
    clearEmail(): void;
    getEmail(): string | undefined;
    setEmail(value: string): UsuarioDadosFormulario;

    hasIsCoordenador(): boolean;
    clearIsCoordenador(): void;
    getIsCoordenador(): boolean | undefined;
    setIsCoordenador(value: boolean): UsuarioDadosFormulario;

    hasIsAdmin(): boolean;
    clearIsAdmin(): void;
    getIsAdmin(): boolean | undefined;
    setIsAdmin(value: boolean): UsuarioDadosFormulario;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UsuarioDadosFormulario.AsObject;
    static toObject(includeInstance: boolean, msg: UsuarioDadosFormulario): UsuarioDadosFormulario.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UsuarioDadosFormulario, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UsuarioDadosFormulario;
    static deserializeBinaryFromReader(message: UsuarioDadosFormulario, reader: jspb.BinaryReader): UsuarioDadosFormulario;
}

export namespace UsuarioDadosFormulario {
    export type AsObject = {
        idlattes?: string,
        nome?: string,
        email?: string,
        isCoordenador?: boolean,
        isAdmin?: boolean,
    }
}

export class CriacaoUsuarioFormularioRequest extends jspb.Message { 

    hasUsuarioBase(): boolean;
    clearUsuarioBase(): void;
    getUsuarioBase(): UsuarioDadosFormulario | undefined;
    setUsuarioBase(value?: UsuarioDadosFormulario): CriacaoUsuarioFormularioRequest;

    hasPassword(): boolean;
    clearPassword(): void;
    getPassword(): string | undefined;
    setPassword(value: string): CriacaoUsuarioFormularioRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CriacaoUsuarioFormularioRequest.AsObject;
    static toObject(includeInstance: boolean, msg: CriacaoUsuarioFormularioRequest): CriacaoUsuarioFormularioRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CriacaoUsuarioFormularioRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CriacaoUsuarioFormularioRequest;
    static deserializeBinaryFromReader(message: CriacaoUsuarioFormularioRequest, reader: jspb.BinaryReader): CriacaoUsuarioFormularioRequest;
}

export namespace CriacaoUsuarioFormularioRequest {
    export type AsObject = {
        usuarioBase?: UsuarioDadosFormulario.AsObject,
        password?: string,
    }
}

export class UsuarioRequest extends jspb.Message { 

    hasEmail(): boolean;
    clearEmail(): void;
    getEmail(): string | undefined;
    setEmail(value: string): UsuarioRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UsuarioRequest.AsObject;
    static toObject(includeInstance: boolean, msg: UsuarioRequest): UsuarioRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UsuarioRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UsuarioRequest;
    static deserializeBinaryFromReader(message: UsuarioRequest, reader: jspb.BinaryReader): UsuarioRequest;
}

export namespace UsuarioRequest {
    export type AsObject = {
        email?: string,
    }
}

export class UsuarioResponse extends jspb.Message { 

    hasUsuario(): boolean;
    clearUsuario(): void;
    getUsuario(): UsuarioDados | undefined;
    setUsuario(value?: UsuarioDados): UsuarioResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UsuarioResponse.AsObject;
    static toObject(includeInstance: boolean, msg: UsuarioResponse): UsuarioResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UsuarioResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UsuarioResponse;
    static deserializeBinaryFromReader(message: UsuarioResponse, reader: jspb.BinaryReader): UsuarioResponse;
}

export namespace UsuarioResponse {
    export type AsObject = {
        usuario?: UsuarioDados.AsObject,
    }
}

export class UsuarioFormularioResponse extends jspb.Message { 

    hasUsuario(): boolean;
    clearUsuario(): void;
    getUsuario(): UsuarioDadosFormulario | undefined;
    setUsuario(value?: UsuarioDadosFormulario): UsuarioFormularioResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UsuarioFormularioResponse.AsObject;
    static toObject(includeInstance: boolean, msg: UsuarioFormularioResponse): UsuarioFormularioResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UsuarioFormularioResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UsuarioFormularioResponse;
    static deserializeBinaryFromReader(message: UsuarioFormularioResponse, reader: jspb.BinaryReader): UsuarioFormularioResponse;
}

export namespace UsuarioFormularioResponse {
    export type AsObject = {
        usuario?: UsuarioDadosFormulario.AsObject,
    }
}

export class ListaUsuariosFormularioResponse extends jspb.Message { 
    clearItemList(): void;
    getItemList(): Array<UsuarioDadosFormulario>;
    setItemList(value: Array<UsuarioDadosFormulario>): ListaUsuariosFormularioResponse;
    addItem(value?: UsuarioDadosFormulario, index?: number): UsuarioDadosFormulario;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListaUsuariosFormularioResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ListaUsuariosFormularioResponse): ListaUsuariosFormularioResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListaUsuariosFormularioResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListaUsuariosFormularioResponse;
    static deserializeBinaryFromReader(message: ListaUsuariosFormularioResponse, reader: jspb.BinaryReader): ListaUsuariosFormularioResponse;
}

export namespace ListaUsuariosFormularioResponse {
    export type AsObject = {
        itemList: Array<UsuarioDadosFormulario.AsObject>,
    }
}

export class AlteracaoUsuarioResponse extends jspb.Message { 

    hasStatus(): boolean;
    clearStatus(): void;
    getStatus(): boolean | undefined;
    setStatus(value: boolean): AlteracaoUsuarioResponse;

    hasMensagem(): boolean;
    clearMensagem(): void;
    getMensagem(): string | undefined;
    setMensagem(value: string): AlteracaoUsuarioResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): AlteracaoUsuarioResponse.AsObject;
    static toObject(includeInstance: boolean, msg: AlteracaoUsuarioResponse): AlteracaoUsuarioResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: AlteracaoUsuarioResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): AlteracaoUsuarioResponse;
    static deserializeBinaryFromReader(message: AlteracaoUsuarioResponse, reader: jspb.BinaryReader): AlteracaoUsuarioResponse;
}

export namespace AlteracaoUsuarioResponse {
    export type AsObject = {
        status?: boolean,
        mensagem?: string,
    }
}

export class ListaUsuariosResponse extends jspb.Message { 
    clearItemList(): void;
    getItemList(): Array<UsuarioResponse>;
    setItemList(value: Array<UsuarioResponse>): ListaUsuariosResponse;
    addItem(value?: UsuarioResponse, index?: number): UsuarioResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListaUsuariosResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ListaUsuariosResponse): ListaUsuariosResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListaUsuariosResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListaUsuariosResponse;
    static deserializeBinaryFromReader(message: ListaUsuariosResponse, reader: jspb.BinaryReader): ListaUsuariosResponse;
}

export namespace ListaUsuariosResponse {
    export type AsObject = {
        itemList: Array<UsuarioResponse.AsObject>,
    }
}

export class VerificarSessaoResponse extends jspb.Message { 
    getAccessToken(): string;
    setAccessToken(value: string): VerificarSessaoResponse;

    hasErro(): boolean;
    clearErro(): void;
    getErro(): boolean | undefined;
    setErro(value: boolean): VerificarSessaoResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): VerificarSessaoResponse.AsObject;
    static toObject(includeInstance: boolean, msg: VerificarSessaoResponse): VerificarSessaoResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: VerificarSessaoResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): VerificarSessaoResponse;
    static deserializeBinaryFromReader(message: VerificarSessaoResponse, reader: jspb.BinaryReader): VerificarSessaoResponse;
}

export namespace VerificarSessaoResponse {
    export type AsObject = {
        accessToken: string,
        erro?: boolean,
    }
}

export class Universidade extends jspb.Message { 

    hasIdIes(): boolean;
    clearIdIes(): void;
    getIdIes(): string | undefined;
    setIdIes(value: string): Universidade;

    hasNome(): boolean;
    clearNome(): void;
    getNome(): string | undefined;
    setNome(value: string): Universidade;

    hasSigla(): boolean;
    clearSigla(): void;
    getSigla(): string | undefined;
    setSigla(value: string): Universidade;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Universidade.AsObject;
    static toObject(includeInstance: boolean, msg: Universidade): Universidade.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Universidade, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Universidade;
    static deserializeBinaryFromReader(message: Universidade, reader: jspb.BinaryReader): Universidade;
}

export namespace Universidade {
    export type AsObject = {
        idIes?: string,
        nome?: string,
        sigla?: string,
    }
}

export class ListaUniversidadesResponse extends jspb.Message { 
    clearItemList(): void;
    getItemList(): Array<Universidade>;
    setItemList(value: Array<Universidade>): ListaUniversidadesResponse;
    addItem(value?: Universidade, index?: number): Universidade;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListaUniversidadesResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ListaUniversidadesResponse): ListaUniversidadesResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListaUniversidadesResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListaUniversidadesResponse;
    static deserializeBinaryFromReader(message: ListaUniversidadesResponse, reader: jspb.BinaryReader): ListaUniversidadesResponse;
}

export namespace ListaUniversidadesResponse {
    export type AsObject = {
        itemList: Array<Universidade.AsObject>,
    }
}

export class PPGLSRequest extends jspb.Message { 

    hasIdDisc(): boolean;
    clearIdDisc(): void;
    getIdDisc(): string | undefined;
    setIdDisc(value: string): PPGLSRequest;

    hasIdIes(): boolean;
    clearIdIes(): void;
    getIdIes(): string | undefined;
    setIdIes(value: string): PPGLSRequest;

    hasIdCurso(): boolean;
    clearIdCurso(): void;
    getIdCurso(): string | undefined;
    setIdCurso(value: string): PPGLSRequest;

    hasAnoi(): boolean;
    clearAnoi(): void;
    getAnoi(): number | undefined;
    setAnoi(value: number): PPGLSRequest;

    hasAnof(): boolean;
    clearAnof(): void;
    getAnof(): number | undefined;
    setAnof(value: number): PPGLSRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PPGLSRequest.AsObject;
    static toObject(includeInstance: boolean, msg: PPGLSRequest): PPGLSRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PPGLSRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PPGLSRequest;
    static deserializeBinaryFromReader(message: PPGLSRequest, reader: jspb.BinaryReader): PPGLSRequest;
}

export namespace PPGLSRequest {
    export type AsObject = {
        idDisc?: string,
        idIes?: string,
        idCurso?: string,
        anoi?: number,
        anof?: number,
    }
}

export class PPGLSJson extends jspb.Message { 

    hasNome(): boolean;
    clearNome(): void;
    getNome(): string | undefined;
    setNome(value: string): PPGLSJson;

    hasJson(): boolean;
    clearJson(): void;
    getJson(): string | undefined;
    setJson(value: string): PPGLSJson;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PPGLSJson.AsObject;
    static toObject(includeInstance: boolean, msg: PPGLSJson): PPGLSJson.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PPGLSJson, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PPGLSJson;
    static deserializeBinaryFromReader(message: PPGLSJson, reader: jspb.BinaryReader): PPGLSJson;
}

export namespace PPGLSJson {
    export type AsObject = {
        nome?: string,
        json?: string,
    }
}

export class PPGLSResponse extends jspb.Message { 
    clearItemList(): void;
    getItemList(): Array<PPGLSJson>;
    setItemList(value: Array<PPGLSJson>): PPGLSResponse;
    addItem(value?: PPGLSJson, index?: number): PPGLSJson;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PPGLSResponse.AsObject;
    static toObject(includeInstance: boolean, msg: PPGLSResponse): PPGLSResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PPGLSResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PPGLSResponse;
    static deserializeBinaryFromReader(message: PPGLSResponse, reader: jspb.BinaryReader): PPGLSResponse;
}

export namespace PPGLSResponse {
    export type AsObject = {
        itemList: Array<PPGLSJson.AsObject>,
    }
}

export class FormularioSerchPPGLSRequest extends jspb.Message { 
    getCpf(): string;
    setCpf(value: string): FormularioSerchPPGLSRequest;
    getTipo(): number;
    setTipo(value: number): FormularioSerchPPGLSRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): FormularioSerchPPGLSRequest.AsObject;
    static toObject(includeInstance: boolean, msg: FormularioSerchPPGLSRequest): FormularioSerchPPGLSRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: FormularioSerchPPGLSRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): FormularioSerchPPGLSRequest;
    static deserializeBinaryFromReader(message: FormularioSerchPPGLSRequest, reader: jspb.BinaryReader): FormularioSerchPPGLSRequest;
}

export namespace FormularioSerchPPGLSRequest {
    export type AsObject = {
        cpf: string,
        tipo: number,
    }
}

export class FormularioIndicadoresRequest extends jspb.Message { 
    getNomeFormulario(): string;
    setNomeFormulario(value: string): FormularioIndicadoresRequest;

    hasDataPreenchimento(): boolean;
    clearDataPreenchimento(): void;
    getDataPreenchimento(): string | undefined;
    setDataPreenchimento(value: string): FormularioIndicadoresRequest;

    hasDataInicio(): boolean;
    clearDataInicio(): void;
    getDataInicio(): string | undefined;
    setDataInicio(value: string): FormularioIndicadoresRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): FormularioIndicadoresRequest.AsObject;
    static toObject(includeInstance: boolean, msg: FormularioIndicadoresRequest): FormularioIndicadoresRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: FormularioIndicadoresRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): FormularioIndicadoresRequest;
    static deserializeBinaryFromReader(message: FormularioIndicadoresRequest, reader: jspb.BinaryReader): FormularioIndicadoresRequest;
}

export namespace FormularioIndicadoresRequest {
    export type AsObject = {
        nomeFormulario: string,
        dataPreenchimento?: string,
        dataInicio?: string,
    }
}

export class FormularioPPGLSRequest extends jspb.Message { 
    clearItemList(): void;
    getItemList(): Array<FormularioPPGLSJson>;
    setItemList(value: Array<FormularioPPGLSJson>): FormularioPPGLSRequest;
    addItem(value?: FormularioPPGLSJson, index?: number): FormularioPPGLSJson;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): FormularioPPGLSRequest.AsObject;
    static toObject(includeInstance: boolean, msg: FormularioPPGLSRequest): FormularioPPGLSRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: FormularioPPGLSRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): FormularioPPGLSRequest;
    static deserializeBinaryFromReader(message: FormularioPPGLSRequest, reader: jspb.BinaryReader): FormularioPPGLSRequest;
}

export namespace FormularioPPGLSRequest {
    export type AsObject = {
        itemList: Array<FormularioPPGLSJson.AsObject>,
    }
}

export class FormularioPPGLSJson extends jspb.Message { 

    hasNome(): boolean;
    clearNome(): void;
    getNome(): string | undefined;
    setNome(value: string): FormularioPPGLSJson;

    hasJson(): boolean;
    clearJson(): void;
    getJson(): string | undefined;
    setJson(value: string): FormularioPPGLSJson;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): FormularioPPGLSJson.AsObject;
    static toObject(includeInstance: boolean, msg: FormularioPPGLSJson): FormularioPPGLSJson.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: FormularioPPGLSJson, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): FormularioPPGLSJson;
    static deserializeBinaryFromReader(message: FormularioPPGLSJson, reader: jspb.BinaryReader): FormularioPPGLSJson;
}

export namespace FormularioPPGLSJson {
    export type AsObject = {
        nome?: string,
        json?: string,
    }
}

export class FormularioPPGLSResponse extends jspb.Message { 
    clearItemList(): void;
    getItemList(): Array<FormularioPPGLSJson>;
    setItemList(value: Array<FormularioPPGLSJson>): FormularioPPGLSResponse;
    addItem(value?: FormularioPPGLSJson, index?: number): FormularioPPGLSJson;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): FormularioPPGLSResponse.AsObject;
    static toObject(includeInstance: boolean, msg: FormularioPPGLSResponse): FormularioPPGLSResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: FormularioPPGLSResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): FormularioPPGLSResponse;
    static deserializeBinaryFromReader(message: FormularioPPGLSResponse, reader: jspb.BinaryReader): FormularioPPGLSResponse;
}

export namespace FormularioPPGLSResponse {
    export type AsObject = {
        itemList: Array<FormularioPPGLSJson.AsObject>,
    }
}

export class VerificarSessaoRequest extends jspb.Message { 
    getRefreshToken(): string;
    setRefreshToken(value: string): VerificarSessaoRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): VerificarSessaoRequest.AsObject;
    static toObject(includeInstance: boolean, msg: VerificarSessaoRequest): VerificarSessaoRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: VerificarSessaoRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): VerificarSessaoRequest;
    static deserializeBinaryFromReader(message: VerificarSessaoRequest, reader: jspb.BinaryReader): VerificarSessaoRequest;
}

export namespace VerificarSessaoRequest {
    export type AsObject = {
        refreshToken: string,
    }
}

export class GradRequest extends jspb.Message { 

    hasId(): boolean;
    clearId(): void;
    getId(): string | undefined;
    setId(value: string): GradRequest;

    hasAnoi(): boolean;
    clearAnoi(): void;
    getAnoi(): number | undefined;
    setAnoi(value: number): GradRequest;

    hasAnof(): boolean;
    clearAnof(): void;
    getAnof(): number | undefined;
    setAnof(value: number): GradRequest;

    hasIdIes(): boolean;
    clearIdIes(): void;
    getIdIes(): string | undefined;
    setIdIes(value: string): GradRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GradRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GradRequest): GradRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GradRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GradRequest;
    static deserializeBinaryFromReader(message: GradRequest, reader: jspb.BinaryReader): GradRequest;
}

export namespace GradRequest {
    export type AsObject = {
        id?: string,
        anoi?: number,
        anof?: number,
        idIes?: string,
    }
}

export class GradDisciplinasRequest extends jspb.Message { 

    hasIdDisc(): boolean;
    clearIdDisc(): void;
    getIdDisc(): string | undefined;
    setIdDisc(value: string): GradDisciplinasRequest;

    hasIdIes(): boolean;
    clearIdIes(): void;
    getIdIes(): string | undefined;
    setIdIes(value: string): GradDisciplinasRequest;

    hasIdCurso(): boolean;
    clearIdCurso(): void;
    getIdCurso(): string | undefined;
    setIdCurso(value: string): GradDisciplinasRequest;

    hasIdGrade(): boolean;
    clearIdGrade(): void;
    getIdGrade(): string | undefined;
    setIdGrade(value: string): GradDisciplinasRequest;

    hasAnoi(): boolean;
    clearAnoi(): void;
    getAnoi(): number | undefined;
    setAnoi(value: number): GradDisciplinasRequest;

    hasAnof(): boolean;
    clearAnof(): void;
    getAnof(): number | undefined;
    setAnof(value: number): GradDisciplinasRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GradDisciplinasRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GradDisciplinasRequest): GradDisciplinasRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GradDisciplinasRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GradDisciplinasRequest;
    static deserializeBinaryFromReader(message: GradDisciplinasRequest, reader: jspb.BinaryReader): GradDisciplinasRequest;
}

export namespace GradDisciplinasRequest {
    export type AsObject = {
        idDisc?: string,
        idIes?: string,
        idCurso?: string,
        idGrade?: string,
        anoi?: number,
        anof?: number,
    }
}

export class GradJson extends jspb.Message { 

    hasNome(): boolean;
    clearNome(): void;
    getNome(): string | undefined;
    setNome(value: string): GradJson;

    hasJson(): boolean;
    clearJson(): void;
    getJson(): string | undefined;
    setJson(value: string): GradJson;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GradJson.AsObject;
    static toObject(includeInstance: boolean, msg: GradJson): GradJson.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GradJson, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GradJson;
    static deserializeBinaryFromReader(message: GradJson, reader: jspb.BinaryReader): GradJson;
}

export namespace GradJson {
    export type AsObject = {
        nome?: string,
        json?: string,
    }
}

export class GradResponse extends jspb.Message { 
    clearItemList(): void;
    getItemList(): Array<GradJson>;
    setItemList(value: Array<GradJson>): GradResponse;
    addItem(value?: GradJson, index?: number): GradJson;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GradResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GradResponse): GradResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GradResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GradResponse;
    static deserializeBinaryFromReader(message: GradResponse, reader: jspb.BinaryReader): GradResponse;
}

export namespace GradResponse {
    export type AsObject = {
        itemList: Array<GradJson.AsObject>,
    }
}
