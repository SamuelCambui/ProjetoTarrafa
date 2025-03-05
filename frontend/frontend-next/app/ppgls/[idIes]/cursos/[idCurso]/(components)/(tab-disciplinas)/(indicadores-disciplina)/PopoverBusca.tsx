import React, { useEffect, useState } from "react";
import { Disciplina } from "../types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronsUpDownIcon, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

type PopoverBuscaProps = {
  disciplina: Disciplina | undefined;
  setDisciplina: React.Dispatch<React.SetStateAction<Disciplina | undefined>>;
  disciplinas?: Disciplina[] | undefined;
};

export const PopoverBusca = ({
  disciplina,
  setDisciplina,
  disciplinas,
}: PopoverBuscaProps) => {
  const [filteredDisciplines, setFilteredDisciplines] = useState<
    Disciplina[] | undefined
  >(disciplinas);

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filtered = disciplinas?.filter((disciplina) =>
      disciplina.nome.toLowerCase().startsWith(e.target.value.toLowerCase())
    );
    setFilteredDisciplines(filtered);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="font-medium w-full flex items-center justify-between"
        >
          {disciplina
            ? `${disciplina.abreviacao} - ${disciplina.nome}`
            : "Selecione uma disciplina..."}
          <ChevronsUpDownIcon className="opacity-40" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full">
        <div className="relative">
          <Search className="absolute left-2 w-4 h-4 top-1/2 -translate-y-1/2 stroke-slate-500" />
          <Input
            onChange={handleFilter}
            placeholder="Buscar..."
            className="rounded-none focus:outline-none focus:ring-0 focus-visible:ring-0 pl-8"
          />
        </div>
        <ScrollArea className="h-60 p-1">
          {filteredDisciplines?.map((disciplina) => (
            <div
              key={disciplina.cod_disc}
              className="hover:bg-slate-100 cursor-default"
              onClick={() => setDisciplina(disciplina)}
            >
              <PopoverClose className="h-full w-full text-start text-sm p-2">{`${disciplina.abreviacao} - ${disciplina.nome}`}</PopoverClose>
            </div>
          ))}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
