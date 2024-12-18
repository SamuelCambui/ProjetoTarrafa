// package: protos
// file: messages.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class HomeRequest extends jspb.Message { 
    getIdIes(): string;
    setIdIes(value: string): HomeRequest;

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
        idIes: string,
    }
}

export class PpgRequest extends jspb.Message { 
    getIdIes(): string;
    setIdIes(value: string): PpgRequest;
    getIdPpg(): string;
    setIdPpg(value: string): PpgRequest;
    getAnoi(): number;
    setAnoi(value: number): PpgRequest;
    getAnof(): number;
    setAnof(value: number): PpgRequest;
    getNota(): string;
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
        idIes: string,
        idPpg: string,
        anoi: number,
        anof: number,
        nota: string,
    }
}

export class PpgJson extends jspb.Message { 
    getNome(): string;
    setNome(value: string): PpgJson;
    getJson(): string;
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
        nome: string,
        json: string,
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

    hasAvatar(): boolean;
    clearAvatar(): void;
    getAvatar(): string | undefined;
    setAvatar(value: string): LoginResponse;

    hasNome(): boolean;
    clearNome(): void;
    getNome(): string | undefined;
    setNome(value: string): LoginResponse;

    hasEmail(): boolean;
    clearEmail(): void;
    getEmail(): string | undefined;
    setEmail(value: string): LoginResponse;

    hasIdlattes(): boolean;
    clearIdlattes(): void;
    getIdlattes(): string | undefined;
    setIdlattes(value: string): LoginResponse;
    getErro(): boolean;
    setErro(value: boolean): LoginResponse;

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
        avatar?: string,
        nome?: string,
        email?: string,
        idlattes?: string,
        erro: boolean,
    }
}

export class UsuarioRequest extends jspb.Message { 
    getUsername(): string;
    setUsername(value: string): UsuarioRequest;

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
        username: string,
    }
}

export class UsuarioResponse extends jspb.Message { 
    getIdlattes(): string;
    setIdlattes(value: string): UsuarioResponse;
    getEmail(): string;
    setEmail(value: string): UsuarioResponse;
    getFullName(): string;
    setFullName(value: string): UsuarioResponse;
    getIsSuperuser(): boolean;
    setIsSuperuser(value: boolean): UsuarioResponse;
    getIsAdmin(): boolean;
    setIsAdmin(value: boolean): UsuarioResponse;
    getIdIes(): string;
    setIdIes(value: string): UsuarioResponse;

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
        idlattes: string,
        email: string,
        fullName: string,
        isSuperuser: boolean,
        isAdmin: boolean,
        idIes: string,
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

    hasIdGrade(): boolean;
    clearIdGrade(): void;
    getIdGrade(): string | undefined;
    setIdGrade(value: string): PPGLSRequest;

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
        idGrade?: string,
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
    getMasp(): number;
    setMasp(value: number): FormularioSerchPPGLSRequest;
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
        masp: number,
        tipo: number,
    }
}

export class FormularioIndicadoresRequest extends jspb.Message { 
    getNomeFormulario(): string;
    setNomeFormulario(value: string): FormularioIndicadoresRequest;
    getDataInicio(): string;
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
        dataInicio: string,
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
