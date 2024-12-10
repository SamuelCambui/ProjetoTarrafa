import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

interface FiltroProps {
  periodo: { anoInicial: number; anoFinal: number };
  setPeriodo: Dispatch<
    SetStateAction<{
      anoInicial: number;
      anoFinal: number;
    }>
  >;
}

export const Filtro = ({ periodo, setPeriodo }: FiltroProps) => {
  const [tempPeriodo, setTempPeriodo] = useState(periodo);
  const anoAtual = new Date().getFullYear();
  const listaAnos: number[] = [];
  for (let ano = anoAtual - 10; ano <= anoAtual; ano++) listaAnos.push(ano);

  const handleSelect = (e: string, type: "anoInicial" | "anoFinal") => {
    if (type === "anoInicial" && Number(e) <= tempPeriodo.anoFinal) {
      setTempPeriodo({
        ...tempPeriodo,
        [type]: Number(e),
      });
      return;
    }
    if (type === "anoFinal" && Number(e) >= tempPeriodo.anoInicial) {
      setTempPeriodo({
        ...tempPeriodo,
        [type]: Number(e),
      });
      return;
    }
  };

  const handleOpen = () => {
    setTempPeriodo({
      ...periodo,
    });
  };

  const handleSubmit = () => {
    setPeriodo(tempPeriodo);
  };

  return (
    <DropdownMenu onOpenChange={handleOpen}>
      <DropdownMenuTrigger className="my-4" asChild>
        <Button>
          <Filter /> Filtro
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <div className="space-y-2">
          <h2 className="p-1 text-sm font-bold">Filtrar por Período</h2>
          <div className="flex flex-row gap-2">
            <Select
              value={tempPeriodo.anoInicial.toString()}
              onValueChange={(e) => handleSelect(e, "anoInicial")}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {listaAnos.map((ano, index) => (
                  <SelectItem key={ano} value={ano.toString()}>
                    {ano}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={tempPeriodo.anoFinal.toString()}
              onValueChange={(e) => handleSelect(e, "anoFinal")}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {listaAnos.map((ano, index) => (
                  <SelectItem key={ano} value={ano.toString()}>
                    {ano}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full" onClick={handleSubmit}>
            Buscar
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
