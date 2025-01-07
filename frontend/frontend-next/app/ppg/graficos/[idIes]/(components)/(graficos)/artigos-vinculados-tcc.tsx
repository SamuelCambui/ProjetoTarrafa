import { Column } from "@ant-design/plots";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


export const ArtigosViculadosTCCs = ({tccsComQualis}) => {

  const formatarDados = (dados: Object) => {
    return Object.entries(dados).flatMap(([ano, produto]) => 
      Object.entries(produto)
        .map(([qualis, quantidade]) => ({
          ano,          
          quantidade,   
          qualis        
        }))
    );
  };
  

  const config = {
    data: formatarDados(tccsComQualis),
    xField: 'ano',
    yField: 'quantidade',
    colorField: 'qualis',
    stack: true,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle> Artigos com qualis vinculados aos TCCs</CardTitle>
        <CardDescription>
        Este gráfico apresenta quantidade de artigos com qualis vinculados aos TCCs defendidos</CardDescription>
      </CardHeader>
      <CardContent>
        <Column {...config} />
      </CardContent>
    </Card> 
  );
};
