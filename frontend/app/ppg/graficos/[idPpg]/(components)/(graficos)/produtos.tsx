import React from "react";
import { Pie } from "@ant-design/plots";

export const Produtos = ({producoes}) => {

  const config = {
    data: producoes,
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
