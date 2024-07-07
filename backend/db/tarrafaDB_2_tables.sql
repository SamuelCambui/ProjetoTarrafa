--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2 (Ubuntu 16.2-1.pgdg22.04+1)
-- Dumped by pg_dump version 16.2 (Ubuntu 16.2-1.pgdg22.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: tarrafaDB_2; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE "tarrafaDB_2" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF-8';


ALTER DATABASE "tarrafaDB_2" OWNER TO postgres;

\connect "tarrafaDB_2"

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: capes_qualis_periodicos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.capes_qualis_periodicos (
    issn character varying(12) NOT NULL,
    area character varying(255) NOT NULL,
    periodo character varying(10) NOT NULL,
    titulo text,
    qualis character varying(3)
);


ALTER TABLE public.capes_qualis_periodicos OWNER TO postgres;

--
-- Name: coleta_autores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coleta_autores (
    id_programa character varying(50) NOT NULL,
    id_producao character varying(50) NOT NULL,
    ano integer NOT NULL,
    id_pessoa character varying(50) NOT NULL,
    ordem integer,
    tipo_vinculo integer
);


ALTER TABLE public.coleta_autores OWNER TO postgres;

--
-- Name: coleta_detalhamento_producao; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coleta_detalhamento_producao (
    id_producao character varying(50) NOT NULL,
    item character varying(255) NOT NULL,
    valor text
);


ALTER TABLE public.coleta_detalhamento_producao OWNER TO postgres;

--
-- Name: coleta_detalhamento_producao_tcc; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coleta_detalhamento_producao_tcc (
    id_producao character varying(50) NOT NULL,
    dados jsonb
);


ALTER TABLE public.coleta_detalhamento_producao_tcc OWNER TO postgres;

--
-- Name: coleta_discentes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coleta_discentes (
    id_programa character varying(50) NOT NULL,
    id_pessoa character varying(50) NOT NULL,
    ano integer NOT NULL,
    data_matricula timestamp without time zone,
    grau_academico character varying(255),
    situacao_discente integer
);


ALTER TABLE public.coleta_discentes OWNER TO postgres;

--
-- Name: coleta_docentes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coleta_docentes (
    id_programa character varying(50) NOT NULL,
    id_pessoa character varying(50) NOT NULL,
    ano integer NOT NULL,
    tipo_vinculo integer NOT NULL,
    categoria integer NOT NULL,
    tipo_categoria integer,
    carga_horaria_programa integer,
    tipo_vinculo_ies integer NOT NULL,
    inicio timestamp without time zone,
    fim timestamp without time zone
);


ALTER TABLE public.coleta_docentes OWNER TO postgres;

--
-- Name: coleta_egressos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coleta_egressos (
    id_programa character varying(50) NOT NULL,
    id_pessoa character varying(50) NOT NULL,
    ano integer NOT NULL,
    ano_egresso integer NOT NULL,
    grau_academico character varying(255)
);


ALTER TABLE public.coleta_egressos OWNER TO postgres;

--
-- Name: coleta_externos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coleta_externos (
    id_programa character varying(50) NOT NULL,
    id_pessoa character varying(50) NOT NULL,
    ano integer NOT NULL,
    participacao integer NOT NULL,
    tipo_participacao integer,
    inicio timestamp without time zone NOT NULL,
    fim timestamp without time zone
);


ALTER TABLE public.coleta_externos OWNER TO postgres;

--
-- Name: coleta_orientacoes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coleta_orientacoes (
    id_programa character varying(50) NOT NULL,
    id_pessoa character varying(50) NOT NULL,
    ano integer NOT NULL,
    orientacao integer NOT NULL,
    id_docente character varying(50),
    inicio timestamp without time zone,
    fim timestamp without time zone,
    principal integer
);


ALTER TABLE public.coleta_orientacoes OWNER TO postgres;

--
-- Name: coleta_producoes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coleta_producoes (
    id_programa character varying(50) NOT NULL,
    id_producao character varying(50) NOT NULL,
    ano integer NOT NULL,
    id_sub_tipo_producao integer,
    id_tipo_producao integer,
    nome_linha_pesquisa text,
    nome_projeto_pesquisa text,
    nome_producao text,
    data_publicacao timestamp without time zone
);


ALTER TABLE public.coleta_producoes OWNER TO postgres;

--
-- Name: coleta_quantitativo_docente; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coleta_quantitativo_docente (
    id_programa character varying(50) NOT NULL,
    id_pessoa character varying(50) NOT NULL,
    ano integer NOT NULL,
    tutoria integer,
    projeto_final integer,
    mestrado_academico integer,
    doutorado_academico integer,
    disciplina_graduacao integer,
    iniciacao_cientifica integer,
    mestrado_profissional integer,
    doutorado_profissional integer,
    carga_horaria_graduacao integer
);


ALTER TABLE public.coleta_quantitativo_docente OWNER TO postgres;

--
-- Name: coleta_situacao_discente_id_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.coleta_situacao_discente_id_seq1
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.coleta_situacao_discente_id_seq1 OWNER TO postgres;

--
-- Name: coleta_situacao_discente; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coleta_situacao_discente (
    id integer DEFAULT nextval('public.coleta_situacao_discente_id_seq1'::regclass) NOT NULL,
    situacao character varying(255) NOT NULL
);


ALTER TABLE public.coleta_situacao_discente OWNER TO postgres;

--
-- Name: coleta_sub_tipo_producao; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coleta_sub_tipo_producao (
    id integer NOT NULL,
    sub_tipo character varying(255) NOT NULL
);


ALTER TABLE public.coleta_sub_tipo_producao OWNER TO postgres;

--
-- Name: coleta_sub_tipo_producao_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.coleta_sub_tipo_producao_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.coleta_sub_tipo_producao_id_seq OWNER TO postgres;

--
-- Name: coleta_sub_tipo_producao_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.coleta_sub_tipo_producao_id_seq OWNED BY public.coleta_sub_tipo_producao.id;


--
-- Name: coleta_tipo_categoria_docente; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coleta_tipo_categoria_docente (
    id integer NOT NULL,
    categoria character varying(255) NOT NULL
);


ALTER TABLE public.coleta_tipo_categoria_docente OWNER TO postgres;

--
-- Name: coleta_tipo_categoria_docente_id_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.coleta_tipo_categoria_docente_id_seq1
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.coleta_tipo_categoria_docente_id_seq1 OWNER TO postgres;

--
-- Name: coleta_tipo_categoria_docente_id_seq1; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.coleta_tipo_categoria_docente_id_seq1 OWNED BY public.coleta_tipo_categoria_docente.id;


--
-- Name: coleta_tipo_participacao; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coleta_tipo_participacao (
    id integer NOT NULL,
    participacao character varying(255) NOT NULL
);


ALTER TABLE public.coleta_tipo_participacao OWNER TO postgres;

--
-- Name: coleta_tipo_participacao_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.coleta_tipo_participacao_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.coleta_tipo_participacao_id_seq OWNER TO postgres;

--
-- Name: coleta_tipo_participacao_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.coleta_tipo_participacao_id_seq OWNED BY public.coleta_tipo_participacao.id;


--
-- Name: coleta_tipo_producao; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coleta_tipo_producao (
    id integer NOT NULL,
    tipo character varying(255) NOT NULL
);


ALTER TABLE public.coleta_tipo_producao OWNER TO postgres;

--
-- Name: coleta_tipo_producao_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.coleta_tipo_producao_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.coleta_tipo_producao_id_seq OWNER TO postgres;

--
-- Name: coleta_tipo_producao_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.coleta_tipo_producao_id_seq OWNED BY public.coleta_tipo_producao.id;


--
-- Name: coleta_tipo_vinculo_ies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coleta_tipo_vinculo_ies (
    id integer NOT NULL,
    vinculo character varying(255) NOT NULL
);


ALTER TABLE public.coleta_tipo_vinculo_ies OWNER TO postgres;

--
-- Name: coleta_tipo_vinculo_ies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.coleta_tipo_vinculo_ies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.coleta_tipo_vinculo_ies_id_seq OWNER TO postgres;

--
-- Name: coleta_tipo_vinculo_ies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.coleta_tipo_vinculo_ies_id_seq OWNED BY public.coleta_tipo_vinculo_ies.id;


--
-- Name: coleta_tipo_vinculo_programa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coleta_tipo_vinculo_programa (
    id integer NOT NULL,
    vinculo character varying(255) NOT NULL
);


ALTER TABLE public.coleta_tipo_vinculo_programa OWNER TO postgres;

--
-- Name: coleta_tipo_vinculo_programa_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.coleta_tipo_vinculo_programa_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.coleta_tipo_vinculo_programa_id_seq OWNER TO postgres;

--
-- Name: coleta_tipo_vinculo_programa_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.coleta_tipo_vinculo_programa_id_seq OWNED BY public.coleta_tipo_vinculo_programa.id;


--
-- Name: conceitos_indices_avaliacao; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.conceitos_indices_avaliacao (
    nome_area_avaliacao character varying(255) NOT NULL,
    indice character varying(255) NOT NULL,
    "MB" real,
    "B" real,
    "R" real,
    "F" real
);


ALTER TABLE public.conceitos_indices_avaliacao OWNER TO postgres;

--
-- Name: curriculos_lattes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.curriculos_lattes (
    idlattes character varying(100) NOT NULL,
    cpf character varying(20),
    linkavatar text,
    curriculo json,
    dados json,
    dt_atualizacao character varying(12)
);


ALTER TABLE public.curriculos_lattes OWNER TO postgres;

--
-- Name: estados; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estados (
    codigo_uf integer NOT NULL,
    uf character varying(2),
    nome character varying(100),
    latitude real,
    longitude real,
    regiao character varying(12)
);


ALTER TABLE public.estados OWNER TO postgres;

--
-- Name: instituicoes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.instituicoes (
    id_ies character varying(50) NOT NULL,
    nome character varying(255),
    sigla character varying(50),
    estado character varying(100),
    uf character varying(3),
    municipio character varying(255),
    cd_ibge_municipio integer,
    regiao character varying(50),
    organizacao_academica character varying(255),
    categoria_administrativa character varying(255)
);


ALTER TABLE public.instituicoes OWNER TO postgres;

--
-- Name: lattes_dados_complementares; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lattes_dados_complementares (
    num_identificador character varying(255) NOT NULL,
    dados jsonb
);


ALTER TABLE public.lattes_dados_complementares OWNER TO postgres;

--
-- Name: lattes_dados_gerais; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lattes_dados_gerais (
    num_identificador character varying(255) NOT NULL,
    dados jsonb
);


ALTER TABLE public.lattes_dados_gerais OWNER TO postgres;

--
-- Name: lattes_docentes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lattes_docentes (
    num_identificador character varying(255) NOT NULL,
    dt_atualizacao character varying(8),
    hr_atualizacao character varying(6),
    cpf character varying(15),
    nm_completo text,
    nm_citacoes text,
    id_sucupira text,
    linkavatar text
);


ALTER TABLE public.lattes_docentes OWNER TO postgres;

--
-- Name: lattes_outra_producao; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lattes_outra_producao (
    num_identificador character varying(255) NOT NULL,
    tipo character varying(255) NOT NULL,
    dados jsonb
);


ALTER TABLE public.lattes_outra_producao OWNER TO postgres;

--
-- Name: lattes_producao_bibliografica; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lattes_producao_bibliografica (
    num_identificador character varying(255) NOT NULL,
    tipo character varying(255) NOT NULL,
    dados jsonb
);


ALTER TABLE public.lattes_producao_bibliografica OWNER TO postgres;

--
-- Name: lattes_producao_tecnica; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lattes_producao_tecnica (
    num_identificador character varying(255) NOT NULL,
    tipo character varying(255) NOT NULL,
    dados jsonb
);


ALTER TABLE public.lattes_producao_tecnica OWNER TO postgres;

--
-- Name: lattes_producoes_duplicatas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lattes_producoes_duplicatas (
    id integer NOT NULL,
    tipo character varying(255),
    ano integer,
    titulo text,
    autores text
);


ALTER TABLE public.lattes_producoes_duplicatas OWNER TO postgres;

--
-- Name: lattes_producoes_duplicatas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lattes_producoes_duplicatas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lattes_producoes_duplicatas_id_seq OWNER TO postgres;

--
-- Name: lattes_producoes_duplicatas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lattes_producoes_duplicatas_id_seq OWNED BY public.lattes_producoes_duplicatas.id;


--
-- Name: lattes_projetos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lattes_projetos (
    num_identificador character varying(255) NOT NULL,
    nm_projeto text NOT NULL,
    ano_inicio integer NOT NULL,
    ano_fim integer,
    nm_instituicao text,
    cd_instituicao character varying(100),
    orgao text,
    integrantes jsonb,
    situacao character varying(50),
    natureza character varying(50),
    descricao text,
    num_doutorado integer,
    num_mestrado integer,
    num_especializacao integer,
    num_graduacao integer,
    producoes jsonb
);


ALTER TABLE public.lattes_projetos OWNER TO postgres;

--
-- Name: log_acessos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.log_acessos (
    idlattes character varying(255) NOT NULL,
    access_time time without time zone NOT NULL,
    date date NOT NULL,
    ppg_id character varying(255),
    anoi integer,
    anof integer
);


ALTER TABLE public.log_acessos OWNER TO postgres;

--
-- Name: log_erros; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.log_erros (
    path_error character varying(255) NOT NULL,
    file_error character varying(255) NOT NULL,
    date_error date NOT NULL,
    time_error time without time zone NOT NULL,
    cause_error character varying(255),
    line_error smallint
);


ALTER TABLE public.log_erros OWNER TO postgres;

--
-- Name: log_grafos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.log_grafos (
    idlattes character varying(255) NOT NULL,
    access_time time without time zone NOT NULL,
    date date NOT NULL,
    ppg_id character varying(255),
    anoi integer,
    anof integer,
    grafo_name character varying(255)
);


ALTER TABLE public.log_grafos OWNER TO postgres;

--
-- Name: metricas_indicadores_areas_avaliacao; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.metricas_indicadores_areas_avaliacao (
    nome_area_avaliacao character varying(255) NOT NULL,
    metrica character varying(50) NOT NULL,
    mbom real,
    bom real,
    regular real,
    fraco real,
    insuficiente real
);


ALTER TABLE public.metricas_indicadores_areas_avaliacao OWNER TO postgres;

--
-- Name: municipios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.municipios (
    codigo_ibge integer NOT NULL,
    nome character varying(100),
    latitude real,
    longitude real,
    capital boolean,
    codigo_uf integer,
    siafi_id character varying(4),
    ddd integer,
    fuso_horario character varying(32)
);


ALTER TABLE public.municipios OWNER TO postgres;

--
-- Name: pesos_indart_areas_avaliacao; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pesos_indart_areas_avaliacao (
    nome_area_avaliacao character varying(255) NOT NULL,
    "A1" real,
    "A2" real,
    "A3" real,
    "A4" real,
    "B1" real,
    "B2" real,
    "B3" real,
    "B4" real
);


ALTER TABLE public.pesos_indart_areas_avaliacao OWNER TO postgres;

--
-- Name: pessoas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pessoas (
    id_pessoa character varying(50) NOT NULL,
    nome_pessoa text,
    ano_titulacao integer,
    grau_academico character varying(50),
    orcid character varying(100),
    lattes character varying(100),
    id_ies_titulacao character varying(50),
    nome_pais_pessoa character varying(100),
    nome_ies_iitulacao character varying(255),
    pais_ies_titulacao character varying(100),
    nome_area_titulacao character varying(255),
    sigla_ies_titulacao character varying(50),
    codigo_iso_pais_pessoa character varying(50)
);


ALTER TABLE public.pessoas OWNER TO postgres;

--
-- Name: programas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.programas (
    id_programa character varying(50) NOT NULL,
    situacao character varying(50),
    sigla_ies character varying(50),
    nome text,
    nome_area_avaliacao character varying(255),
    nome_area_conhecimento character varying(255),
    conceito character varying(2),
    modalidade character varying(50),
    nome_uf character varying(255),
    nome_grande_area_conhecimento character varying(255),
    sigla_curso character varying(50),
    ano_base integer,
    sigla_uf character varying(3),
    data_homologacao character varying(50),
    id_pessoa_coordenador character varying(50),
    regime_letivo character varying(50),
    contato_url character varying(255),
    nome_ingles character varying(255),
    nome_coordenador character varying(255),
    nome_regiao character varying(50),
    id_ies character varying(50),
    codigo_programa character varying(50),
    municipio character varying(255),
    contato_email character varying(255),
    grau character varying(255),
    programa_em_rede integer,
    ano_inicio integer,
    end_cep character varying(50),
    anos_coleta text
);


ALTER TABLE public.programas OWNER TO postgres;

--
-- Name: programas_areas_concentracao; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.programas_areas_concentracao (
    id_programa character varying(50) NOT NULL,
    id_area integer NOT NULL,
    nome_area text,
    ano_inicio integer,
    ano_fim integer
);


ALTER TABLE public.programas_areas_concentracao OWNER TO postgres;

--
-- Name: programas_cursos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.programas_cursos (
    id_programa character varying(50) NOT NULL,
    id_curso character varying(50) NOT NULL,
    grau character varying(255),
    nome text,
    codigo character varying(50),
    conceito character varying(2),
    situacao character varying(50),
    credito_tcc integer,
    inicio integer,
    credito_outro integer,
    ano_recomendacao integer,
    credito_disciplina integer,
    carga_horaria_credito integer
);


ALTER TABLE public.programas_cursos OWNER TO postgres;

--
-- Name: programas_historico; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.programas_historico (
    id_programa character varying(50) NOT NULL,
    ano integer NOT NULL,
    situacao character varying(255),
    sigla_curso character varying(50),
    id_pessoa_coordenador character varying(50),
    nome_coordenador text,
    grau character varying(255),
    conceito character varying(2),
    modalidade character varying(50),
    dados jsonb
);


ALTER TABLE public.programas_historico OWNER TO postgres;

--
-- Name: programas_instituicoes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.programas_instituicoes (
    id_programa character varying(50) NOT NULL,
    id_ies character varying(50) NOT NULL,
    fim integer,
    inicio integer,
    principal integer
);


ALTER TABLE public.programas_instituicoes OWNER TO postgres;

--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    idlattes character(16) NOT NULL,
    cpf character(11),
    full_name character varying(100),
    email character varying(255),
    hashed_password character varying(255),
    is_active boolean,
    is_superuser boolean,
    id_ies character varying(50),
    is_admin boolean
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- Name: coleta_sub_tipo_producao id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coleta_sub_tipo_producao ALTER COLUMN id SET DEFAULT nextval('public.coleta_sub_tipo_producao_id_seq'::regclass);


--
-- Name: coleta_tipo_categoria_docente id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coleta_tipo_categoria_docente ALTER COLUMN id SET DEFAULT nextval('public.coleta_tipo_categoria_docente_id_seq1'::regclass);


--
-- Name: coleta_tipo_participacao id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coleta_tipo_participacao ALTER COLUMN id SET DEFAULT nextval('public.coleta_tipo_participacao_id_seq'::regclass);


--
-- Name: coleta_tipo_producao id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coleta_tipo_producao ALTER COLUMN id SET DEFAULT nextval('public.coleta_tipo_producao_id_seq'::regclass);


--
-- Name: coleta_tipo_vinculo_ies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coleta_tipo_vinculo_ies ALTER COLUMN id SET DEFAULT nextval('public.coleta_tipo_vinculo_ies_id_seq'::regclass);


--
-- Name: coleta_tipo_vinculo_programa id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coleta_tipo_vinculo_programa ALTER COLUMN id SET DEFAULT nextval('public.coleta_tipo_vinculo_programa_id_seq'::regclass);


--
-- Name: lattes_producoes_duplicatas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lattes_producoes_duplicatas ALTER COLUMN id SET DEFAULT nextval('public.lattes_producoes_duplicatas_id_seq'::regclass);


--
-- Name: capes_qualis_periodicos capes_qualis_artigos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.capes_qualis_periodicos
    ADD CONSTRAINT capes_qualis_artigos_pkey PRIMARY KEY (issn, area, periodo);


--
-- Name: coleta_autores coleta_autores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coleta_autores
    ADD CONSTRAINT coleta_autores_pkey PRIMARY KEY (id_programa, id_producao, ano, id_pessoa);


--
-- Name: coleta_detalhamento_producao coleta_detalhamento_producao_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coleta_detalhamento_producao
    ADD CONSTRAINT coleta_detalhamento_producao_pkey PRIMARY KEY (item, id_producao);


--
-- Name: coleta_detalhamento_producao_tcc coleta_detalhamento_producao_tcc_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coleta_detalhamento_producao_tcc
    ADD CONSTRAINT coleta_detalhamento_producao_tcc_pkey PRIMARY KEY (id_producao);


--
-- Name: coleta_discentes coleta_discentes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coleta_discentes
    ADD CONSTRAINT coleta_discentes_pkey PRIMARY KEY (id_programa, id_pessoa, ano);


--
-- Name: coleta_docentes coleta_docentes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coleta_docentes
    ADD CONSTRAINT coleta_docentes_pkey PRIMARY KEY (id_programa, id_pessoa, ano, tipo_vinculo_ies, categoria);


--
-- Name: coleta_egressos coleta_egressos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coleta_egressos
    ADD CONSTRAINT coleta_egressos_pkey PRIMARY KEY (id_programa, id_pessoa, ano_egresso);


--
-- Name: coleta_externos coleta_externos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coleta_externos
    ADD CONSTRAINT coleta_externos_pkey PRIMARY KEY (id_programa, id_pessoa, ano, inicio, participacao);


--
-- Name: coleta_orientacoes coleta_orientacoes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coleta_orientacoes
    ADD CONSTRAINT coleta_orientacoes_pkey PRIMARY KEY (id_programa, id_pessoa, ano, orientacao);


--
-- Name: coleta_producoes coleta_producao_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coleta_producoes
    ADD CONSTRAINT coleta_producao_pkey PRIMARY KEY (id_programa, id_producao, ano);


--
-- Name: coleta_quantitativo_docente coleta_quantitativo_docente_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coleta_quantitativo_docente
    ADD CONSTRAINT coleta_quantitativo_docente_pkey PRIMARY KEY (id_programa, id_pessoa, ano);


--
-- Name: coleta_situacao_discente coleta_situacao_discente_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coleta_situacao_discente
    ADD CONSTRAINT coleta_situacao_discente_pkey PRIMARY KEY (situacao);


--
-- Name: coleta_sub_tipo_producao coleta_sub_tipo_producao_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coleta_sub_tipo_producao
    ADD CONSTRAINT coleta_sub_tipo_producao_pkey PRIMARY KEY (sub_tipo);


--
-- Name: coleta_tipo_categoria_docente coleta_tipo_categoria_docente_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coleta_tipo_categoria_docente
    ADD CONSTRAINT coleta_tipo_categoria_docente_pkey PRIMARY KEY (categoria);


--
-- Name: coleta_tipo_participacao coleta_tipo_participacao_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coleta_tipo_participacao
    ADD CONSTRAINT coleta_tipo_participacao_pkey PRIMARY KEY (participacao);


--
-- Name: coleta_tipo_producao coleta_tipo_producao_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coleta_tipo_producao
    ADD CONSTRAINT coleta_tipo_producao_pkey PRIMARY KEY (tipo);


--
-- Name: coleta_tipo_vinculo_ies coleta_tipo_vinculo_ies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coleta_tipo_vinculo_ies
    ADD CONSTRAINT coleta_tipo_vinculo_ies_pkey PRIMARY KEY (vinculo);


--
-- Name: coleta_tipo_vinculo_programa coleta_tipo_vinculo_programa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coleta_tipo_vinculo_programa
    ADD CONSTRAINT coleta_tipo_vinculo_programa_pkey PRIMARY KEY (vinculo);


--
-- Name: conceitos_indices_avaliacao conceitos_indices_avaliacao_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conceitos_indices_avaliacao
    ADD CONSTRAINT conceitos_indices_avaliacao_pkey PRIMARY KEY (nome_area_avaliacao, indice);


--
-- Name: curriculos_lattes docentes_lattes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.curriculos_lattes
    ADD CONSTRAINT docentes_lattes_pkey PRIMARY KEY (idlattes);


--
-- Name: estados estados_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estados
    ADD CONSTRAINT estados_pkey PRIMARY KEY (codigo_uf);


--
-- Name: instituicoes instituicoes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.instituicoes
    ADD CONSTRAINT instituicoes_pkey PRIMARY KEY (id_ies);


--
-- Name: lattes_dados_complementares lattes_dados_complementares_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lattes_dados_complementares
    ADD CONSTRAINT lattes_dados_complementares_pkey PRIMARY KEY (num_identificador);


--
-- Name: lattes_dados_gerais lattes_dados_gerais_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lattes_dados_gerais
    ADD CONSTRAINT lattes_dados_gerais_pkey PRIMARY KEY (num_identificador);


--
-- Name: lattes_docentes lattes_docentes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lattes_docentes
    ADD CONSTRAINT lattes_docentes_pkey PRIMARY KEY (num_identificador);


--
-- Name: lattes_outra_producao lattes_outra_producao_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lattes_outra_producao
    ADD CONSTRAINT lattes_outra_producao_pkey PRIMARY KEY (num_identificador, tipo);


--
-- Name: lattes_producao_bibliografica lattes_producao_bibliografica_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lattes_producao_bibliografica
    ADD CONSTRAINT lattes_producao_bibliografica_pkey PRIMARY KEY (num_identificador, tipo);


--
-- Name: lattes_producao_tecnica lattes_producao_tecnica_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lattes_producao_tecnica
    ADD CONSTRAINT lattes_producao_tecnica_pkey PRIMARY KEY (num_identificador, tipo);


--
-- Name: lattes_producoes_duplicatas lattes_producoes_duplicatas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lattes_producoes_duplicatas
    ADD CONSTRAINT lattes_producoes_duplicatas_pkey PRIMARY KEY (id);


--
-- Name: lattes_projetos lattes_projetos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lattes_projetos
    ADD CONSTRAINT lattes_projetos_pkey PRIMARY KEY (num_identificador, nm_projeto, ano_inicio);


--
-- Name: log_acessos log_acessos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.log_acessos
    ADD CONSTRAINT log_acessos_pkey PRIMARY KEY (idlattes, access_time, date);


--
-- Name: log_erros log_erros_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.log_erros
    ADD CONSTRAINT log_erros_pkey PRIMARY KEY (path_error, file_error, date_error, time_error);


--
-- Name: log_grafos log_grafos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.log_grafos
    ADD CONSTRAINT log_grafos_pkey PRIMARY KEY (idlattes, access_time, date);


--
-- Name: metricas_indicadores_areas_avaliacao metricas_indicadores_areas_avaliacao_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metricas_indicadores_areas_avaliacao
    ADD CONSTRAINT metricas_indicadores_areas_avaliacao_pkey PRIMARY KEY (nome_area_avaliacao, metrica);


--
-- Name: municipios municipios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.municipios
    ADD CONSTRAINT municipios_pkey PRIMARY KEY (codigo_ibge);


--
-- Name: pesos_indart_areas_avaliacao pesos_indart_areas_avaliacao_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pesos_indart_areas_avaliacao
    ADD CONSTRAINT pesos_indart_areas_avaliacao_pkey PRIMARY KEY (nome_area_avaliacao);


--
-- Name: pessoas pessoas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pessoas
    ADD CONSTRAINT pessoas_pkey PRIMARY KEY (id_pessoa);


--
-- Name: programas_areas_concentracao programas_areas_concentracao_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.programas_areas_concentracao
    ADD CONSTRAINT programas_areas_concentracao_pkey PRIMARY KEY (id_programa, id_area);


--
-- Name: programas_cursos programas_cursos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.programas_cursos
    ADD CONSTRAINT programas_cursos_pkey PRIMARY KEY (id_programa, id_curso);


--
-- Name: programas_historico programas_historico_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.programas_historico
    ADD CONSTRAINT programas_historico_pkey PRIMARY KEY (id_programa, ano);


--
-- Name: programas_instituicoes programas_instituicoes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.programas_instituicoes
    ADD CONSTRAINT programas_instituicoes_pkey PRIMARY KEY (id_programa, id_ies);


--
-- Name: programas programas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.programas
    ADD CONSTRAINT programas_pkey PRIMARY KEY (id_programa);


--
-- Name: usuarios usuarios_cpf_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_cpf_key UNIQUE (cpf);


--
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (idlattes);


--
-- Name: index_detalhe_producao; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_detalhe_producao ON public.coleta_detalhamento_producao USING btree (id_producao);


--
-- PostgreSQL database dump complete
--

