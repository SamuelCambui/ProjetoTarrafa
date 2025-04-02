import { useState } from "react";

export function useSearch<T>(
  dados: Array<T>,
  filterFunction: (item: T, termo: string) => boolean
) {
  const [termoBusca, setTermoBusca] = useState("");

  const dadosFiltrados = dados.filter((item) => filterFunction(item, termoBusca));

  return { dadosFiltrados, termoBusca, setTermoBusca };
}
