"use client";
import { useState, useEffect } from "react";

type UseFetcherParams = {
  callback: () => Promise<unknown>;
  depencencies: any[];
};

export const useFetcher = <T = any>({
  callback,
  depencencies,
}: UseFetcherParams) => {
  const [data, setData] = useState<T | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await callback();
      console.log(data);
      setData(data as T);
    };

    fetchData()
      .catch((e) => {
        console.error(e);
        setError(true);
      })
      .finally(() => setIsLoading(false));

    return () => {
      setIsLoading(true);
      setError(false);
    };
  }, [...depencencies]);

  return { data, isLoading, error };
};

