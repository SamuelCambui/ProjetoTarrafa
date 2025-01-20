import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

interface FiltroAnoProps {
  anos: number[];
  anoInicio: number;
  anoFim: number;
  aplicarFiltroAno: (anoInicial: number, anoFinal: number) => void;
}

export function FiltroAno({
  anos,
  anoInicio,
  anoFim,
  aplicarFiltroAno,
}: FiltroAnoProps) {
  const [anoInicioTemp, setAnoInicioTemp] = useState(anoInicio);
  const [anoFimTemp, setAnoFimTemp] = useState(anoFim);

  const handlerAplicacao = () => aplicarFiltroAno(anoInicioTemp, anoFimTemp);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Filtrar por Ano <Filter className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ano-inicio">Ano Inicial</Label>
            <Select
              value={anoInicioTemp.toString()}
              onValueChange={(value) => setAnoInicioTemp(Number(value))}
            >
              <SelectTrigger id="ano-inicio">
                <SelectValue placeholder="Selecione o ano inicial" />
              </SelectTrigger>
              <SelectContent>
                {anos.map((ano) => (
                  <SelectItem key={`inicio-${ano}`} value={ano.toString()}>
                    {ano}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ano-final">Ano Final</Label>
            <Select
              value={anoFimTemp.toString()}
              onValueChange={(value) => setAnoFimTemp(Number(value))}
            >
              <SelectTrigger id="ano-final">
                <SelectValue placeholder="Selecione o ano final" />
              </SelectTrigger>
              <SelectContent>
                {anos.filter((ano) => ano >= anoInicioTemp).map((ano) => (
                  <SelectItem key={`final-${ano}`} value={ano.toString()}>
                    {ano}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            className="w-full"
            onClick={handlerAplicacao}
            disabled={anoInicioTemp > anoFimTemp}
          >
            Aplicar Filtro
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
