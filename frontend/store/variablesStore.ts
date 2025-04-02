import { create } from "zustand";
import { persist } from "zustand/middleware";

const STORAGE_NAME = "variables-storage";

type VariablesStore = {
  variables: any;
  setVariables: (key: string, subKey: string, value: string) => void;
  deleteStorage: () => void;
};

export const useVariablesStore = create<VariablesStore>()(
  persist(
    (set, get) => ({
      variables: {},
      setVariables: (key, subKey, value) =>
        set({
          variables: {
            [key]: {
              ...get().variables[key],
              [subKey]: value,
            },
          },
        }),
      deleteStorage: () => localStorage.removeItem(STORAGE_NAME),
    }),
    {
      name: STORAGE_NAME,
    }
  )
);
