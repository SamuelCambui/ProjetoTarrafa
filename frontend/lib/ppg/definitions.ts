export type Programa = {
  area: string;
  nome: string;
  nota: string;
  id: string;
};

export type DadosHome = {
  programas: [];
  ranking: object;
  time: string;
};

export type Docente = {
  avatar: string;
  nome: string;
  sigla_ies_vinculo: string;
  vinculo_ies: string;
  ies: string;
  produtos: {
    [key: string]: number;
  };
};

export type User = {
  is_admin: any;
  idlattes: string;
  full_name: string;
  email?: string;
  perfil: string;
  is_active: boolean;
  logado: boolean;
};

export type Artigo = {
  ano: number;
  doi: string
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
}