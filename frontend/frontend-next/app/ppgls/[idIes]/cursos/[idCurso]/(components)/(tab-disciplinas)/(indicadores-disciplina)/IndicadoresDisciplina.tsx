import { Filtro } from "@/app/ppgls/(components)/Filtro";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

import { useIndicadoresDisciplina } from "@/service/ppgls/indicadores/queries";
import { Search } from "lucide-react";
import { useState } from "react";
import { Disciplina, SecaoIndicadoresDisciplina } from "../types";

import { BoxplotCotistas } from "./BoxplotCotistas";
import { BoxplotEvasao } from "./BoxplotEvasao";
import { BoxplotNotas } from "./BoxplotNotas";
import { GraficoDesempenhoProf } from "./GraficoDesempenhoProf";
import { GraficoEvasao } from "./GraficoEvasao";
import { GraficoQuantidadeAlunos } from "./GraficoQuantidadeAlunos";
import { GraficoReprovacoesDisciplina } from "./GraficoReprovacoesDisciplina";
import { HistogramaCotistas } from "./HistogramaCotistas";
import { HistogramaNotas } from "./HistogramaNotas";
import { PopoverBusca } from "./PopoverBusca";

export const IndicadoresDisciplina = ({
  idCurso,
  idIes,
  disciplinas,
}: SecaoIndicadoresDisciplina) => {
  const [periodo, setPeriodo] = useState<{
    anoInicial: number;
    anoFinal: number;
  }>({
    anoInicial: new Date().getFullYear() - 25,
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
    anoFinal: periodo.anoFinal,
    anoInicial: periodo.anoInicial,
    idDisc: fetchedDiscipline?.cod_disc,
  });


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
        <PopoverBusca
            disciplinas={disciplinas}
            disciplina={disciplinaSelect}
            setDisciplina={setDisciplinaSelect}
          />
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
