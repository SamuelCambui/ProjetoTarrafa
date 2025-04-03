"use client";
import { Loading } from "@/components/loading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGetCursos } from "@/service/grad/dados/queries";
import { usePathname } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const CursosList = ({ idIes }: { idIes: string }) => {
  const { data, isLoading } = useGetCursos({
    idIes: idIes,
  });
  const [cursos, setCursos] = useState<
    { id: string; nome: string; tipo_curso: string }[] | undefined
  >(data?.cursos);
  const router = useRouter();

  useEffect(() => {
    setCursos(data?.cursos);
  }, [data]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const filteredCursos = data?.cursos.filter((curso: any) =>
      curso.nome
        .toLocaleLowerCase()
        .startsWith(e.target.value.toLocaleLowerCase())
    );
    setCursos(filteredCursos);
  };

  const path = usePathname();

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center">
          <Loading />
        </div>
      ) : (
        <div className="space-y-4">
          <Input placeholder="Buscar..." onChange={handleChange} />
          <div className="grid grid-cols-3 gap-6">
            {cursos?.map((curso, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{curso.nome}</CardTitle>
                  <CardDescription>{curso.tipo_curso}</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-end">
                  <Button
                    size="lg"
                    onClick={() => {
                      router.push(`${path}/${curso.id}`);
                    }}
                  >
                    <span>Gráficos</span>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
