import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

type GraficoProps = {
  titulo: string;
  descricao: string;
  children: ReactNode;
};

export const Grafico = ({ titulo, descricao, children }: GraficoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{titulo}</CardTitle>
        <CardDescription>
          {descricao}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};
