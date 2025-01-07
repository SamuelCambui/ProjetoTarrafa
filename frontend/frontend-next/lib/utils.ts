import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";

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
