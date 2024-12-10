// package: protos
// file: messages.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class PpgRequest extends jspb.Message { 
    getId(): string;
    setId(value: string): PpgRequest;
    getAnoi(): number;
    setAnoi(value: number): PpgRequest;
    getAnof(): number;
    setAnof(value: number): PpgRequest;

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
        id: string,
        anoi: number,
        anof: number,
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
