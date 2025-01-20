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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { SquareArrowOutUpRight } from "lucide-react";
import { ProdutosEgressos } from "../graficos/[idIes]/(components)/(graficos)/produtos-egressos";

export default function DrawerInfoEgressos({ dadosLattes, producoesEgressos, idLattes }) {
  const [isOpen, setIsOpen] = useState(false);

  const modalidades = dadosLattes.modalidades || {};

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost">Produções</Button>
      </DrawerTrigger>
      <DrawerContent className="h-full w-[400px] sm:w-[540px] right-0 left-auto overflow-visible">
        <DrawerHeader>
          <DrawerTitle>Nome da pessoa</DrawerTitle>
          <DrawerDescription>Fonte: Lattes</DrawerDescription>
        </DrawerHeader>
        <div className="p-4 pb-0">
          <Tabs defaultValue="tab0" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              {Object.keys(modalidades).map((modalidade, index) => (
                <TabsTrigger
                  key={`${modalidade}-${index}`}
                  value={`tab${index}`}
                >
                  {modalidade}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(modalidades).map(([chave, valor], index) => (
              <TabsContent
                key={`${chave}-${index}`}
                value={`tab${index}`}
                className="p-4"
              >
                <h3 className="font-semibold">{chave}</h3>
                <p className="mb-4 text-sm">Titulação em {valor.ano_egresso}</p>

                <div className="space-x-6 flex">
                  {/* Before Section */}
                  <div className="">
                    <h4 className="font-semibold">Antes</h4>
                    <div className="mt-1 space-y-1">
                      <div>
                        <h5 className="font-semibold">Local de trabalho</h5>
                        <p className="text-sm">{valor.atuacao_antes.local_trabalho}</p>
                      </div>
                      <div>
                        <h5 className="font-semibold">Atuação</h5>
                        <p className="text-sm">{valor.atuacao_antes.atuacao}</p>
                      </div>
                      <div>
                        <h5 className="font-semibold">Ano Início</h5>
                        <p className="text-sm">
                          {valor.atuacao_antes.ano_inicio ??
                            "Ano não encontrado"}
                        </p>
                      </div>
                      <div>
                        <h5 className="font-semibold">Ano Final</h5>
                        <p className="text-sm">
                          {valor.atuacao_antes.ano_fim ?? "Ano não encontrado"}
                        </p>
                      </div>
                    </div>{" "}
                  </div>

                  {/* After Section */}
                  <div className="">
                    <h4 className="font-semibold">Depois</h4>
                    <div className="mt-1 space-y-1">
                      <div>
                        <h5 className="font-semibold">Local de trabalho</h5>
                        <p className="text-sm">{valor.atuacao_depois.local_trabalho}</p>
                      </div>
                      <div>
                        <h5 className="font-semibold">Atuação</h5>
                        <p className="text-sm">{valor.atuacao_depois.atuacao}</p>
                      </div>
                      <div>
                        <h5 className="font-semibold">Ano Início</h5>
                        <p className="text-sm">
                          {valor.atuacao_depois.ano_inicio ??
                            "Ano não encontrado"}
                        </p>
                      </div>
                      <div>
                        <h5 className="font-semibold">Ano Final</h5>
                        <p className="text-sm">
                          {valor.atuacao_depois.ano_fim ?? "Ano não encontrado"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <Separator className="my-4" />
                <h3 className="text-lg font-semibold">Produtos</h3>
              </TabsContent>
            ))}
          </Tabs>
          < ProdutosEgressos producoesEgressos={producoesEgressos} />
        </div>
        <DrawerFooter >
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
