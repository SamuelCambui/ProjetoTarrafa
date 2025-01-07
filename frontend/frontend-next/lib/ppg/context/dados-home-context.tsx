import React, { createContext, useContext, ReactNode } from "react";
import useDadosHome from "@/hooks/ppg/use-dados-home";

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
  const { data, isLoading } = useDadosHome("3727"); 

  return (
    <DadosHomeContext.Provider value={{ data, isLoading }}>
      {children}
    </DadosHomeContext.Provider>
  );
};
