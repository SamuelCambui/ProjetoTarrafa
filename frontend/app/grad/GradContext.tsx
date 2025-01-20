import { createContext, PropsWithChildren, useState } from "react";

export type GradContext = {
  variables: Record<string, string>;
  setVariables: (key: string, value: string) => void;
};

export const GradContext = createContext<GradContext>({
  variables: {},
  setVariables: (key, value) => {},
});

export const GradContextProvider = ({ children }: PropsWithChildren) => {
  const [variables, setVariables] = useState({});

  return (
    <GradContext.Provider
      value={{
        variables,
        setVariables: (key, value) =>
          setVariables((prev) => ({ ...prev, [key]: value })),
      }}
    >
      {children}
    </GradContext.Provider>
  );
};
