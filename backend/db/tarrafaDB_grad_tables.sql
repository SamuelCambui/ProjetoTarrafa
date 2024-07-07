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
-- Name: tarrafaDB_grad; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE "tarrafaDB_grad" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF-8';


ALTER DATABASE "tarrafaDB_grad" OWNER TO postgres;

\connect "tarrafaDB_grad"

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
-- Name: formulario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.formulario (
    cpf character varying(11) NOT NULL,
    nome character varying(255),
    nome_social character varying(255),
    rg character varying(11),
    email character varying(255),
    estado_civil character varying(13),
    cep character varying(8),
    logradouro character varying(255),
    bairro character varying(255),
    cidade character varying(30),
    estado character varying(2),
    num_casa integer,
    genero character varying(255),
    genero_identifica character varying(255),
    etnia character varying(100),
    pronomes character varying(100),
    possui_necessidade boolean,
    necessidade character varying(255),
    contato_pessoal character varying(11),
    contato_medico character varying(11),
    contato_familiar character varying(11),
    complemento_casa character varying(100),
    matricula character varying(50)
);


ALTER TABLE public.formulario OWNER TO postgres;

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
-- Name: lattes_discentes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lattes_discentes (
    num_identificador character varying(255) NOT NULL,
    dt_atualizacao character varying(8),
    hr_atualizacao character varying(6),
    cpf character varying(15),
    nm_completo text,
    nm_citacoes text,
    id_sucupira text,
    linkavatar text
);


ALTER TABLE public.lattes_discentes OWNER TO postgres;

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
-- Name: view_contatos; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.view_contatos AS
 SELECT contato_pessoal,
    contato_medico,
    contato_familiar,
    email
   FROM public.formulario;


ALTER VIEW public.view_contatos OWNER TO postgres;

--
-- Name: view_enderecos; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.view_enderecos AS
 SELECT cep,
    logradouro,
    bairro,
    num_casa,
    cidade,
    estado
   FROM public.formulario;


ALTER VIEW public.view_enderecos OWNER TO postgres;

--
-- Name: view_identidades; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.view_identidades AS
 SELECT cpf,
    genero,
    genero_identifica,
    etnia,
    pronomes
   FROM public.formulario;


ALTER VIEW public.view_identidades OWNER TO postgres;

--
-- Name: curriculos_lattes docentes_lattes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.curriculos_lattes
    ADD CONSTRAINT docentes_lattes_pkey PRIMARY KEY (idlattes);


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
-- Name: lattes_discentes lattes_docentes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lattes_discentes
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
-- Name: lattes_projetos lattes_projetos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lattes_projetos
    ADD CONSTRAINT lattes_projetos_pkey PRIMARY KEY (num_identificador, nm_projeto, ano_inicio);


--
-- Name: formulario pk_cpf; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formulario
    ADD CONSTRAINT pk_cpf PRIMARY KEY (cpf);


--
-- Name: formulario unique_email; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formulario
    ADD CONSTRAINT unique_email UNIQUE (email);


--
-- Name: formulario unique_pessoal; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formulario
    ADD CONSTRAINT unique_pessoal UNIQUE (contato_pessoal);


--
-- Name: formulario unique_rg; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formulario
    ADD CONSTRAINT unique_rg UNIQUE (rg);


--
-- Name: curriculos_lattes_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX curriculos_lattes_index ON public.curriculos_lattes USING btree (idlattes);


--
-- PostgreSQL database dump complete
--

