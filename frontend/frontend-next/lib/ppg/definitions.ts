export type Programa = {
  area: string;
  nome: string;
  nota: string;
  id: string;
}

export type DadosHome = {
  programas: [];
  ranking: object;
  time: string;
}


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
  id_dupl: number;
  nome_producao: string;    
  duplicado: string;
  programas: string[];  
};
