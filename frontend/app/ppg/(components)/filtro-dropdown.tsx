import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ListFilter } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface FiltroColabProps {
  produto: string;
  setProduto: (value: string) => void;
  fonte: "sucupira" | "lattes";
  setFonte: (value: "sucupira" | "lattes") => void;
  aresta: "ppgs" | "docentes";
  setAresta: (value: "ppgs" | "docentes") => void;
  anoInicio: number;
  setAnoInicio: (value: number) => void;
  anoFim: number;
  setAnoFim: (value: number) => void;
  numConexoes: number;
  setNumConexoes: (value: number) => void;
}

export function FiltroColab({
  produto,
  setProduto,
  fonte,
  setFonte,
  aresta,
  setAresta,
  anoInicio,
  setAnoInicio,
  anoFim,
  setAnoFim,
  numConexoes,
  setNumConexoes,
}: FiltroColabProps) {
  const [tempProduto, setTempProduto] = useState(produto);
  const [tempFonte, setTempFonte] = useState(fonte);
  const [tempAresta, setTempAresta] = useState(aresta);
  const [tempAnoInicio, setTempAnoInicio] = useState(anoInicio);
  const [tempAnoFim, setTempAnoFim] = useState(anoFim);
  const [tempNumConexoes, setTempNumConexoes] = useState(numConexoes);
  const [open, setOpen] = useState(false);

  const anoAtual = new Date().getFullYear();
  const primeiroAno = 2017;
  const anos = Array.from(
    { length: anoAtual - primeiroAno + 1 },
    (_, i) => primeiroAno + i
  );

  const aplicarFiltros = () => {
    setProduto(tempProduto);
    setFonte(tempFonte);
    setAresta(tempAresta);
    setAnoInicio(tempAnoInicio);
    setAnoFim(tempAnoFim);
    setNumConexoes(tempNumConexoes);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="w-fit" asChild>
        <Button>
          <ListFilter /> Filtros
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-4">
        <Select value={tempProduto} onValueChange={setTempProduto}>
          <SelectTrigger className="w-full mt-4">
            <SelectValue placeholder="Selecione o tipo de produto" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Tipos de Produto</SelectLabel>
              <SelectItem value="APRESENTAÇÃO DE TRABALHO">
                Apresentação de Trabalho
              </SelectItem>
              <SelectItem value="ARTES VISUAIS">Artes Visuais</SelectItem>
              <SelectItem value="ARTIGO EM JORNAL OU REVISTA">
                Artigo em Jornal ou Revista
              </SelectItem>
              <SelectItem value="ARTIGO EM PERIÓDICO">
                Artigo em Periódico
              </SelectItem>
              <SelectItem value="CARTAS, MAPAS OU SIMILARES">
                Cartas, Mapas ou Similares
              </SelectItem>
              <SelectItem value="CURSO DE CURTA DURAÇÃO">
                Curso de Curta Duração
              </SelectItem>
              <SelectItem value="DESENVOLVIMENTO DE APLICATIVO">
                Desenvolvimento de Aplicativo
              </SelectItem>
              <SelectItem value="DESENVOLVIMENTO DE MATERIAL DIDÁTICO E INSTRUCIONAL">
                Desenvolvimento de Material Didático e Instrucional
              </SelectItem>
              <SelectItem value="DESENVOLVIMENTO DE PRODUTO">
                Desenvolvimento de Produto
              </SelectItem>
              <SelectItem value="DESENVOLVIMENTO DE TÉCNICA E SERVIÇOS TÉCNICOS">
                Desenvolvimento de Técnica e Serviços Técnicos
              </SelectItem>
              <SelectItem value="EDITORIA">Editoria</SelectItem>
              <SelectItem value="LIVRO">Livro</SelectItem>
              <SelectItem value="MÚSICA">Música</SelectItem>
              <SelectItem value="ORGANIZAÇÃO DE EVENTO">
                Organização de Evento
              </SelectItem>
              <SelectItem value="OUTRA PRODUÇÃO CULTURAL">
                Outra Produção Cultural
              </SelectItem>
              <SelectItem value="PATENTE">Patente</SelectItem>
              <SelectItem value="PROGRAMA DE RÁDIO OU TV">
                Programa de Rádio ou TV
              </SelectItem>
              <SelectItem value="RELATÓRIO DE PESQUISA">
                Relatório de Pesquisa
              </SelectItem>
              <SelectItem value="TRABALHO EM ANAIS">
                Trabalho em Anais de Eventos
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="my-4">
          <label className="mb-2 block text-sm font-medium">Período</label>
          <div className="flex items-center space-x-2">
            <Select
              value={tempAnoInicio.toString()}
              onValueChange={(value) => setTempAnoInicio(Number(value))}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Ano Início" />
              </SelectTrigger>
              <SelectContent>
                {anos
                  .filter((year) => year <= tempAnoFim)
                  .map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <span className="text-sm font-medium">até</span>

            <Select
              value={tempAnoFim.toString()}
              onValueChange={(value) => setTempAnoFim(Number(value))}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Ano Fim" />
              </SelectTrigger>
              <SelectContent>
                {anos
                  .filter((year) => year >= tempAnoInicio)
                  .map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* <div className="my-4">
          <label className="mb-2 block text-sm font-medium">Número de conexões</label>
          <Slider
            value={[tempNumConexoes]}
            onValueChange={(value) => setTempNumConexoes(value[0])}
            max={100}
            step={1}
            className="w-full"
          />
        </div> */}
        <div className="my-4">
          <label className="mb-2 block text-sm font-medium">Fonte</label>
          <RadioGroup
            value={tempFonte}
            onValueChange={(value) =>
              setTempFonte(value as "sucupira" | "lattes")
            }
            className="grid grid-cols-2 gap-4"
          >
            <div>
              <RadioGroupItem
                value="sucupira"
                id="sucupira"
                className="peer sr-only"
                aria-label="sucupira"
              />
              <Label
                htmlFor="sucupira"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                Sucupira
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="lattes"
                id="lattes"
                className="peer sr-only"
                aria-label="lattes"
              />
              <Label
                htmlFor="lattes"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                Lattes
              </Label>
            </div>
          </RadioGroup>
        </div>
        <div className="my-4">
          <label className="mb-2 block text-sm font-medium">
            Tipo das arestas
          </label>
          <RadioGroup
            value={tempAresta}
            onValueChange={(value) =>
              setTempAresta(value as "ppgs" | "docentes")
            }
            className="grid grid-cols-2 gap-4"
          > 
            <div>
              <RadioGroupItem
                value="ppgs"
                id="ppg"
                className="peer sr-only"
                aria-label="ppgs"
              />
              <Label
                htmlFor="ppg"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                PPGs
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="docentes"
                id="docentes"
                className="peer sr-only"
                aria-label="docentes"
              />
              <Label
                htmlFor="docentes"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                Docentes
              </Label>
            </div>
          </RadioGroup>
        </div>
        <Button
          onClick={() => {
            aplicarFiltros();
            setOpen(false);
          }}
          className="w-full mt-4"
        >
          Aplicar Filtros
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
