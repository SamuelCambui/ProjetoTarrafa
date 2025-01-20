import React, { createContext, useContext, ReactNode } from "react";
// import useDad from "@/hooks/ppg/use-dados-home";
import useDadosProgramas from "@/hooks/ppg/use-dados-programas";
import { Programa } from "../definitions";

interface DataContextType {
  data: any;
  isLoading: boolean;
}

const DadosHomeContext = createContext<DataContextType>({
  data: null,
  isLoading: false,
});

export const useDadosHomeContext = () => useContext(DadosHomeContext);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading } = useDadosProgramas("3727"); 

  return (
    <DadosHomeContext.Provider value={{ data, isLoading }}>
      {children}
    </DadosHomeContext.Provider>
  );
};
