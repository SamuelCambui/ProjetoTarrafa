"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DrawerInfoEgressos from "./drawer-info-egressos";

export default function DataTable({ informacoesEgressos, producoesEgressos }) {
  debugger;
  const dadosEgressos = informacoesEgressos["dados"]

  const egressosComMudanca = dadosEgressos.filter(
    (egresso) => egresso.mudanca == "Com mudança"
  );
  const egressosSemMudanca = dadosEgressos.filter(
    (egresso) => egresso.mudanca == "Sem mudança"
  );

  return (
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
                      src={egresso.linkavatar}
                      alt={`Avatar de ${egresso.nome}`}
                      className="h-10 w-10 rounded-full"
                    />
                    <span>{egresso.nome}</span>
                  </div>
                </TableCell>
                <TableCell>xxxx</TableCell>
                <TableCell>
                  <DrawerInfoEgressos
                    dadosLattes={
                      informacoesEgressos.lattes[`${egresso.idlattes}`]
                    }
                    producoesEgressos={producoesEgressos[`${egresso.idlattes}`]}
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
                      src={egresso.linkavatar}
                      alt={`Avatar de ${egresso.nome}`}
                      className="h-10 w-10 rounded-full"
                    />
                    <span>{egresso.nome}</span>
                  </div>
                </TableCell>
                <TableCell>xxxxxx</TableCell>
                <TableCell>
                  <DrawerInfoEgressos
                    dadosLattes={
                      informacoesEgressos.lattes[`${egresso.idlattes}`]
                    }
                    producoesEgressos={producoesEgressos[`${egresso.idlattes}`]}
                    idLattes={egresso.idlattes}
                  />
                </TableCell>
              </TableRow>
            ))}
          </>
        )}
      </TableBody>
    </Table>
  );
}
