import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReactNode, useEffect } from "react";
import { Chart } from "@ant-design/plots";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";

type GraficoProps = {
  titulo: string;
  descricao: string;
  children: ReactNode;
  chartRef?: React.RefObject<Chart>;
};

export const Grafico = ({
  titulo,
  descricao,
  children,
  chartRef,
}: GraficoProps) => {
  useEffect(() => {}, [chartRef]);
  const downloadChart = () => {
    console.log("chartRef:", chartRef);
    console.log("chartRef.current:", chartRef?.current);
    console.log("downloadImage method:", chartRef?.current?.downloadImage);

    if (chartRef?.current?.downloadImage) {
      chartRef.current.downloadImage(titulo, "image/jpg");
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {titulo}
          <Button size="icon" variant="outline" onClick={downloadChart}>
            <DownloadIcon />
          </Button>
        </CardTitle>
        <CardDescription>{descricao}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
