import { createContext, PropsWithChildren, useState  } from "react";

export type PPGLSContext = {
  variables: Record<string, string>;
  setVariables: (key: string, value: string) => void;
};

export const PPGLSContext = createContext<PPGLSContext>({
  variables: {},
  setVariables: (key, value) => {},
});

export const PPGLSContextProvider = ({ children }: PropsWithChildren) => {
  const [variables, setVariables] = useState({});

  return (
    <PPGLSContext.Provider
      value={{
        variables,
        setVariables: (key, value) =>
          setVariables((prev) => ({ ...prev, [key]: value })),
      }}
    >
      {children}
    </PPGLSContext.Provider>
  );
};
