import { Column } from "@ant-design/plots";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


export const ArtigosViculadosTCCs = () => {
  const config = {
    data: {
      type: 'fetch',
      value: 'https://gw.alipayobjects.com/os/antfincdn/8elHX%26irfq/stack-column-data.json',
    },
    xField: 'year',
    yField: 'value',
    colorField: 'type',
    stack: true,
    interaction: {
      tooltip: {
        render: (e: any, { title, items }: any) => {
          return (
            <div key={title}>
              <h4>{title}</h4>
              {items.map((item: { name: any; value: any; color: any; }) => {
                const { name, value, color } = item;
                return (
                  <div>
                    <div style={{ margin: 0, display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <span
                          style={{
                            display: 'inline-block',
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            backgroundColor: color,
                            marginRight: 6,
                          }}
                        ></span>
                        <span>{name}</span>
                      </div>
                      <b>{value}</b>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle> Artigos com qualis vinculados aos TCCs</CardTitle>
        <CardDescription>
        Este gráfico apresenta quantidade de artigos com qualis vinculados aos TCCs defendidos</CardDescription>
      </CardHeader>
      <CardContent>
        <Column {...config} />;
      </CardContent>
    </Card> 
  );
};
