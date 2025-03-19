"use client";
import StatusAtualizacao from "@/components/status-atualizacao";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  InfoProducoes,
  ObjetoDadosEgressos,
  TempoAtualizacaoLattesEgressos,
} from "@/lib/ppg/definitions";
import { obterCor } from "@/lib/utils";
import { CircleAlert } from "lucide-react";
import DrawerInfoEgressos from "./drawer-info-egressos";

interface Props {
  tempoAtualizacao: TempoAtualizacaoLattesEgressos[];
  informacoesEgressos: ObjetoDadosEgressos;
  producoesEgressos: Record<string, InfoProducoes[]>;
}

export default function DataTable({
  tempoAtualizacao,
  informacoesEgressos,
  producoesEgressos,
}: Props) {
  const dadosEgressos = informacoesEgressos?.dados ?? [];

  const egressosComMudanca = dadosEgressos.filter(
    (egresso) => egresso.mudanca === "Com mudança"
  );
  const egressosSemMudanca = dadosEgressos.filter(
    (egresso) => egresso.mudanca === "Sem mudança"
  );

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Egressos do PPG</CardTitle>
        <CardDescription>
          Tempo de atualização do currículo Lattes:
          <StatusAtualizacao tempoAtualizacao={tempoAtualizacao} />
        </CardDescription>{" "}
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-[52rem] overflow-scroll">
          <Table>
            <TableCaption>Egressos</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Egresso</TableHead>
                <TableHead>Status de atualização do Lattes</TableHead>
                <TableHead>Ver mais</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Egressos com mudança */}
              {egressosComMudanca.length > 0 && (
                <>
                  <TableRow>
                    <TableCell colSpan={3}>
                      Egressos com mudança de emprego após defesa:
                    </TableCell>
                  </TableRow>
                  {egressosComMudanca.map((egresso, index) => (
                    <TableRow key={`com-mudanca-${index}`}>
                      <TableCell>
                        <div className="flex items-center space-x-4">
                          <img
                            src={
                              egresso.linkavatar ===
                              "/assets/img/avatars/avatar1.jpeg"
                                ? "/avatar1.jpeg"
                                : egresso.linkavatar
                            }
                            alt={`Avatar de ${egresso.nome}`}
                            className="h-10 w-10 rounded-full"
                          />
                          <span>{egresso.nome}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <CircleAlert
                            className={`w-5 h-5 ${obterCor(
                              informacoesEgressos.lattes[egresso.idlattes]
                                .atualizacao_lattes
                            )}`}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <DrawerInfoEgressos
                          dadosLattes={
                            informacoesEgressos.lattes[egresso.idlattes]
                          }
                          producoesEgressos={
                            producoesEgressos[egresso.idlattes]
                          }
                          idLattes={egresso.idlattes}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}
              {/* Egressos sem mudança */}
              {egressosSemMudanca.length > 0 && (
                <>
                  <TableRow>
                    <TableCell colSpan={3}>
                      Egressos sem mudança de emprego após defesa:
                    </TableCell>
                  </TableRow>
                  {egressosSemMudanca.map((egresso, index) => (
                    <TableRow key={`sem-mudanca-${index}`}>
                      <TableCell>
                        <div className="flex items-center space-x-4">
                          <img
                            src={
                              egresso.linkavatar ===
                              "/assets/img/avatars/avatar1.jpeg"
                                ? "/avatar1.jpeg"
                                : egresso.linkavatar
                            }
                            alt={`Avatar de ${egresso.nome}`}
                            className="h-10 w-10 rounded-full"
                          />
                          <span>{egresso.nome}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <CircleAlert
                            className={`w-6 h-6 ${obterCor(
                              informacoesEgressos.lattes[egresso.idlattes]
                                .atualizacao_lattes
                            )}`}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <DrawerInfoEgressos
                          dadosLattes={
                            informacoesEgressos.lattes[egresso.idlattes]
                          }
                          producoesEgressos={
                            producoesEgressos[egresso.idlattes]
                          }
                          idLattes={egresso.idlattes}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
