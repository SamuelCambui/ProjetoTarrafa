import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface PropsCardsEstatistics {
  quantidadeBancas: number,
  quantidadeExternos: number,
  quantidadeInternos: number
}

export default function CardsEstatisticas({quantidadeBancas, quantidadeExternos, quantidadeInternos} : PropsCardsEstatistics) {
  return (
    <div className="col-span-2 grid gap-4 md:grid-cols-2 lg:grid-cols-4 max-w-3xl mx-auto">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {" "}
            Bancas no período{" "}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{ quantidadeBancas}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Docentes internos por banca em média
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{(quantidadeInternos / quantidadeBancas).toFixed(2)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {" "}
            Participantes externos por banca em média{" "}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{(quantidadeExternos / quantidadeBancas).toFixed(2)}</div>
        </CardContent>
      </Card>
    </div>
  );
}
