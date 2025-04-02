import { UserForm } from "@/types/user_form";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ApiResponse {
  [key: string]: any;
}

export const toApiResponse = (data: any): ApiResponse => {
  let response: ApiResponse = {};
  for (let i = 0; i < data.length; i++) {
    try {
      response[data[i].nome ?? ""] = JSON.parse(data[i].json);
    } catch {
      response[data[i].nome ?? ""] = JSON.parse("{}");
    }
  }

  return response;
};

export const mapearFormatoGrafico = (
  obj: Record<string, any>,
  chave: string | number = "tipo",
  valor: string | number = "quantidade",
) => {
  return Object.entries(obj).map(([key, value]) => ({
    [chave]: key,
    [valor]: value,
  }));
};


export const obterPerfil = (usuario: UserForm) => {
  if (usuario.is_admin) return "Dono";
  if (usuario.is_coordenador) return "Administrador";
  return "Usuário Comum";
};

