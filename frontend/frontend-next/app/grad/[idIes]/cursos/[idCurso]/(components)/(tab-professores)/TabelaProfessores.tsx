import { Input } from "@/components/ui/input";
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
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Params = {
  data?: any;
  isLoading?: boolean;
};

type Professor = {
  id_prof: string;
  nome: string;
  qualificacao: string;
  vinculo: string;
  departamento: string;
  sexo: string;
  disciplinas: {
    id_disc: string;
    nome: string;
    abreviacao: string;
    ultima_vez_lecionada: string;
  }[];
};
export const TabelaProfessores = ({ data, isLoading }: Params) => {
  const [professores, setProfessores] = useState<Professor[] | undefined>(data);
  const [professorAtivo, setProfessorAtivo] = useState<Professor | undefined>(
    undefined,
  );

  useEffect(() => {
    setProfessores(data);
  }, [data]);

  if (!data) {
    return <div>Loading...</div>;
  }

  const criaLabel = (nome: string) => {
    try {
      const nomes = nome.split(" ");
      return nomes[0][0] + nomes[1][0];
    } catch {
      return <User className="h-12 w-12 stroke-slate-600 stroke-1" />;
    }
  };
  const [searchInput] = useState<string>();

  const handleSearchInput = (event: ChangeEvent<HTMLInputElement>) => {
    const fiteredProfessores = data?.filter((professor: Professor) =>
      professor.nome
        .toLocaleLowerCase()
        .startsWith(event.target.value.toLocaleLowerCase()),
    );
    setProfessores(fiteredProfessores);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Professores</CardTitle>
        <CardDescription>Listagem de professores do curso.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Input
              placeholder="Buscar..."
              value={searchInput}
              onChange={handleSearchInput}
            />
            <ScrollArea className="h-[600px] rounded-sm border px-4 py-2">
              <Table className="col-span-1">
                <TableCaption>
                  Professores que já lecionaram no curso.
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Nome</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {professores?.map((professor: Professor) => (
                    <TableRow
                      key={professor.id_prof}
                      className="cursor-pointer"
                      onClick={() => setProfessorAtivo(professor)}
                    >
                      <TableCell className="font-medium">
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage />
                          <AvatarFallback className="rounded-lg">
                            <User className="stroke-slate-400 stroke-1" />
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>{professor.id_prof}</TableCell>
                      <TableCell className="capitalize">
                        {professor.nome.toLocaleLowerCase()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
          <div className="col-span-2">
            <div className="flex h-[645px] flex-col px-12">
              {!professorAtivo ? (
                <div className="text-muted-foreground flex flex-1 items-center justify-center">
                  Nenhum professor selecionado
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-center">
                    <Avatar className="h-28 w-28 rounded-full">
                      <AvatarImage />
                      <AvatarFallback
                        className={cn(
                          "rounded-lg",
                          professorAtivo.sexo === "M"
                            ? "bg-blue-200"
                            : "bg-pink-200",
                        )}
                      >
                        {criaLabel(professorAtivo.nome)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="mb-6 space-y-2">
                    <h2 className="text-xl font-bold capitalize">
                      {professorAtivo.nome.toLocaleLowerCase()}
                    </h2>
                    <div className="flex flex-row gap-8">
                      <span className="font-semibold">Qualificação</span>
                      <span className="text-muted-foreground capitalize">
                        {professorAtivo.qualificacao.toLocaleLowerCase()}
                      </span>
                    </div>
                    <div className="flex flex-row gap-8">
                      <span className="font-semibold">Sexo</span>
                      <span className="text-muted-foreground">
                        {professorAtivo.sexo === "M" ? "Masculino" : "Feminino"}
                      </span>
                    </div>
                    {professorAtivo.departamento && (
                      <div className="flex flex-row gap-8">
                        <span className="font-semibold">Departamento</span>
                        <span className="text-muted-foreground capitalize">
                          {professorAtivo?.departamento?.toLocaleLowerCase()}
                        </span>
                      </div>
                    )}
                    {professorAtivo.vinculo && (
                      <div className="flex flex-row gap-8">
                        <span className="font-semibold">Vínculo</span>
                        <span className="text-muted-foreground capitalize">
                          {professorAtivo?.vinculo.toLocaleLowerCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-lg font-bold">
                      Disciplinas Lecionadas
                    </h2>
                    <ScrollArea className="h-[300px] rounded-sm border px-4 py-2">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[100px]">Código</TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead className="w-[100px]">
                              Abreviação
                            </TableHead>
                            <TableHead className="text-right">
                              Última Vez Lecionada
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {professorAtivo.disciplinas?.map((disciplina) => (
                            <TableRow key={disciplina.id_disc}>
                              <TableCell className="font-medium">
                                {disciplina.id_disc}
                              </TableCell>
                              <TableCell>{disciplina.nome}</TableCell>
                              <TableCell>{disciplina.abreviacao}</TableCell>
                              <TableCell className="text-right">
                                {disciplina.ultima_vez_lecionada}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
