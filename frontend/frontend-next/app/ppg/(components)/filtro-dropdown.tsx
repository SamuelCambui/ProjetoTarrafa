import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
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
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import YearFilter from "@/components/year-filter";

export function DropdownFilter() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Filtros</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-4">
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">Buscar</label>
          <Input placeholder="Pesquise..." />
        </div>
        <DropdownMenuSeparator />
        <Select>
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
        </Select>{" "}
        <div className="my-4">
          <label className="mb-2 block text-sm font-medium">
            Filtre por ano
          </label>
          <YearFilter />
        </div>
        <div className="my-4">
          <label className="mb-2 block text-sm font-medium">
            Número de conexões
          </label>
          <Slider defaultValue={[50]} max={100} step={1} className="w-full" />
        </div>
        <div className="my-4">
          <label className="mb-2 block text-sm font-medium">Fonte</label>
          <RadioGroup
            defaultValue="sucupira"
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
          <label className="mb-2 block text-sm font-medium">Tipo das arestas</label>
          <RadioGroup
            defaultValue="ppgs"
            className="grid grid-cols-2 gap-4"
          >
            <div>
              <RadioGroupItem
                value="ppgs"
                id="ppgs"
                className="peer sr-only"
                aria-label="ppgs"
              />
              <Label
                htmlFor="ppgs"
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
