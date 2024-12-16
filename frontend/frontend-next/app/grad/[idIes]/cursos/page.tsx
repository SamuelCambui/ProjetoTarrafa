'use client'
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePathname } from "next/navigation";

const cursos = [
  { nome: "Sistemas de Informação", tipo: "Bacharelado", id: "R005" },
  { nome: "Sistemas de Informação", tipo: "Bacharelado", id: "R005" },
  { nome: "Sistemas de Informação", tipo: "Bacharelado", id: "R005" },
  { nome: "Sistemas de Informação", tipo: "Bacharelado", id: "R005" },
];

export const Cursos = () => {
  const path = usePathname()
  return (
    <div className="grid grid-cols-3 gap-6">
      {cursos.map((curso, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{curso.nome}</CardTitle>
            <CardDescription>{curso.tipo}</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-end">
            <Button size="lg">
              <a href={`${path}/${curso.id}`}>Gráficos</a>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default Cursos;
