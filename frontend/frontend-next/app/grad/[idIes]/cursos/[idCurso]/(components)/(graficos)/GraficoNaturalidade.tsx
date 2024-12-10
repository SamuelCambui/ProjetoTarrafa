import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";

interface GraficoNaturalidadeProps {
    data?: any
}

export const GraficoNaturalidade = ({ data }: GraficoNaturalidadeProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Naturalidade</CardTitle>
        <CardDescription>
          Naturalidade dos alunos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        Mapa do Brasil
      </CardContent>
    </Card>
  )
}
