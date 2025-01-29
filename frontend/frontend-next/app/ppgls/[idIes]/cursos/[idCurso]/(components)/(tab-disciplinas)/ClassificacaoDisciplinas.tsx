import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

export const ClassificacaoDisciplinas = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Classificação de Disciplinas
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-5 w-72" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-48 w-full" />
      </CardContent>
    </Card>
  )
}
