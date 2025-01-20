import { useState } from "react";

export function useSearch<T>(
  data: Array<T>,
  filterFunction: (item: T, term: string) => boolean
) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = data.filter((item) => filterFunction(item, searchTerm));

  return { filteredData, searchTerm, setSearchTerm };
}
