"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { obterCor } from "@/lib/utils";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { CircleAlert } from "lucide-react";
import DrawerInfoDocentes from "./drawer-info-docentes";
import LegendaTabelaDocentes from "@/app/ppg/(components)/legenda-docentes";

export default function DataTable({
  producoesDocente = { professores: [], avatares: {}, formula: {} },
}) {
  const obterStatus = (statusArray) => {
    return statusArray.map((status) => status.charAt(0)).join("");
  };

  const calculaFormulaIndProd = (formula) => {
    const weights = {
      A1: 100,
      A2: 85,
      A3: 70,
      A4: 60,
      B1: 50,
      B2: 30,
      B3: 20,
      B4: 10,
    };

    const formulaString = Object.entries(weights)
      .map(([key, weight]) => `${weight}*${key}`)
      .join(" + ");

    return `${formulaString} / período`;
  };

  const indprodFormula = calculaFormulaIndProd(producoesDocente.formula);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Docentes</CardTitle>
        <CardDescription>
          <p>Fórmula Indprod: {indprodFormula}</p>
          <p>Status no período: P = Permanente, C = Colaborador</p>
          <p>Tempo de Atualização do Currículo Lattes:</p>
          <LegendaTabelaDocentes />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea>
          <Table className="max-h-[52rem]">
            <TableCaption>Docente</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Docente</TableHead>
                <TableHead>IndProdArt</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ver mais</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {producoesDocente.professores.length > 0 ? (
                producoesDocente.professores.map((docente) => (
                  <TableRow key={docente.num_identificador}>
                    <TableCell>
                      <div className="flex items-center space-x-4">
                        <img
                          src={
                            producoesDocente.avatares[
                              docente.num_identificador
                            ] === "/assets/img/avatars/avatar1.jpeg"
                              ? "/avatar1.jpeg"
                              : producoesDocente.avatares[
                                  docente.num_identificador
                                ]
                          }
                          alt={`${docente.nome} avatar`}
                          className="h-10 w-10 rounded-full"
                        />
                        <span>{docente.nome}</span>
                      </div>
                    </TableCell>
                    <TableCell>{docente.indprod.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {obterStatus(
                          producoesDocente.status[docente.num_identificador]
                        )}
                        <CircleAlert
                          className={`w-5 h-5 ${obterCor(
                            producoesDocente.datalattes[
                              docente.num_identificador
                            ]
                          )}`}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <DrawerInfoDocentes
                        nome={docente.nome}
                        produtos={
                          producoesDocente.produtos[docente.num_identificador]
                        }
                        orientados={
                          producoesDocente.orientados[docente.num_identificador]
                        }
                        idLattes={docente.num_identificador}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Nenhum docente encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
