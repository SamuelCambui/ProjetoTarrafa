import React from "react";
import { Pie } from "@ant-design/plots";

export const ProdutosEgressos = ({producoesEgressos}) => {

  console.log(producoesEgressos)

  const config = {
    data: producoesEgressos,
    angleField: "qdade",
    colorField: "subtipo",
    radius: 0.8,
    label: {
      text: "qdade",
      position: "outside",
    },
  };
  return <Pie className="max-h-80" {...config} />;
};
