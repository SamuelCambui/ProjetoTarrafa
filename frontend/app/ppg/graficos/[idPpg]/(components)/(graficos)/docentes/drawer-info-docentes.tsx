"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { SquareArrowOutUpRight } from "lucide-react";
import { ProgressBar } from "@/components/progress-bar";
import { Produtos } from "../produtos";

interface Orientado {
  TITULADO: number;
  ABANDONOU: number;
  DESLIGADO: number;
}

interface DrawerInfoDocentesProps {
  nome: string;
  produtos: any[]; 
  orientados: Orientado[];
  idLattes: string;
}

export default function DrawerInfoDocentes({
  nome,
  produtos,
  orientados,
  idLattes,
}: DrawerInfoDocentesProps) {
  const [isOpen, setIsOpen] = useState(false);  

  const calculaPorcentagens = (orientados: Orientado[]): {
    dentroDoPrazo: number;
    foraDoPrazo: number;
    desligados: number;
  } => {
    const totalTitulados = orientados.reduce(
      (soma, item) => soma + item.TITULADO,
      0
    );
    const totalAbandonados = orientados.reduce(
      (soma, item) => soma + item.ABANDONOU,
      0
    );
    const totalDesligados = orientados.reduce(
      (soma, item) => soma + item.DESLIGADO,
      0
    );

    const total = totalTitulados + totalAbandonados + totalDesligados;

    return {
      dentroDoPrazo: (totalTitulados / total) * 100 || 0,
      foraDoPrazo: (totalAbandonados / total) * 100 || 0,
      desligados: (totalDesligados / total) * 100 || 0,
    };
  };

  const porcentagens = calculaPorcentagens(orientados);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost">Detalhes</Button>
      </DrawerTrigger>
      <DrawerContent className="h-full w-[400px] sm:w-[540px] right-0 left-auto overflow-visible">
        <DrawerHeader>
          <DrawerTitle>{nome}</DrawerTitle>
          <DrawerDescription>Fonte: Lattes</DrawerDescription>
        </DrawerHeader>
        <div className="p-4 pb-0">
          <h3 className="font-semibold"> Orientações Concluídas </h3>
          <p className="mb-4 text-sm">Fonte: Sucupira</p>

          <ProgressBar
            value={porcentagens.dentroDoPrazo}
            label="Dentro do Prazo"
          />
          <ProgressBar
            value={porcentagens.foraDoPrazo}
            label="Fora do prazo"
          />
          <ProgressBar
            value={porcentagens.desligados}
            label="Desligados"
          />

          <Separator className="my-4" />
          <h3 className="text-lg font-semibold">Produtos</h3>
          <Produtos producoes={produtos || []} />
        </div>
        <DrawerFooter>
          <Button variant="link">
            <a
              href={`http://lattes.cnpq.br/${idLattes}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Lattes
            </a>
            <SquareArrowOutUpRight />
          </Button>
          <DrawerClose asChild>
            <Button>Fechar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
