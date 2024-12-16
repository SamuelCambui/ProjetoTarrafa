"use client";
import { getAbaIndicadoresPpg } from "@/service/ppg/service";
import { useEffect, useState } from "react";

type Params = {
  idIes: string;
  idPpg: string;
  anoInicial: number;
  anoFinal: number;
};

export const useAbaIndicadoresPpg = ({
  idIes,
  idPpg,
  anoInicial,
  anoFinal,
}: Params) => {
  const [data, setData] = useState<any>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      const data = await getAbaIndicadoresPpg(
        idIes,
        idPpg,
        anoInicial,
        anoFinal,
      );
      console.log(data);
      setData(data);
    };

    fetchData()
      .catch((e) => console.error(e))
      .finally(() => setIsLoading(false));
  }, [anoInicial, anoFinal]);

  return { data, isLoading };
};
