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
import { Filter, Loader2, Search } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

interface FiltroProps {
  periodo: { anoInicial: number; anoFinal: number };
  setPeriodo: Dispatch<
    SetStateAction<{
      anoInicial: number;
      anoFinal: number;
    }>
  >;
  isFetching: boolean;
}

export const Filtro = ({ periodo, setPeriodo, isFetching }: FiltroProps) => {
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

  const onClickOut = () => {
    setTempPeriodo({
      ...periodo,
    });
  };

  const handleSubmit = () => {
    setPeriodo(tempPeriodo);
  };

  return (
    <DropdownMenu onOpenChange={onClickOut}>
      <DropdownMenuTrigger className="my-4" asChild>
        <Button disabled={isFetching}>
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
                {listaAnos.map((ano) => (
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
                {listaAnos.map((ano) => (
                  <SelectItem key={ano} value={ano.toString()}>
                    {ano}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={isFetching}
          >
            {isFetching ? <Loader2 className="animate-spin" /> : <Search />}
            Buscar
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
