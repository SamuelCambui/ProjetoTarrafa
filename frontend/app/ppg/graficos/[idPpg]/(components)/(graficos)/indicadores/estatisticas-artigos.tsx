"use client";

import { ProgressBar } from "@/components/progress-bar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Rose } from "@ant-design/plots";
import React, { useEffect, useState } from "react";

export const EstatisticasaArtigos = ({
  estatisticasArtigos,
  estatisticasArtigosCorrelatos,
}) => {

  const totalArtigosQualificados : number = estatisticasArtigos.total

  const data = Object.keys(estatisticasArtigos.qualis_discente).map((key) => ({
    tipo: `Qualis Discentes ${key}`,
    porcentagem: Math.round(((estatisticasArtigos.qualis_discente[key] / totalArtigosQualificados) * 100) * 1e2) / 1e2
  }))

  const porcentagemTotal = data.reduce((acc, item) => acc + item.porcentagem, 0);
  
  const config = {
    // width: 720,
    // height: 720,
    autoFit: true,
    radius: 0.85,
    data,
    xField: "tipo",
    yField: "porcentagem",
    colorField: "tipo",
    // transform: [{ type: "groupY", y: "sum" }],
    scale: { y: { type: "sqrt" }, x: { padding: 0 } },
    axis: false,
    // legend: { color: { length: 600, layout: { justifyContent: "center" } } },
    labels: [
      {
        text: "porcentagem",
        position: "outside",
        // formatter: "~s",
        transform: [{ type: "overlapDodgeY" }],
      },
    ],
    // tooltip: { items: [{ channel: "y", valueFormatter: "~s" }] },
  };

  return (
    <div className="col-span-2 grid md:grid-cols-3 grid-cols-1 gap-2">
      <Card>
        <CardHeader className="text-center"> 
          <CardTitle>
          {porcentagemTotal.toFixed(2)}%
          </CardTitle>
          da produção de artigos qualificados possui participação discente
          </CardHeader>
        <CardContent><Rose {...config} /></CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle> Artigos de PPGs de mesma área e nota </CardTitle>
          <CardDescription> Dado pela média </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProgressBar
            value={estatisticasArtigosCorrelatos["DiscentesA4+"]}
            label="Artigos Qualis A4 ou superior com discentes-matriculados"
          />
          <ProgressBar
            value={estatisticasArtigosCorrelatos["DiscentesB4+"]}
            label="Artigos Qualis B4 ou superior com discentes-matriculados"
          />
          <ProgressBar
            value={estatisticasArtigosCorrelatos["EgressosA4+"]}
            label="Artigos Qualis A4 ou superior com egressos"
          />
          <ProgressBar
            value={estatisticasArtigosCorrelatos["EgressosB4+"]}
            label="Artigos Qualis B4 ou superior com egressos"
          />
          <ProgressBar
            value={estatisticasArtigosCorrelatos["ArtigosDocentesSemCoautoria"]}
            label="Artigos de docentes sem coautoria (docentes e discentes)"
          />
          <ProgressBar
            value={estatisticasArtigosCorrelatos["ArtigosDocentesComCoautoria"]}
            label="Artigos de docentes com coautoria de outros docentes"
          />
          <ProgressBar
            value={
              estatisticasArtigosCorrelatos["ArtigosDocentesNãoPermanentes"]
            }
            label="Artigos de docentes não-permanentes"
          />
          <ProgressBar
            value={estatisticasArtigosCorrelatos["ArtigosExternos"]}
            label="Artigos com membros externos"
          />
          <ProgressBar
            value={estatisticasArtigosCorrelatos["ArtigosPosDocs"]}
            label="Artigos com participação de Pós-Doc"
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle> Artigos do PPG</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProgressBar
            value={
              (estatisticasArtigos["DiscentesA4+"] /
                estatisticasArtigos.total) *
              100
            }
            label="Artigos Qualis A4 ou superior com discentes-matriculados"
          />
          <ProgressBar
            value={
              (estatisticasArtigos["DiscentesB4+"] /
                estatisticasArtigos.total) *
              100
            }
            label="Artigos Qualis B4 ou superior com discentes-matriculados"
          />
          <ProgressBar
            value={
              (estatisticasArtigos["EgressosA4+"] / estatisticasArtigos.total) *
              100
            }
            label="Artigos Qualis A4 ou superior com egressos"
          />
          <ProgressBar
            value={
              (estatisticasArtigos["EgressosB4+"] / estatisticasArtigos.total) *
              100
            }
            label="Artigos Qualis B4 ou superior com egressos"
          />
          <ProgressBar
            value={
              (estatisticasArtigos["ArtigosDocentesSemCoautoria"] /
                estatisticasArtigos.total) *
              100
            }
            label="Artigos de docentes sem coautoria (docentes e discentes)"
          />
          <ProgressBar
            value={
              (estatisticasArtigos["ArtigosDocentesComCoautoria"] /
                estatisticasArtigos.total) *
              100
            }
            label="Artigos de docentes com coautoria de outros docentes"
          />
          <ProgressBar
            value={
              (estatisticasArtigos["ArtigosDocentesNãoPermanentes"] /
                estatisticasArtigos.total) *
              100
            }
            label="Artigos de docentes não-permanentes"
          />
          <ProgressBar
            value={
              (estatisticasArtigos["ArtigosExternos"] /
                estatisticasArtigos.total) *
              100
            }
            label="Artigos com membros externos"
          />
          <ProgressBar
            value={
              (estatisticasArtigos["ArtigosPosDocs"] /
                estatisticasArtigos.total) *
              100
            }
            label="Artigos com participação de Pós-Doc"
          />
        </CardContent>
      </Card>
    </div>
  );
};
