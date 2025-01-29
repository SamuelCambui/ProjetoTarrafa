import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIndicadoresDisciplina } from "@/service/ppgls/indicadores/queries";
import { Search } from "lucide-react";
import { useState } from "react";
import { Filtro } from "../../../../../../(components)/Filtro";
import { Disciplina, SecaoIndicadoresDisciplina } from "../types";
import { BoxplotCotistas } from "./BoxplotCotistas";
import { BoxplotEvasao } from "./BoxplotEvasao";
import { GraficoDesempenhoProf } from "./GraficoDesempenhoProf";
import { GraficoEvasao } from "./GraficoEvasao";
import { GraficoQuantidadeAlunos } from "./GraficoQuantidadeAlunos";
import { GraficoReprovacoesDisciplina } from "./GraficoReprovacoesDisciplina";
import { HistogramaCotistas } from "./HistogramaCotistas";
import { BoxplotNotas } from "./BoxplotNotas";
import { HistogramaNotas } from "./HistogramaNotas";

export const IndicadoresDisciplina = ({
  idCurso,
  idIes,
  idGrade,
  disciplinas,
}: SecaoIndicadoresDisciplina) => {
  const [periodo, setPeriodo] = useState<{
    anoInicial: number;
    anoFinal: number;
  }>({
    anoInicial: new Date().getFullYear() - 10,
    anoFinal: new Date().getFullYear(),
  });
  // Disciplina selecionada e buscada no banco
  const [fetchedDiscipline, setFetchedDiscipline] = useState<
    Disciplina | undefined
  >(undefined);

  // Controla o componente select
  const [disciplinaSelect, setDisciplinaSelect] = useState<
    Disciplina | undefined
  >(undefined);

  const { data, error, isLoading } = useIndicadoresDisciplina({
    idCurso,
    idIes,
    idGrade,
    anoFinal: periodo.anoFinal,
    anoInicial: periodo.anoInicial,
    idDisc: fetchedDiscipline?.cod_disc,
  });

  const handleSelect = (e: string) => {
    const disciplina = disciplinas?.filter(
      (disciplina) => disciplina.cod_disc === e,
    )[0];
    setDisciplinaSelect(disciplina);
  };

  const handleClick = () => {
    setFetchedDiscipline(disciplinaSelect);
  };

  return (
    <div className="space-y-2">
      <h2 className="mt-10 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Indicadores Disciplina
      </h2>
      <Card>
        <CardHeader>
          <CardDescription>
            Escolha uma disciplina para analisar os indicadores.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Select
            value={disciplinaSelect?.cod_disc}
            onValueChange={(e) => handleSelect(e)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Escolha uma Disciplina" />
            </SelectTrigger>
            <SelectContent>
              {disciplinas?.map((disciplina) => (
                <SelectItem
                  key={disciplina.cod_disc}
                  value={disciplina.cod_disc}
                  className="capitalize"
                >
                  {disciplina.abreviacao} - {disciplina.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => handleClick()} disabled={isLoading}>
            Buscar
            <Search />
          </Button>
        </CardContent>
      </Card>
      {fetchedDiscipline && (
        <>
          <Filtro
            periodo={periodo}
            setPeriodo={setPeriodo}
            isFetching={isLoading}
          />
          <div className="p-4">
            <p>
              Disciplina{" "}
              <b>
                {fetchedDiscipline?.nome} ({fetchedDiscipline?.abreviacao})
              </b>{" "}
              do departamento <b>{fetchedDiscipline?.departamento}</b> com carga
              horária de <b>{fetchedDiscipline?.carga_horaria}</b> horas.
            </p>
          </div>
          <GraficoQuantidadeAlunos
            data={data?.graficoQuantidadeAlunosDisciplina}
            isLoading={isLoading}
          />
          <GraficoEvasao data={data?.evasaoDisciplina} isLoading={isLoading} />
          <GraficoReprovacoesDisciplina
            data={data?.aprovacoesReprovacoesDisciplina}
            isLoading={isLoading}
          />
          <div className="grid grid-cols-2 gap-2">
            <BoxplotNotas
              data={data?.boxplotNotasDisciplina}
              isLoading={isLoading}
            />
            <HistogramaNotas
              data={data?.histogramaNotasDisciplina}
              isLoading={isLoading}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <BoxplotCotistas
              data={data?.boxplotDesempenhoCotistas}
              isLoading={isLoading}
            />
            <HistogramaCotistas
              data={data?.histogramaDesempenhoCotistas}
              isLoading={isLoading}
            />
          </div>
          <BoxplotEvasao data={data?.boxplotEvasao} isLoading={isLoading} />
          <GraficoDesempenhoProf
            data={data?.boxplotDesempenhoProfessor}
            isLoading={isLoading}
          />
        </>
      )}
    </div>
  );
};
