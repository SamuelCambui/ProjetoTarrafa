import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function CardsEstatisticas() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-fit mx-auto">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {" "}
            Bancas no período{" "}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">54</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Docentes internos por banca em média
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold"> 1.33 </div>
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
          <div className="text-2xl font-bold"> 0.70 </div>
        </CardContent>
      </Card>
    </div>
  );
}
