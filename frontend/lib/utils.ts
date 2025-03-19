import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import { User } from "./ppg/definitions";

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

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const axiosGradInstance = axios.create({
  baseURL: "/api/grad",
});

export const mapearFormatoGrafico = (
  obj: Record<string, any>,
  chave: string | number = "tipo",
  valor: string | number = "quantidade"
) => {
  return Object.entries(obj).map(([key, value]) => ({
    [chave]: key,
    [valor]: value,
  }));
};

export const obterCor = (legenda: string): string => {

  const normalizedLegenda = legenda.trim(); 

  const mapaCores: Record<string, string> = {
    "+12 meses": "text-red-400",
    "entre 8 e 12 meses": "text-orange-400",
    "6 e 8 meses": "text-amber-400",
    "3 e 6 meses": "text-teal-500",  
    "entre 3 e 6 meses": "text-teal-500",  
    "até 2 meses": "text-green-500",
    "menos de 2 meses": "text-green-500",  
    "8 e 12 meses": "text-orange-400",  
  };

  const cor = mapaCores[normalizedLegenda] || "text-gray-400";

  return cor;
};


export const obterPerfil = (usuario: User) => {
  if (usuario.isSuperuser) return "Dono";
  if (usuario.isAdmin) return "Administrador";
  return "Usuário Comum";
};

