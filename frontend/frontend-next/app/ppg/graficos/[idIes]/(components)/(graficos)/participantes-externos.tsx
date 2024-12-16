import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dendrogram, DendrogramOptions, G6 } from '@ant-design/graphs';
import React, { useEffect, useState } from 'react';

const { treeToGraphData } = G6;

export const PPGsPaticipantesExternos = () => {
  const [data, setData] = useState< undefined | DendrogramOptions | G6.GraphData > (undefined); 

  useEffect(() => {
    fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/algorithm-category.json')
      .then((res) => res.json())
      .then((fetchedData) => {
        const graphData = treeToGraphData(fetchedData); 
        setData(graphData);
      })
      .catch((error) => {
        console.error('Failed to fetch or process data:', error);
      });
  }, []);

  const options = {
    autoFit: true, 
    data,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Participantes Externos</CardTitle>
      </CardHeader>
      <CardContent>
          <Dendrogram {...options} />
      </CardContent>
    </Card>
  );
};
