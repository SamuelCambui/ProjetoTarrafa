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
import { useParams, usePathname } from "next/navigation";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GradContext } from "../../GradContext";

export const Cursos = () => {
  const { idIes } = useParams();
  const { data, isLoading } = useGetCursos({
    idIes,
  });
  const [cursos, setCursos] = useState<
    { id: string; nome: string; tipo_curso: string }[] | undefined
  >(data?.cursos);

  const router = useRouter();

  const { setVariables } = useContext(GradContext);

  useEffect(() => {
    setCursos(data?.cursos);
  }, [data]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const filteredCursos = data?.cursos.filter((curso: any) =>
      curso.nome
        .toLocaleLowerCase()
        .startsWith(e.target.value.toLocaleLowerCase()),
    );
    setCursos(filteredCursos);
  };

  const [searchInput] = useState<string>();

  const path = usePathname();
  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center">
          <Loading />
        </div>
      ) : (
        <div className="space-y-4">
          <Input
            placeholder="Buscar..."
            onChange={handleChange}
            value={searchInput}
          />
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
                      setVariables(curso.id, curso.nome);
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

export default Cursos;
