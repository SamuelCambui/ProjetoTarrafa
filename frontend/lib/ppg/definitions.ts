import { SimulationNodeDatum } from "d3";

export type Links = {
  source: string;
  target: string;
  value: number;
};

export type Nodes = {
  id: string;
  group: string;
};

export type DadosColab = {
  links: Links[];
  nodes: Nodes[];
};

export interface NodeGrafoColab extends SimulationNodeDatum {
  group: string;
  id: string;
  importancia: number;
  index: number;
  nome: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export type LinkGrafoColab = {
  index: number;
  source: NodeGrafoColab;
  target: NodeGrafoColab;
  value: number;
};

export type DadosGrafoColab = {
  nodes: NodeGrafoColab[];
  links: LinkGrafoColab[];
};

export type Programa = {
  area: string;
  id: string;
  nome: string;
  nome_ies: string;
  nota: string;
  singla_ies: string;
};

export type DadosHome = {
  programas: [];
  ranking: object;
  time: string;
};

export type Docente = {
  avatar: string;
  ies: string;
  nome: string;
  produtos: {
    [key: string]: number;
  };
  sigla_ies_vinculo: string;
  vinculo_ies: string;
};

export type User = {
  isAdmin: boolean;
  idLattes: string;
  nome: string;
  email: string;
  isSuperuser: boolean;
  idIes: string;
  isActive: boolean;
};

export type UserCriacao = {
  idLattes: string;
  nome: string;
  email: string;
  isSuperuser: boolean;
  isAdmin: boolean;
  idIes: string;
  isActive: boolean;
};

export type Artigo = {
  ano: number;
  doi: string;
  duplicado: number;
  id_dupl: number;
  issn: string;
  nome_producao: string;
  programas: string[];
};

export type GrafoCoautores = {
  link: [];
  nodes: [];
};

export type Coordenada = {
  nome: string;
  sigla: string;
  status: string;
  municipio: string;
  uf: string;
  longitude: number;
  latitude: number;
  indprod: number;
  id: string;
};

export type RedeColaboracaoData = {
  grafoCoautores: DadosGrafoColab;
  forca: number;
};

//////// Docentes
export type DadosDocentes = {
  professorPorCategoria: DocentePorCategoria[];
  atualizacaoLattes: AtualizacaoLattes[];
  grafoCoautoresdoPpg: DadosColab;
  listaProfessores: ListaDocenteTabela;
};

export type DocentePorCategoria = {
  ano: string;
  categoria: number;
  count: number;
};

export type AtualizacaoLattes = {
  legenda: string;
  quantidade: number;
};

export type DocenteTabela = {
  id_sucupira: string;
  nome: string;
  num_identificador: string;
  A1: number;
  A2: number;
  A3: number;
  A4: number;
  B1: number;
  B2: number;
  B3: number;
  B4: number;
  C: number;
  indprod: number;
};

export type ListaDocenteTabela = {
  status: { [key: string]: string[] };
  professores: DocenteTabela[];
  produtos: { [key: string]: any };
  orientados: { [key: string]: any };
  medias: { [key: string]: number };
  formula: { [key: string]: number };
  datalattes: { [key: string]: string };
  avatares: { [key: string]: string };
};

//////// Projetos
export type DadosProjetos = {
  dadosDeLinhasDePesquisa: DadosLinhaPesquisa;
  dadosDeProjetos: DadosDeProjetos;
  dadosDeProjetoseLinhasDePesquisa: ListaDocenteTabela;
};

export type DadosLinhaPesquisa = {
  links: { source: string; target: string; value: number }[];
  nodes: { category: string; name: string }[];
};

export type DadosDeProjetos = {
  links: { source: string; target: string; value: number }[];
  nodes: { category: string; name: string; titulo: string }[];
};

export type DadosProjetoseLinhasDePesquisa = {
  links: { source: string; target: string; value: number }[];
  nodes: { category: string; name: string }[];
};

//////// Bancas
export type DadosBancas = {
  dadosDeProdutosPorTcc: DadosDeProdutosPorTcc;
  dadosDeTccsPorLinhasDePesquisa: TccsPorLinha;
  levantamentoExternosEmBancas: LevantamentoExternos;
};

export type DadosDeProdutosPorTcc = {
  medias: Record<string, MediasTccs>;
  produtos: Record<string, ProdutosTccs>;
  tccs_com_qualis: Record<number, TccsComQualis>;
  tccs_com_producoes: Record<string, TccsComProducoes>;
  tccs_com_livros: Record<number, number>;
};

export type MediasTccs = {
  "Apenas bibliográficos (média)": number;
  "Apenas técnicos (média)": number;
  "Nenhum (média)": number;
  "Técnicos + bibliograficos (média)": number;
};

export type ProdutosTccs = {
  "ARTIGO EM PERIÓDICO": number;
  BIBLIOGRÁFICA: number;
  "DESENVOLVIMENTO DE TÉCNICA": number;
  LIVRO: number;
  PATENTE: number;
  TÉCNICA: number;
  total: number;
};

export type TccsComQualis = {
  A1: number;
  A2: number;
  A3: number;
  A4: number;
  B1: number;
  B2: number;
  B3: number;
  B4: number;
  C: number;
};

export type TccsComProducoes = {
  "Apenas bibliográficos": number;
  "Apenas técnicos": number;
  Nenhum: number;
  "Periódicos": string[];
  "Técnicos + bibliográficos": number;
};

export type TccsPorLinha = {
  links: { source: string; target: string; value: number }[];
  nodes: { name: string; category: string }[];
};

export type LevantamentoExternos = {
  area_titulacao: { [key: string]: number };
  grau_academico: { [key: string]: number };
  pais_origem: { [key: string]: number };
  pais_titulacao: { [key: string]: number };
  participa_ppg: { [key: string]: number };
  quantidade_bancas: number;
  quantidade_externos: number;
  quantidade_internos: number;
  tipo_participacao_ppg: TipoParticipacao;
};

export type TipoParticipacao = {
  Colaborador: number;
  Nenhum: number;
  Permanente: number;
  Visitante: number;
};

//////// Egressos
export type DadosEgressos = {
  dadosEgressos: ObjetoDadosEgressos;
  egressosTituladosPorAno: Record<string, InfoTitulados[]>;
  tempoAtualizacaoLattesEgressos: TempoAtualizacaoLattesEgressos[];
  producoesEgressos: Record<string, InfoProducoes[]>;
};

export type ObjetoDadosEgressos = {
  dados: DadosLattesEgresso[];
  lattes: Record<string, InfoLattes>;
};

export type InfoTitulados = {
  ano_egresso: number;
  quantidade: number;
};

export type DadosLattesEgresso = {
  dt_atualizacao: string;
  idlattes: string;
  linkavatar: string;
  mudanca: string;
  nome: string;
  verificado: boolean;
};

export type TempoAtualizacaoLattesEgressos = {
  quantidade: number;
  legenda: string;
};

export type InfoProducoes = {
  qdade: number;
  subtipo: string;
};

export type InfoLattes = {
  modalidades: Record<string, Modalidades>;
  atualizacao_lattes: string;
};

export type Modalidades = {
  ano_egresso: number;
  atuacao_antes: Atuacao;
  atuacao_depois: Atuacao;
};

export type Atuacao = {
  ano_fim: string;
  ano_inicio: string;
  atuacao: "Analista De Controle De Qualidade";
  local_trabalho: string;
};
