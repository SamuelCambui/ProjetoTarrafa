from backend.db.db import DBConnector
import jellyfish
from backend.core import utils
from backend.core.utils import tratamento_excecao_db_ppg
from datetime import datetime, timedelta
from typing import List
import time
from itertools import combinations
import pandas as pd

class QueriesPPG():

    #* Indicadores
    @tratamento_excecao_db_ppg()
    def retorna_id_ies(self, id: str, db: DBConnector = None):
        query = "select id_ies from programas where codigo_programa = %(id)s"
        row = db.fetch_one(query, id=id)
        if row:
            return row[0]
        return None
    
    @tratamento_excecao_db_ppg()
    def retorna_link_avatar_lattes(self, ids: str, idlattes: bool, db: DBConnector = None):
        """
        Retorna o link do avatar do currículo Lattes
        """
        avatar = ''

        if idlattes:
            query = f"""select linkavatar from lattes_docentes where num_identificador = '{ids}'"""
            row = db.fetch_one(query)
            if row and len(row) > 0:
                avatar = row[0].replace('http:', 'https:')
            else:
                avatar = '/assets/img/avatars/avatar1.jpeg'
        else:
            ids_s = ids.split(',')
            for id in ids_s:
                id = id.strip()
                query = f"""select linkavatar from lattes_docentes where id_sucupira like '%{id}%'"""

                row = db.fetch_one(query)
                if row and len(row) > 0:
                    avatar = row[0].replace('http:', 'https:')
                else:
                    avatar = '/assets/img/avatars/avatar1.jpeg'

        return avatar

    @tratamento_excecao_db_ppg()
    def retorna_lista_de_permanentes_do_ppg(self, id: str, ano: int, db: DBConnector = None):
        """
        Retorna uma lista com os docentes permantes do ppg (id == codigo_do_programa)
        """
        query = """select dados->>'permanentes' as permanentes from programas_historico where 
                ano = %(ano)s and id_programa = (select id_programa from programas where codigo_programa = %(id)s)"""
        row = db.fetch_one(query, id=id, ano=ano)
        if row:
            return row[0]
        return None
    
    @tratamento_excecao_db_ppg()
    def retorna_ultimo_ano_coleta(self, db:DBConnector = None):
        """
        Retorna o ultimo ano de coleta da tabela programa_históricos
        """
        query = 'select max(ano) from (SELECT ano FROM programas_historico group by ano order by ano) as anos'
        
        row = db.fetch_one(query)
        if row:
            return row[0]
        return None

    @tratamento_excecao_db_ppg()
    def retorna_contagem_de_qualis_do_lattes(self, id: str, anof: int, anocoleta: int, db: DBConnector = None):
        """
        Retornar o quantitativo de artigos com qualis considerando a base de dados lattes

        Parametros:
            Id(str): Id do PPG (codigo_do_programa)
            anof(int): ano atual
            db(class): DataBase
        """

        query = """with query_qualis as (
	            with query_ids as (
                    with query_qualis as (
                    select ld.num_identificador, 
                        issn, 
                        titulo, 
                        (select qualis from capes_qualis_periodicos as cqp 
                                where cqp.issn = artigos_total.issn and 
                                cqp.area ilike  ANY (
			 						select '%%' || nome_area_avaliacao || '%%' from programas where codigo_programa = %(id)s )
                                     group by qualis
                        ) as qualis, 
                        ano, 
                        count(*) as quantidade 
                        from (select CONCAT(SUBSTRING(d."DETALHAMENTO-DO-ARTIGO"->>'@ISSN', 1, 4), '-', SUBSTRING(d."DETALHAMENTO-DO-ARTIGO"->>'@ISSN', 5)) as issn, 
                                    d."DADOS-BASICOS-DO-ARTIGO"->>'@TITULO-DO-ARTIGO' as titulo,
                                    cast(d."DADOS-BASICOS-DO-ARTIGO"->>'@ANO-DO-ARTIGO' as integer) as ano,
                                    num_identificador
                                from lattes_producao_bibliografica as lpb
                                join lateral jsonb_to_recordset(lpb.dados) as d("DETALHAMENTO-DO-ARTIGO" jsonb, "DADOS-BASICOS-DO-ARTIGO" jsonb) on true    
                                where lpb.tipo = 'ARTIGO-PUBLICADO' and 
                                    d."DETALHAMENTO-DO-ARTIGO"->>'@ISSN' != '' and 									  
                                    d."DADOS-BASICOS-DO-ARTIGO"->>'@ANO-DO-ARTIGO' = '%(anof)s' 
                            ) as artigos_total
                        inner join lattes_docentes as ld on (ld.num_identificador = artigos_total.num_identificador)
                        group by ld.num_identificador, issn, titulo, qualis, ano
                    )
                        
                    select  qq.ano,
                            issn,
                            titulo,
                            qualis,
                            quantidade,
                            STRING_AGG(num_identificador, ',') as ids
                        from query_qualis as qq
                        where qualis is not null
                        group by qq.ano,
                                issn,
                                titulo,
                                qualis,
                                quantidade
                                order by titulo)
			select qids.ano, dp.id_pessoa, qids.issn, qids.titulo, qids.qualis, qids.ids, qids.quantidade from query_ids as qids
					inner join pessoas as p on ids like '%%'||p.lattes||'%%'
                    inner join coleta_docentes as dp on dp.id_pessoa = p.id_pessoa and dp.tipo_categoria = 3 and dp.ano = %(anocoleta)s and dp.id_programa = (select id_programa from programas where codigo_programa = %(id)s)
                    group by qids.ano, dp.id_pessoa, qids.issn, qids.titulo, qids.qualis, qids.ids, qids.quantidade)
			select  qq.ano, qq.id_pessoa, 
                    SUM(CASE WHEN qualis = 'A1' THEN 1 ELSE 0 END) AS "A1",
                        SUM(CASE WHEN qualis = 'A2' THEN 1 ELSE 0 END) AS "A2",
                        SUM(CASE WHEN qualis = 'A3' THEN 1 ELSE 0 END) AS "A3",
                        SUM(CASE WHEN qualis = 'A4' THEN 1 ELSE 0 END) AS "A4",
                        SUM(CASE WHEN qualis = 'B1' THEN 1 ELSE 0 END) AS "B1",
                        SUM(CASE WHEN qualis = 'B2' THEN 1 ELSE 0 END) AS "B2",
                        SUM(CASE WHEN qualis = 'B3' THEN 1 ELSE 0 END) AS "B3",
                        SUM(CASE WHEN qualis = 'B4' THEN 1 ELSE 0 END) AS "B4",
                        SUM(CASE WHEN qualis = 'C' THEN 1 ELSE 0 END) AS "C"
                from query_qualis as qq
                group by qq.ano, qq.id_pessoa"""
        
        # print("Query retorna_contagem_de_qualis_do_lattes: ", query)
        # print(f"id = {id}, anof = {anof}, anocoleta = {anocoleta}")
        # q = query.replace('%(id)s', f"'{id}'").replace('%(anocoleta)s', str(anocoleta)).replace('%(anof)s', str(anof))
        row = db.fetch_all(query, id=id, anof=anof, anocoleta=anocoleta)
        # row = db.fetch_all(q)
        # print("ROW: ", row)
        products_atual = [dict(r) for r in row]
        return products_atual
    
    @tratamento_excecao_db_ppg()
    def retorna_contagem_de_qualis_do_lattes_anonimo(self, id: str, anof: int, ano_coleta: int, db: DBConnector = None):
        """
        Retornar o quantitativo de artigos com qualis considerando a base de dados lattes

        Parametros:
            Id(str): Id do PPG (codigo_do_programa)
            anof(int): ano atual
            db(class): DataBase
        """

        query = """with query_qualis as (
	            with query_ids as (
                    with query_qualis as (
                    select ld.num_identificador, 
                        issn, 
                        titulo, 
                        (select qualis from capes_qualis_periodicos as cqp 
                                where cqp.issn = artigos_total.issn and 
                                cqp.area ilike  ANY (
			 						select '%%' || nome_area_avaliacao || '%%' from programas where codigo_programa = %(id)s )
                                     group by qualis
                        ) as qualis, 
                        ano, 
                        count(*) as quantidade 
                        from (select CONCAT(SUBSTRING(d."DETALHAMENTO-DO-ARTIGO"->>'@ISSN', 1, 4), '-', SUBSTRING(d."DETALHAMENTO-DO-ARTIGO"->>'@ISSN', 5)) as issn, 
                                    d."DADOS-BASICOS-DO-ARTIGO"->>'@TITULO-DO-ARTIGO' as titulo,
                                    cast(d."DADOS-BASICOS-DO-ARTIGO"->>'@ANO-DO-ARTIGO' as integer) as ano,
                                    num_identificador
                                from lattes_producao_bibliografica as lpb
                                join lateral jsonb_to_recordset(lpb.dados) as d("DETALHAMENTO-DO-ARTIGO" jsonb, "DADOS-BASICOS-DO-ARTIGO" jsonb) on true    
                                where lpb.tipo = 'ARTIGO-PUBLICADO' and 
                                    d."DETALHAMENTO-DO-ARTIGO"->>'@ISSN' != '' and 									  
                                    d."DADOS-BASICOS-DO-ARTIGO"->>'@ANO-DO-ARTIGO' = '%(anof)s' 
                            ) as artigos_total
                        inner join lattes_docentes as ld on (ld.num_identificador = artigos_total.num_identificador)
                        group by ld.num_identificador, issn, titulo, qualis, ano
                    )
                        
                    select  qq.ano,
                            issn,
                            titulo,
                            qualis,
                            quantidade,
                            STRING_AGG(num_identificador, ',') as ids
                        from query_qualis as qq
                        where qualis is not null
                        group by qq.ano,
                                issn,
                                titulo,
                                qualis,
                                quantidade
                                order by titulo)
			select qids.ano, qids.issn, lower(qids.titulo) as titulo, qids.qualis from query_ids as qids
					inner join pessoas as p on ids like '%%'||p.lattes||'%%'
                    inner join coleta_docentes as dp on dp.id_pessoa = p.id_pessoa and dp.tipo_categoria = 3 and dp.ano = %(anocoleta)s and dp.id_programa = (select id_programa from programas where codigo_programa = %(id)s)
                    group by qids.ano, qids.issn, titulo, qids.qualis
                    order by qids.qualis)
			select  qq.ano, 
                    SUM(CASE WHEN qualis = 'A1' THEN 1 ELSE 0 END) AS "A1",
                        SUM(CASE WHEN qualis = 'A2' THEN 1 ELSE 0 END) AS "A2",
                        SUM(CASE WHEN qualis = 'A3' THEN 1 ELSE 0 END) AS "A3",
                        SUM(CASE WHEN qualis = 'A4' THEN 1 ELSE 0 END) AS "A4",
                        SUM(CASE WHEN qualis = 'B1' THEN 1 ELSE 0 END) AS "B1",
                        SUM(CASE WHEN qualis = 'B2' THEN 1 ELSE 0 END) AS "B2",
                        SUM(CASE WHEN qualis = 'B3' THEN 1 ELSE 0 END) AS "B3",
                        SUM(CASE WHEN qualis = 'B4' THEN 1 ELSE 0 END) AS "B4",
                        SUM(CASE WHEN qualis = 'C' THEN 1 ELSE 0 END) AS "C"
                from query_qualis as qq
                group by qq.ano"""
        
        query_artigos = """with query_ids as (
                    with query_qualis as (
                    select ld.num_identificador, 
                        issn, 
                        titulo, 
                        (select qualis from capes_qualis_periodicos as cqp 
                                where cqp.issn = artigos_total.issn and 
                                cqp.area ilike  ANY (
			 						select '%%' || nome_area_avaliacao || '%%' from programas where codigo_programa = %(id)s )
                                     group by qualis
                        ) as qualis, 
                        ano, 
                        count(*) as quantidade 
                        from (select CONCAT(SUBSTRING(d."DETALHAMENTO-DO-ARTIGO"->>'@ISSN', 1, 4), '-', SUBSTRING(d."DETALHAMENTO-DO-ARTIGO"->>'@ISSN', 5)) as issn, 
                                    d."DADOS-BASICOS-DO-ARTIGO"->>'@TITULO-DO-ARTIGO' as titulo,
                                    cast(d."DADOS-BASICOS-DO-ARTIGO"->>'@ANO-DO-ARTIGO' as integer) as ano,
                                    num_identificador
                                from lattes_producao_bibliografica as lpb
                                join lateral jsonb_to_recordset(lpb.dados) as d("DETALHAMENTO-DO-ARTIGO" jsonb, "DADOS-BASICOS-DO-ARTIGO" jsonb) on true    
                                where lpb.tipo = 'ARTIGO-PUBLICADO' and 
                                    d."DETALHAMENTO-DO-ARTIGO"->>'@ISSN' != '' and 									  
                                    d."DADOS-BASICOS-DO-ARTIGO"->>'@ANO-DO-ARTIGO' = '%(anof)s' 
                            ) as artigos_total
                        inner join lattes_docentes as ld on (ld.num_identificador = artigos_total.num_identificador)
                        group by ld.num_identificador, issn, titulo, qualis, ano
                    )
                        
                    select  qq.ano,
                            issn,
                            titulo,
                            qualis,
                            quantidade,
                            STRING_AGG(num_identificador, ',') as ids
                        from query_qualis as qq
                        where qualis is not null
                        group by qq.ano,
                                issn,
                                titulo,
                                qualis,
                                quantidade
                                order by titulo)
			select qids.ano, qids.issn, lower(qids.titulo) as nome_producao, qids.qualis from query_ids as qids
					inner join pessoas as p on ids like '%%'||p.lattes||'%%'
                    inner join coleta_docentes as dp on dp.id_pessoa = p.id_pessoa and dp.tipo_categoria = 3 and dp.ano = %(anocoleta)s and dp.id_programa = (select id_programa from programas where codigo_programa = %(id)s)
                    group by qids.ano, qids.issn, nome_producao, qids.qualis
                    order by qids.qualis"""
        
        row = db.fetch_all(query, id=id, anof=anof, anocoleta=ano_coleta)
        products_atual = [dict(r) for r in row]

        row = db.fetch_all(query_artigos, id=id, anof=anof, anocoleta=ano_coleta)
        artigos = [dict(r) for r in row]
        for art in artigos:
            art['duplicado'] = 0

        for art1 in artigos:
            if art1['duplicado'] == 0:
                for art2 in artigos:
                    if art2['duplicado'] == 0:
                        if art1 != art2:
                            similarity = jellyfish.jaro_winkler_similarity(art1['nome_producao'], art2['nome_producao'])
                            if similarity > 0.9 and (art1['ano'] == art2['ano'] and art1['issn'] == art2['issn']):
                                art1['duplicado'] = art2['duplicado'] = similarity

        return products_atual, artigos

    @tratamento_excecao_db_ppg()
    def retorna_contagem_de_qualis_com_listanegra(self, id: str, anoi: int, anof: int, listanegra: List, db: DBConnector = None):
        """
        Retornar o quantitativo de artigos com qualis por docente (id_pessoa) para que o filtro do simulador de parâmetros da página funcione

        Parametros:
            id(str): Id do PPG
            anoi(int): ano de início
            anof(int): ano de fim
            db(class): DataBase
        Returno:
            produtos(dicionario)
        """

    
        permanentes = {}

        ano_atual = datetime.now().year
        
        ultimo_ano_coleta = self.retorna_ultimo_ano_coleta()

        diferenca_anos = ano_atual - ultimo_ano_coleta
        
        for a in range(anoi, ultimo_ano_coleta+diferenca_anos+1):
            if a > ultimo_ano_coleta:
                lista_permanente = self.retorna_lista_de_permanentes_do_ppg(id, ultimo_ano_coleta)
            else:
                lista_permanente = self.retorna_lista_de_permanentes_do_ppg(id, a)
            if lista_permanente:
                permanentes[a] = eval(lista_permanente)
        
        if listanegra:
            query = """with qqualis as(
                                                with qtotal as (select cp.nome_producao, cd.id_pessoa, cp.ano, substring(cdp.valor,2,9) as issn, p.nome_area_avaliacao 
                                                from coleta_detalhamento_producao as cdp 
                                                inner join coleta_producoes as cp on (cdp.id_producao = cp.id_producao and cp.ano >= %(anoi)s and cp.ano <= %(anof)s and cp.id_sub_tipo_producao = 18)
                                                inner join programas as p on p.id_programa = cp.id_programa and p.codigo_programa = %(id)s
                                                inner join coleta_autores as ca on (ca.id_producao = cp.id_producao and ca.tipo_vinculo = 3)
                                                inner join coleta_docentes as cd on (cd.id_pessoa = ca.id_pessoa and cp.ano = cd.ano and cd.tipo_categoria = 3)
                                                where item ilike '%%ISSN%%'
                                                group by cp.nome_producao, cd.id_pessoa, cp.ano, issn, p.nome_area_avaliacao
                                                order by cp.ano)

                                                select nome_producao, id_pessoa, ano, qtotal.issn, nome_area_avaliacao, qualis from capes_qualis_periodicos as cqp
                                                inner join qtotal on (qtotal.issn = cqp.issn and trim(cqp.area) = trim(nome_area_avaliacao))
                                                group by nome_producao, id_pessoa, ano, qtotal.issn, nome_area_avaliacao, qualis
                                                order by qualis ASC)

                                                select ano, id_pessoa, SUM(CASE WHEN qualis = 'A1' THEN 1 ELSE 0 END) AS "A1",
                                                                                        SUM(CASE WHEN qualis = 'A2' THEN 1 ELSE 0 END) AS "A2",
                                                                                        SUM(CASE WHEN qualis = 'A3' THEN 1 ELSE 0 END) AS "A3",
                                                                                        SUM(CASE WHEN qualis = 'A4' THEN 1 ELSE 0 END) AS "A4",
                                                                                        SUM(CASE WHEN qualis = 'B1' THEN 1 ELSE 0 END) AS "B1",
                                                                                        SUM(CASE WHEN qualis = 'B2' THEN 1 ELSE 0 END) AS "B2",
                                                                                        SUM(CASE WHEN qualis = 'B3' THEN 1 ELSE 0 END) AS "B3",
                                                                                        SUM(CASE WHEN qualis = 'B4' THEN 1 ELSE 0 END) AS "B4",
                                                                                        SUM(CASE WHEN qualis = 'C' THEN 1 ELSE 0 END) AS "C"
                                                from qqualis
                                                group by ano, id_pessoa
                                                order by ano"""
            
        else:
            query = """with qqualis as(
                                                with qtotal as (select cp.nome_producao, cp.ano, substring(cdp.valor,2,9) as issn, p.nome_area_avaliacao 
                                                from coleta_detalhamento_producao as cdp 
                                                inner join coleta_producoes as cp on (cdp.id_producao = cp.id_producao and cp.ano >= %(anoi)s and cp.ano <= %(anof)s and cp.id_sub_tipo_producao = 18)
                                                inner join programas as p on p.id_programa = cp.id_programa and p.codigo_programa = %(id)s
                                                inner join coleta_autores as ca on (ca.id_producao = cp.id_producao and ca.tipo_vinculo = 3)
                                                inner join coleta_docentes as cd on (cd.id_pessoa = ca.id_pessoa and cp.ano = cd.ano and cd.tipo_categoria = 3)
                                                where item ilike '%%ISSN%%'
                                                group by cp.nome_producao, cp.ano, issn, p.nome_area_avaliacao
                                                order by cp.ano)

                                                select nome_producao, ano, qtotal.issn, nome_area_avaliacao, qualis from capes_qualis_periodicos as cqp
                                                inner join qtotal on (qtotal.issn = cqp.issn and trim(cqp.area) = trim(nome_area_avaliacao))
                                                group by nome_producao, ano, qtotal.issn, nome_area_avaliacao, qualis
                                                order by qualis ASC)

                                                select ano, SUM(CASE WHEN qualis = 'A1' THEN 1 ELSE 0 END) AS "A1",
                                                                                        SUM(CASE WHEN qualis = 'A2' THEN 1 ELSE 0 END) AS "A2",
                                                                                        SUM(CASE WHEN qualis = 'A3' THEN 1 ELSE 0 END) AS "A3",
                                                                                        SUM(CASE WHEN qualis = 'A4' THEN 1 ELSE 0 END) AS "A4",
                                                                                        SUM(CASE WHEN qualis = 'B1' THEN 1 ELSE 0 END) AS "B1",
                                                                                        SUM(CASE WHEN qualis = 'B2' THEN 1 ELSE 0 END) AS "B2",
                                                                                        SUM(CASE WHEN qualis = 'B3' THEN 1 ELSE 0 END) AS "B3",
                                                                                        SUM(CASE WHEN qualis = 'B4' THEN 1 ELSE 0 END) AS "B4",
                                                                                        SUM(CASE WHEN qualis = 'C' THEN 1 ELSE 0 END) AS "C"
                                                from qqualis
                                                group by ano
                                                order by ano"""
        
        query_artigos = """with qtotal as (select cp.nome_producao, cp.ano, substring(cdp.valor,2,9) as issn, p.nome_area_avaliacao 
                                                from coleta_detalhamento_producao as cdp 
                                                inner join coleta_producoes as cp on (cdp.id_producao = cp.id_producao and cp.ano >= %(anoi)s and cp.ano <= %(anof)s and cp.id_sub_tipo_producao = 18)
                                                inner join programas as p on p.id_programa = cp.id_programa and p.codigo_programa = %(id)s
                                                inner join coleta_autores as ca on (ca.id_producao = cp.id_producao and ca.tipo_vinculo = 3)
                                                inner join coleta_docentes as cd on (cd.id_pessoa = ca.id_pessoa and cp.ano = cd.ano and cd.tipo_categoria = 3)
                                                where item ilike '%%ISSN%%'
                                                group by cp.nome_producao, cp.ano, issn, p.nome_area_avaliacao
                                                order by cp.ano)

                                                select nome_producao, ano, qtotal.issn, nome_area_avaliacao, qualis from capes_qualis_periodicos as cqp
                                                inner join qtotal on (qtotal.issn = cqp.issn and trim(cqp.area) = trim(nome_area_avaliacao))
                                                group by nome_producao, ano, qtotal.issn, nome_area_avaliacao, qualis
                                                order by qualis ASC"""

        

        
        row = db.fetch_all(query, id=id, anoi=anoi, anof=anof)
        products = [dict(r) for r in row]

        row = db.fetch_all(query_artigos, id=id, anoi=anoi, anof=anof)
        artigos = [dict(r) for r in row]

        for art in artigos:
            art['duplicado'] = 0

        for art1 in artigos:
            if art1['duplicado'] == 0:
                for art2 in artigos:
                    if art2['duplicado'] == 0:
                        if art1 != art2:
                            similarity = jellyfish.jaro_winkler_similarity(art1['nome_producao'], art2['nome_producao'])
                            if similarity > 0.9 and (art1['ano'] == art2['ano'] and art1['issn'] == art2['issn']):
                                art1['duplicado'] = art2['duplicado'] = similarity

        lista_qualis = []

        for a in range(ultimo_ano_coleta+1, ultimo_ano_coleta+diferenca_anos+1):
            products_atual, artigos_lattes = self.retorna_contagem_de_qualis_do_lattes_anonimo(id, a, ultimo_ano_coleta)

            artigos.extend(artigos_lattes)

            if products_atual and len(products_atual) > 0:
                products.extend(products_atual)
        
        products = sorted(products, key=lambda k: k['ano'])

        if not listanegra:
            listanegra = []

            lista_qualis = products

        else:
            for prod in products:
                if prod['id_pessoa'] in permanentes[prod['ano']] and prod['id_pessoa'] not in listanegra:
                    lista_qualis.append(prod)

        artigos_total = {}
        for a in range(anoi, anof+1):
            artigos_total[a] = {'A1':0,'A2':0,'A3':0,'A4':0,'B1':0,'B2':0,'B3':0,'B4':0, 'C':0}

        for a in range(ultimo_ano_coleta+1, ultimo_ano_coleta+diferenca_anos+1):
            artigos_total[a] = {'A1':0,'A2':0,'A3':0,'A4':0,'B1':0,'B2':0,'B3':0,'B4':0, 'C':0}
        
        for l in  lista_qualis:
            for tipo in l.keys():
                if tipo != 'ano' and tipo != 'id_pessoa':
                    artigos_total[l['ano']][tipo] += l[tipo]
        
        return {'produtos': artigos_total, 'artigos': artigos}
  
    @tratamento_excecao_db_ppg()
    def retorna_contagem_de_indprodart_com_listanegra(self, id: str, anoi: int, anof: int, listanegra: List, db: DBConnector = None):
        """
        Retornar o quantitativo de indprodart por docente (id_pessoa) para que o filtro do simulador de parâmetros da página funcione

        Parametros:
            id(str): Id do PPG
            anoi(int): ano de início
            anof(int): ano de fim
            db(class): DataBase
        Returno:
            produtos(dicionario)
        """

    

        start_time = time.time()
        query = """select * from metricas_indicadores_areas_avaliacao
                    where nome_area_avaliacao = (select nome_area_avaliacao from programas where codigo_programa = %(id)s) 
                        and metrica = 'indprodart'"""
        row = db.fetch_one(query, id=id, anof=anof, anoi=anoi)
        if row:
            indicadores = dict(row)
        else:
            indicadores = {'mbom':0, 'bom':0,'regular':0, 'fraco':0}

        end_time = time.time()  # Tempo final
        print(f"Tempo metricas: {end_time - start_time} segundos")

        permanentes = {}

        start_time = time.time()
        ano_atual = datetime.now().year
        
        ultimo_ano_coleta = self.retorna_ultimo_ano_coleta()

        diferenca_anos = ano_atual - ultimo_ano_coleta
        
        for a in range(anoi, ultimo_ano_coleta+diferenca_anos+1):
            if a > ultimo_ano_coleta:
                lista_permanente = self.retorna_lista_de_permanentes_do_ppg(id, ultimo_ano_coleta, )
            else:
                lista_permanente = self.retorna_lista_de_permanentes_do_ppg(id, a, )
            if lista_permanente:
                permanentes[a] = eval(lista_permanente)

        end_time = time.time()  # Tempo final
        print(f"Tempo lista_permanentes: {end_time - start_time} segundos")
        
        
        if listanegra:
            query = """with qqualis as(
                                            with qtotal as (select cp.nome_producao, cd.id_pessoa, cp.ano, substring(cdp.valor,2,9) as issn, p.nome_area_avaliacao 
                                            from coleta_detalhamento_producao as cdp 
                                            inner join coleta_producoes as cp on (cdp.id_producao = cp.id_producao and cp.ano >= %(anoi)s and cp.ano <= %(anof)s and cp.id_sub_tipo_producao = 18)
                                            inner join programas as p on p.id_programa = cp.id_programa and p.codigo_programa = %(id)s
                                            inner join coleta_autores as ca on (ca.id_producao = cp.id_producao and ca.tipo_vinculo = 3)
                                            inner join coleta_docentes as cd on (cd.id_pessoa = ca.id_pessoa and cp.ano = cd.ano and cd.tipo_categoria = 3)
                                            where item ilike '%%ISSN%%'
                                            group by cp.nome_producao, cd.id_pessoa, cp.ano, issn, p.nome_area_avaliacao
                                            order by cp.ano)

                                            select nome_producao, id_pessoa, ano, qtotal.issn, nome_area_avaliacao, qualis from capes_qualis_periodicos as cqp
                                            inner join qtotal on (qtotal.issn = cqp.issn and trim(cqp.area) = trim(nome_area_avaliacao))
                                            group by nome_producao, id_pessoa, ano, qtotal.issn, nome_area_avaliacao, qualis
                                            order by qualis ASC)

                                            select ano, id_pessoa, SUM(CASE WHEN qualis = 'A1' THEN 1 ELSE 0 END) AS "A1",
                                                                                    SUM(CASE WHEN qualis = 'A2' THEN 1 ELSE 0 END) AS "A2",
                                                                                    SUM(CASE WHEN qualis = 'A3' THEN 1 ELSE 0 END) AS "A3",
                                                                                    SUM(CASE WHEN qualis = 'A4' THEN 1 ELSE 0 END) AS "A4",
                                                                                    SUM(CASE WHEN qualis = 'B1' THEN 1 ELSE 0 END) AS "B1",
                                                                                    SUM(CASE WHEN qualis = 'B2' THEN 1 ELSE 0 END) AS "B2",
                                                                                    SUM(CASE WHEN qualis = 'B3' THEN 1 ELSE 0 END) AS "B3",
                                                                                    SUM(CASE WHEN qualis = 'B4' THEN 1 ELSE 0 END) AS "B4",
                                                                                    SUM(CASE WHEN qualis = 'C' THEN 1 ELSE 0 END) AS "C"
                                            from qqualis
                                            group by ano, id_pessoa
                                            order by ano"""
        else:
            query = """with qqualis as(
                                            with qtotal as (select cp.nome_producao, cp.ano, substring(cdp.valor,2,9) as issn, p.nome_area_avaliacao 
                                            from coleta_detalhamento_producao as cdp 
                                            inner join coleta_producoes as cp on (cdp.id_producao = cp.id_producao and cp.ano >= %(anoi)s and cp.ano <= %(anof)s and cp.id_sub_tipo_producao = 18)
                                            inner join programas as p on p.id_programa = cp.id_programa and p.codigo_programa = %(id)s
                                            inner join coleta_autores as ca on (ca.id_producao = cp.id_producao and ca.tipo_vinculo = 3)
                                            inner join coleta_docentes as cd on (cd.id_pessoa = ca.id_pessoa and cp.ano = cd.ano and cd.tipo_categoria = 3)
                                            where item ilike '%%ISSN%%'
                                            group by cp.nome_producao, cp.ano, issn, p.nome_area_avaliacao
                                            order by cp.ano)

                                            select nome_producao, ano, qtotal.issn, nome_area_avaliacao, qualis from capes_qualis_periodicos as cqp
                                            inner join qtotal on (qtotal.issn = cqp.issn and trim(cqp.area) = trim(nome_area_avaliacao))
                                            group by nome_producao, ano, qtotal.issn, nome_area_avaliacao, qualis
                                            order by qualis ASC)

                                            select ano, SUM(CASE WHEN qualis = 'A1' THEN 1 ELSE 0 END) AS "A1",
                                                                                    SUM(CASE WHEN qualis = 'A2' THEN 1 ELSE 0 END) AS "A2",
                                                                                    SUM(CASE WHEN qualis = 'A3' THEN 1 ELSE 0 END) AS "A3",
                                                                                    SUM(CASE WHEN qualis = 'A4' THEN 1 ELSE 0 END) AS "A4",
                                                                                    SUM(CASE WHEN qualis = 'B1' THEN 1 ELSE 0 END) AS "B1",
                                                                                    SUM(CASE WHEN qualis = 'B2' THEN 1 ELSE 0 END) AS "B2",
                                                                                    SUM(CASE WHEN qualis = 'B3' THEN 1 ELSE 0 END) AS "B3",
                                                                                    SUM(CASE WHEN qualis = 'B4' THEN 1 ELSE 0 END) AS "B4",
                                                                                    SUM(CASE WHEN qualis = 'C' THEN 1 ELSE 0 END) AS "C"
                                            from qqualis
                                            group by ano
                                            order by ano"""

        start_time = time.time()
        row = db.fetch_all(query, id=id, anoi=anoi, anof=anof)
        products = [dict(r) for r in row]
        end_time = time.time()  # Tempo final
        print(f"Tempo 1: {end_time - start_time} segundos")

        lista_qualis = []

        indprods = {}
        for a in range(anoi, anof+1):
            indprods[a] = 0.0

        start_time = time.time()
        # adiciona resultado do ano atual com os dados do lattes
        for a in range(ultimo_ano_coleta+1, ultimo_ano_coleta+diferenca_anos+1):
            products_atual = self.retorna_contagem_de_qualis_do_lattes(id, a, ultimo_ano_coleta)

            if products_atual and len(products_atual) > 0:
                products.extend(products_atual)
        end_time = time.time()  # Tempo final
        print(f"Tempo 2: {end_time - start_time} segundos")
        
        start_time = time.time()
        products = sorted(products, key=lambda k: k['ano'])

        if not listanegra:
            listanegra = []

            lista_qualis = products
            
        else:
            for prod in products:
                if prod['id_pessoa'] in permanentes[prod['ano']] and prod['id_pessoa'] not in listanegra:
                    lista_qualis.append(prod)

        end_time = time.time()  # Tempo final
        print(f"Tempo 3: {end_time - start_time} segundos")

        start_time = time.time()
        artigos_total = {}
        for a in range(anoi, anof+1):
            artigos_total[a] = {'A1':0,'A2':0,'A3':0,'A4':0,'B1':0,'B2':0,'B3':0,'B4':0, 'C':0}

        for a in range(ultimo_ano_coleta+1, ultimo_ano_coleta+diferenca_anos+1):
            artigos_total[a] = {'A1':0,'A2':0,'A3':0,'A4':0,'B1':0,'B2':0,'B3':0,'B4':0, 'C':0}

        for l in  lista_qualis:
            for tipo in l.keys():
                if tipo != 'ano' and tipo != 'id_pessoa':
                    artigos_total[l['ano']][tipo] += l[tipo]

        end_time = time.time()  # Tempo final
        print(f"Tempo 4: {end_time - start_time} segundos")

        start_time = time.time()
        qarea = """select pesos.* from pesos_indart_areas_avaliacao as pesos
                    inner join programas as p on p.nome_area_avaliacao = pesos.nome_area_avaliacao 
                    where p.codigo_programa = %(id)s"""
        
        area = db.fetch_one(qarea, id=id)

        end_time = time.time()  # Tempo final
        print(f"Tempo 5: {end_time - start_time} segundos")

        retorno = {}
        formula = None

        start_time = time.time()
        if area:
            contagem_permanentes = {}
            for ano,qualis in artigos_total.items():
                indProdArt, formula = utils.calcula_indprod(id,qualis,db)
                indprods[int(ano)] = indProdArt/len(permanentes[ano])
                contagem_permanentes[int(ano)] = len(permanentes[ano])

            indprods_ext = self.retorna_indprods_medios_extratificados(id, anoi, anof)

            retorno = {'indprods': indprods, 'permanentes': contagem_permanentes, 'formula': formula}

            retorno.update(indprods_ext)

        end_time = time.time()  # Tempo final
        print(f"Tempo 6: {end_time - start_time} segundos")

        return {'indprod':retorno, 'indicadores':indicadores}
    
    @tratamento_excecao_db_ppg()
    def retorna_indprods_medios_extratificados(self, id: str, anoi: int, anof: int, db: DBConnector = None):
        """
        IndProds extratificados

        Parameters:
            id(str): Id of PPG
            anoi(int): Year of Start
            anof(int): Year of End
            db(class): DataBase
        Results:
            indprods(list of dictionarys):
                indprod(float): Average Indprod of PPG
                ano(int): Year
        """

        rotulos = []

        dictindprods = {}

        query = """select cast(max(conceito) as integer) as conceito from programas as p
			where
                    p.situacao ilike '%%FUNCIONAMENTO%%' and 
					p.modalidade = (select modalidade from programas where codigo_programa = %(id)s) and
                    p.nome_area_avaliacao = (select nome_area_avaliacao from programas where codigo_programa = %(id)s)
					and conceito <> 'A'"""

        row = db.fetch_one(query, id=id)
        nota_maxima = 7
        if row:
            nota_maxima = row[0]

        query = """select conceito from programas where codigo_programa = %(id)s"""

        row = db.fetch_one(query, id=id)
        conceito = 3
        if row and row[0] != 'A':
            conceito = row[0]

        dictindprods['conceito'] = conceito
        

        query = """select avg(cast(dados->>'indProd' as float)) as indProdAll, pb.ano, avg(cast(dados->>'quantidade_permanentes' as float)) as permanentes
                    from programas as p
                    inner join programas_historico as pb on (p.id_programa=pb.id_programa) where
                    p.situacao ilike '%%FUNCIONAMENTO%%' and 
					p.modalidade = (select modalidade from programas where codigo_programa = %(id)s) and
					p.conceito = %(nota)s and
                    p.nome_area_avaliacao = (select nome_area_avaliacao from programas where codigo_programa = %(id)s)
                    and pb.ano >= %(anoi)s and pb.ano <= %(anof)s and p.codigo_programa <> %(id)s group by pb.ano order by pb.ano
				"""

        # query = """select avg(cast(dados->>'indProd' as float)) as indProdAll, 
        #                    pb.ano
        #             from programas as p
        #             inner join programas_historico as pb on (p.id=pb.id) where
        #             p.situacao ilike '%%FUNCIONAMENTO%%' and p.modalidade = (select modalidade from programas where id = %(id)s) and
        #             p.nota = (select nota from programas where id = %(id)s) and
        #             p.nm_area_avaliacao = (select nm_area_avaliacao from programas where id = %(id)s)
        #             and pb.ano >=%(anoi)s and pb.ano <= %(anof)s and p.id <> %(id)s group by pb.ano order by pb.ano"""
        dictindprods['dados'] = []
        for i in range(3, nota_maxima+1):
            row = db.fetch_all(query, id=id, anof=anof, anoi=anoi, nota=str(i))
            indprods = [dict(r) | {'conceito': str(i)} for r in row]
            dictindprods[str(i)] = indprods
            dictindprods['dados'].extend(indprods)
            rotulos.append(str(i))

        dictindprods['maxima'] = str(nota_maxima)

        query = """select avg(cast(dados->>'indProd' as float)) as indProdAll, pb.ano, avg(cast(dados->>'quantidade_permanentes' as float)) as permanentes
                    from programas as p
                    inner join programas_historico as pb on (p.id_programa=pb.id_programa) where
                    p.situacao ilike '%%FUNCIONAMENTO%%' and 
					p.modalidade = (select modalidade from programas where codigo_programa = %(id)s) and
                    p.nome_area_avaliacao = (select nome_area_avaliacao from programas where codigo_programa = %(id)s)
                    and pb.ano >= %(anoi)s and pb.ano <= %(anof)s and p.codigo_programa <> %(id)s group by pb.ano order by pb.ano
				"""

        row = db.fetch_all(query, id=id, anof=anof, anoi=anoi)
        indprods = [dict(r) for r in row]
        dictindprods['país'] = indprods
        rotulos.append('país')

        query = """select avg(cast(dados->>'indProd' as float)) as indProdAll, pb.ano, avg(cast(dados->>'quantidade_permanentes' as float)) as permanentes
                    from programas as p
                    inner join programas_historico as pb on (p.id_programa=pb.id_programa) where
                    p.situacao ilike '%%FUNCIONAMENTO%%' and 
                    p.nome_regiao = (select nome_regiao from programas where codigo_programa = %(id)s) and
					p.modalidade = (select modalidade from programas where codigo_programa = %(id)s) and
                    p.nome_area_avaliacao = (select nome_area_avaliacao from programas where codigo_programa = %(id)s)
                    and pb.ano >= %(anoi)s and pb.ano <= %(anof)s and p.codigo_programa <> %(id)s group by pb.ano order by pb.ano
				"""

        row = db.fetch_all(query, id=id, anof=anof, anoi=anoi)
        indprods = [dict(r) for r in row]
        dictindprods['região'] = indprods
        rotulos.append('região')

        query = """select nome_regiao from programas where codigo_programa = %(id)s"""

        row = db.fetch_one(query, id=id)
        if row:
            nome_regiao = row[0]
            dictindprods['nome_regiao'] = nome_regiao

        query = """select avg(cast(dados->>'indProd' as float)) as indProdAll, pb.ano, avg(cast(dados->>'quantidade_permanentes' as float)) as permanentes
                    from programas as p
                    inner join programas_historico as pb on (p.id_programa=pb.id_programa) where
                    p.situacao ilike '%%FUNCIONAMENTO%%' and 
                    p.sigla_uf = (select sigla_uf from programas where codigo_programa = %(id)s) and
					p.modalidade = (select modalidade from programas where codigo_programa = %(id)s) and
                    p.nome_area_avaliacao = (select nome_area_avaliacao from programas where codigo_programa = %(id)s)
                    and pb.ano >= %(anoi)s and pb.ano <= %(anof)s and p.codigo_programa <> %(id)s group by pb.ano order by pb.ano
				"""

        row = db.fetch_all(query, id=id, anof=anof, anoi=anoi)
        indprods = [dict(r) for r in row]
        dictindprods['uf'] = indprods

        query = """select sigla_uf from programas where codigo_programa = %(id)s"""

        row = db.fetch_one(query, id=id)
        if row:
            uf = row[0]
            dictindprods['nome_uf'] = uf

        dictindprods['rotulos'] = rotulos
        return dictindprods
    
    @tratamento_excecao_db_ppg()
    def retorna_contagem_de_qualis_discentes(self, id: str, anoi: int, anof: int, db: DBConnector = None):
        """
        Retornar o quantitativo de artigos com qualis por discente (id_pessoa) para que o filtro do simulador de parâmetros da página funcione

        Parametros:
            id(str): Id do PPG
            anoi(int): ano de início
            anof(int): ano de fim
            db(class): DataBase
        Returno:
            produtos(dicionario)
        """
        query = """with qqualis as(
                                            with qtotal as (select cp.nome_producao, cp.ano, substring(cdp.valor,2,9) as issn, p.nome_area_avaliacao 
                                            from coleta_detalhamento_producao as cdp 
                                            inner join coleta_producoes as cp on (cdp.id_producao = cp.id_producao and cp.ano >= %(anoi)s and cp.ano <= %(anof)s and cp.id_sub_tipo_producao = 18)
                                            inner join programas as p on p.id_programa = cp.id_programa and p.codigo_programa = %(id)s
                                            inner join coleta_autores as ca on (ca.id_producao = cp.id_producao and (ca.tipo_vinculo = 1 or ca.tipo_vinculo = 4))
                                            inner join coleta_discentes as cd on (cd.id_pessoa = ca.id_pessoa and cp.ano = cd.ano and cd.situacao_discente != 9 and cd.situacao_discente != 11)
                                            where item ilike '%%ISSN%%'
                                            group by cp.nome_producao, cp.ano, issn, p.nome_area_avaliacao
                                            order by cp.ano)

                                            select nome_producao, ano, qtotal.issn, nome_area_avaliacao, qualis from capes_qualis_periodicos as cqp
                                            inner join qtotal on (qtotal.issn = cqp.issn and trim(cqp.area) = trim(nome_area_avaliacao))
                                            group by nome_producao, ano, qtotal.issn, nome_area_avaliacao, qualis
                                            order by qualis ASC)

                                            select ano, SUM(CASE WHEN qualis = 'A1' THEN 1 ELSE 0 END) AS "A1",
                                                                                    SUM(CASE WHEN qualis = 'A2' THEN 1 ELSE 0 END) AS "A2",
                                                                                    SUM(CASE WHEN qualis = 'A3' THEN 1 ELSE 0 END) AS "A3",
                                                                                    SUM(CASE WHEN qualis = 'A4' THEN 1 ELSE 0 END) AS "A4",
                                                                                    SUM(CASE WHEN qualis = 'B1' THEN 1 ELSE 0 END) AS "B1",
                                                                                    SUM(CASE WHEN qualis = 'B2' THEN 1 ELSE 0 END) AS "B2",
                                                                                    SUM(CASE WHEN qualis = 'B3' THEN 1 ELSE 0 END) AS "B3",
                                                                                    SUM(CASE WHEN qualis = 'B4' THEN 1 ELSE 0 END) AS "B4",
                                                                                    SUM(CASE WHEN qualis = 'C' THEN 1 ELSE 0 END) AS "C"
                                            from qqualis
                                            group by ano
                                            order by ano"""

        
        row = db.fetch_all(query, id=id, anoi=anoi, anof=anof)
        products = [dict(r) for r in row]

    
        products = sorted(products, key=lambda k: k['ano'])

        lista_qualis = []
        
        for prod in products:
            lista_qualis.append(prod)

        artigos_total = {}
        for a in range(anoi, anof+1):
            artigos_total[a] = {'A1':0,'A2':0,'A3':0,'A4':0,'B1':0,'B2':0,'B3':0,'B4':0, 'C':0}
        
        for l in  lista_qualis:
            for tipo in l.keys():
                if tipo != 'ano' and tipo != 'id_pessoa':
                    artigos_total[l['ano']][tipo] += l[tipo]
        
        
        return {'produtos': artigos_total}

    @tratamento_excecao_db_ppg()
    def retorna_estatisticas_de_artigos(self, id: str, anoi: int, anof: int, db: DBConnector = None):
        """
        Retornar algumas estatísticas sobre autores dos artigos

        Parametros:
            id(str): Id do PPG
            anoi(int): ano de início
            anof(int): ano de fim
            db(class): DataBase
        Retorno:
            (dicionario)
        """

               
        
        query = """with qtotal as (select cp.id_programa, cp.id_producao, cp.ano, substring(cdp.valor,2,9) as issn, p.nome_area_avaliacao,
                        STRING_AGG(distinct ca.id_pessoa, ',') as pessoas
                    from coleta_detalhamento_producao as cdp 
                    inner join coleta_producoes as cp on (cdp.id_producao = cp.id_producao and cp.ano >= %(anoi)s and cp.ano <= %(anof)s and cp.id_sub_tipo_producao = 18)
                    inner join programas as p on p.id_programa = cp.id_programa and p.codigo_programa = %(id)s
                    inner join coleta_autores as ca on (ca.id_producao = cp.id_producao)
                    where item ilike '%%ISSN%%'
                    group by cp.id_programa, cp.id_producao, cp.ano, issn, p.nome_area_avaliacao
                    order by cp.ano)

                    select qtotal.id_programa, qtotal.id_producao, ano, qualis, qtotal.pessoas from capes_qualis_periodicos as cqp
                    inner join qtotal on (qtotal.issn = cqp.issn and trim(cqp.area) = trim(nome_area_avaliacao))
                    group by qtotal.id_programa, qtotal.id_producao, ano, qualis, qtotal.pessoas
                    order by qualis ASC"""

        
        rows = db.fetch_all(query, id=id, anoi=anoi, anof=anof)
        products = [dict(r) for r in rows]

        conta = {}
        conta['total'] = len(products)
        conta['DiscentesA4+'] = 0
        conta['DiscentesB4+'] = 0
        conta['EgressosA4+'] = 0
        conta['EgressosB4+'] = 0
        conta['ArtigosDocentesSemCoautoria'] = 0
        conta['ArtigosDocentesComCoautoria'] = 0
        conta['ArtigosDocentesNãoPermanentes'] = 0
        conta['ArtigosPosDocs'] = 0
        conta['ArtigosExternos'] = 0

        conta['qualis_discente'] = {'A1':0,'A2':0,'A3':0,'A4':0,'B1':0,'B2':0,'B3':0,'B4':0, 'C':0}

        for prod in products:
            pessoas = prod['pessoas'].split(',')
            flags = {'permanente':0, 'discente':0, 'egresso':0, 'nao_permanente':0, 'pos_doc': 0, 'externo': 0}
            for pessoa in pessoas:
                vinculo = db.fetch_one('''select tipo_vinculo from coleta_autores 
                                          where id_programa = %(id_prog)s and id_pessoa = %(id_pessoa)s and id_producao=%(id_prod)s''',
                                          id_prog=prod['id_programa'], id_pessoa=pessoa, id_prod=prod['id_producao'])
                if vinculo:
                    match vinculo[0]:
                        case 1:
                            flags['discente'] += 1
                            if flags['discente'] == 1:
                                conta['qualis_discente'][prod['qualis']] += 1

                        case 2:
                            flags['externo'] += 1

                        case 3:
                            tipo_docente = db.fetch_one('''select tipo_categoria from coleta_docentes 
                                                        where id_programa = %(id_prog)s and id_pessoa = %(id_pessoa)s and ano = %(ano)s''', 
                                                        id_prog=prod['id_programa'], id_pessoa=pessoa, ano=prod['ano'])
                            if tipo_docente:
                                if tipo_docente[0] == 3:
                                    flags['permanente'] += 1
                                else:
                                    flags['nao_permanente'] += 1

                        case 4:
                            flags['egresso'] += 1

                        case 5:
                            flags['pos_doc'] += 1
                
            if flags['permanente'] == 1:
                conta['ArtigosDocentesSemCoautoria'] += 1
            elif flags['permanente'] > 1:
                conta['ArtigosDocentesComCoautoria'] += 1
            
            if flags['nao_permanente'] > 0:
                conta['ArtigosDocentesNãoPermanentes'] += 1

            if flags['externo'] > 0:
                conta['ArtigosExternos'] += 1

            if flags['pos_doc'] > 0:
                conta['ArtigosPosDocs'] += 1

            if flags['discente'] and (prod['qualis'] >= 'A1' and prod['qualis'] <= 'A4'):
                conta['DiscentesA4+'] += 1
            elif flags['discente'] and (prod['qualis'] >= 'B1' and prod['qualis'] <= 'B4'):
                conta['DiscentesB4+'] += 1
            elif flags['egresso'] and (prod['qualis'] >= 'A1' and prod['qualis'] <= 'A4'):
                conta['EgressosA4+'] += 1
            elif flags['egresso'] and (prod['qualis'] >= 'B1' and prod['qualis'] <= 'B4'):
                conta['EgressosB4+'] += 1
        
        
        return conta
    
    @tratamento_excecao_db_ppg()
    def retorna_lista_de_programas_correlatos(self, id: str, db: DBConnector = None):
        # print("Id do ppg que está sendo consultado na função retorna_lista_de_programas_correlatos", id)
        query = """with ppg as (
                        select codigo_programa, conceito, nome_area_avaliacao, modalidade from programas 
                        where codigo_programa = %(id)s
                        )
                    select p.codigo_programa from programas as p
                        inner join ppg on ppg.conceito = p.conceito 
                        and ppg.modalidade = p.modalidade 
                        and ppg.nome_area_avaliacao = p.nome_area_avaliacao
                        and ppg.codigo_programa != p.codigo_programa
                    where p.situacao ilike 'em funcionamento'"""
        # print(query)
        rows = db.fetch_all(query, id=id)
        
        return [r[0] for r in rows]

    
    @tratamento_excecao_db_ppg()
    def retorna_estatisticas_de_artigos_ppgs_correlatos(self, id: str, anoi: int, anof: int, db: DBConnector = None):
        """
        Retornar estatísticas médias sobre autores dos artigos de programas de mesma area, nota e modalidade do ppg alvo

        Parametros:
            id(str): Id do PPG alvo
            anoi(int): ano de início
            anof(int): ano de fim
            db(class): DataBase
        Retorno:
            (dicionario)
        """

        ppgs = self.retorna_lista_de_programas_correlatos(id)

        estatisticas = []

        for ppg in ppgs:
            ret = self.retorna_estatisticas_de_artigos(ppg, anoi, anof)
            estatisticas.append(ret)


        medias = {}
        medias['DiscentesA4+'] = 0
        medias['DiscentesB4+'] = 0
        medias['EgressosA4+'] = 0
        medias['EgressosB4+'] = 0
        medias['ArtigosDocentesSemCoautoria'] = 0
        medias['ArtigosDocentesComCoautoria'] = 0
        medias['ArtigosDocentesNãoPermanentes'] = 0
        medias['ArtigosPosDocs'] = 0
        medias['ArtigosExternos'] = 0

        for items in estatisticas:
            if items['total'] > 0:
                medias['DiscentesA4+'] += items['DiscentesA4+']*100/items['total']
                medias['DiscentesB4+'] += items['DiscentesB4+']*100/items['total']
                medias['EgressosA4+'] += items['EgressosA4+']*100/items['total']
                medias['EgressosB4+'] += items['EgressosB4+']*100/items['total']
                medias['ArtigosDocentesSemCoautoria'] += items['ArtigosDocentesSemCoautoria']*100/items['total']
                medias['ArtigosDocentesComCoautoria'] += items['ArtigosDocentesComCoautoria']*100/items['total']
                medias['ArtigosDocentesNãoPermanentes'] += items['ArtigosDocentesNãoPermanentes']*100/items['total']
                medias['ArtigosPosDocs'] += items['ArtigosPosDocs']*100/items['total']
                medias['ArtigosExternos'] += items['ArtigosExternos']*100/items['total']

        if len(estatisticas) > 0:
            medias['DiscentesA4+'] /= len(estatisticas)
            medias['DiscentesB4+'] /= len(estatisticas)
            medias['EgressosA4+'] /= len(estatisticas)
            medias['EgressosB4+'] /= len(estatisticas)
            medias['ArtigosDocentesSemCoautoria'] /= len(estatisticas)
            medias['ArtigosDocentesComCoautoria'] /= len(estatisticas)
            medias['ArtigosDocentesNãoPermanentes'] /= len(estatisticas)
            medias['ArtigosPosDocs'] /= len(estatisticas)
            medias['ArtigosExternos'] /= len(estatisticas)

        return medias

    @tratamento_excecao_db_ppg()
    def retorna_indprods_medios_extratificados_sem_dps(self, id: str, anoi: int, anof: int, db: DBConnector = None):
        """
        IndProds extratificados. Se diferencia do retorna_indprods_medios_extratificados no retorno de cada consulta 
        porque não consideram o indProd ponderado pela quantidade de docentes permanentes:

        avg(cast(dados->>'indProd' as float) * cast(dados->>'quantidade_permanentes' as float))

        Parameters:
            id(str): Id of PPG
            anoi(int): Year of Start
            anof(int): Year of End
            db(class): DataBase
        Results:
            indprods(list of dictionarys):
                indprod(float): Average Indprod of PPG
                ano(int): Year
        """

        rotulos = []

        dictindprods = {}

        query = """select cast(max(conceito) as integer) as conceito from programas as p
			where
                    p.situacao ilike '%%FUNCIONAMENTO%%' and 
					p.modalidade = (select modalidade from programas where codigo_programa = %(id)s) and
                    p.nome_area_avaliacao = (select nome_area_avaliacao from programas where codigo_programa = %(id)s)
					and conceito <> 'A'"""

        row = db.fetch_one(query, id=id)
        nota_maxima = 7
        if row:
            nota_maxima = row[0]

        query = """select conceito from programas where codigo_programa = %(id)s"""

        row = db.fetch_one(query, id=id)
        conceito = 3
        if row:
            conceito = row[0]

        dictindprods['conceito'] = conceito
        

        query = """select avg(cast(dados->>'indProd' as float) * cast(dados->>'quantidade_permanentes' as float)) as indProdAll, pb.ano, avg(cast(dados->>'quantidade_permanentes' as float)) as permanentes
                    from programas as p
                    inner join programas_historico as pb on (p.id_programa=pb.id_programa) where
                    p.situacao ilike '%%FUNCIONAMENTO%%' and 
					p.modalidade = (select modalidade from programas where codigo_programa = %(id)s) and
					p.conceito = %(nota)s and
                    p.nome_area_avaliacao = (select nome_area_avaliacao from programas where codigo_programa = %(id)s)
                    and pb.ano >= %(anoi)s and pb.ano <= %(anof)s and p.codigo_programa <> %(id)s group by pb.ano order by pb.ano
				"""
        
        for i in range(3, nota_maxima+1):
            row = db.fetch_all(query, id=id, anof=anof, anoi=anoi, nota=str(i))
            indprods = [dict(r) for r in row]
            dictindprods[str(i)] = indprods
            rotulos.append(str(i))

        dictindprods['maxima'] = str(nota_maxima)

        query = """select avg(cast(dados->>'indProd' as float) * cast(dados->>'quantidade_permanentes' as float)) as indProdAll, pb.ano, avg(cast(dados->>'quantidade_permanentes' as float)) as permanentes
                    from programas as p
                    inner join programas_historico as pb on (p.id_programa=pb.id_programa) where
                    p.situacao ilike '%%FUNCIONAMENTO%%' and 
					p.modalidade = (select modalidade from programas where codigo_programa = %(id)s) and
                    p.nome_area_avaliacao = (select nome_area_avaliacao from programas where codigo_programa = %(id)s)
                    and pb.ano >= %(anoi)s and pb.ano <= %(anof)s and p.codigo_programa <> %(id)s group by pb.ano order by pb.ano
				"""

        row = db.fetch_all(query, id=id, anof=anof, anoi=anoi)
        indprods = [dict(r) for r in row]
        dictindprods['país'] = indprods
        rotulos.append('país')

        query = """select avg(cast(dados->>'indProd' as float) * cast(dados->>'quantidade_permanentes' as float)) as indProdAll, pb.ano, avg(cast(dados->>'quantidade_permanentes' as float)) as permanentes
                    from programas as p
                    inner join programas_historico as pb on (p.id_programa=pb.id_programa) where
                    p.situacao ilike '%%FUNCIONAMENTO%%' and 
                    p.nome_regiao = (select nome_regiao from programas where codigo_programa = %(id)s) and
					p.modalidade = (select modalidade from programas where codigo_programa = %(id)s) and
                    p.nome_area_avaliacao = (select nome_area_avaliacao from programas where codigo_programa = %(id)s)
                    and pb.ano >= %(anoi)s and pb.ano <= %(anof)s and p.codigo_programa <> %(id)s group by pb.ano order by pb.ano
				"""

        row = db.fetch_all(query, id=id, anof=anof, anoi=anoi)
        indprods = [dict(r) for r in row]
        dictindprods['região'] = indprods
        rotulos.append('região')

        query = """select nome_regiao from programas where codigo_programa = %(id)s"""

        row = db.fetch_one(query, id=id)
        if row:
            nome_regiao = row[0]
            dictindprods['nome_regiao'] = nome_regiao

        query = """select avg(cast(dados->>'indProd' as float) * cast(dados->>'quantidade_permanentes' as float)) as indProdAll, pb.ano, avg(cast(dados->>'quantidade_permanentes' as float)) as permanentes
                    from programas as p
                    inner join programas_historico as pb on (p.id_programa=pb.id_programa) where
                    p.situacao ilike '%%FUNCIONAMENTO%%' and 
                    p.sigla_uf = (select sigla_uf from programas where codigo_programa = %(id)s) and
					p.modalidade = (select modalidade from programas where codigo_programa = %(id)s) and
                    p.nome_area_avaliacao = (select nome_area_avaliacao from programas where codigo_programa = %(id)s)
                    and pb.ano >= %(anoi)s and pb.ano <= %(anof)s and p.codigo_programa <> %(id)s group by pb.ano order by pb.ano
				"""

        row = db.fetch_all(query, id=id, anof=anof, anoi=anoi)
        indprods = [dict(r) for r in row]
        dictindprods['uf'] = indprods

        query = """select sigla_uf from programas where codigo_programa = %(id)s"""

        row = db.fetch_one(query, id=id)
        if row:
            uf = row[0]
            dictindprods['nome_uf'] = uf

        dictindprods['rotulos'] = rotulos
        return dictindprods
    

    @tratamento_excecao_db_ppg()
    def retorna_contagem_de_indprodart_absoluto(self, id: str, anoi: int, anof: int, db: DBConnector = None):
        """
        Retornar o quantitativo de indprodart abosulto

        Parametros:
            id(str): Id do PPG
            anoi(int): ano de início
            anof(int): ano de fim
            db(class): DataBase
        Returno:
            produtos(dicionario)
        """
        # print("Parametros: ", id, anoi, anof)
        permanentes = {}

        ultimo_ano_coleta = self.retorna_ultimo_ano_coleta() + 1
        
        for a in range(anoi, ultimo_ano_coleta+1):
            if a == ultimo_ano_coleta:
                lista_permanente = self.retorna_lista_de_permanentes_do_ppg(id, a-1, )
            else:
                lista_permanente = self.retorna_lista_de_permanentes_do_ppg(id, a, )
            if lista_permanente:
                permanentes[a] = eval(lista_permanente)
        
        
        query = """with qqualis as(
                                             with qtotal as (select cp.nome_producao, cd.id_pessoa, cp.ano, substring(cdp.valor,2,9) as issn, p.nome_area_avaliacao 
                                             from coleta_detalhamento_producao as cdp 
                                             inner join coleta_producoes as cp on (cdp.id_producao = cp.id_producao and cp.ano >= %(anoi)s and cp.ano <= %(anof)s and cp.id_sub_tipo_producao = 18)
                                             inner join programas as p on p.id_programa = cp.id_programa and p.codigo_programa = %(id)s
                                             inner join coleta_autores as ca on (ca.id_producao = cp.id_producao and ca.tipo_vinculo = 3)
                                             inner join coleta_docentes as cd on (cd.id_pessoa = ca.id_pessoa and cp.ano = cd.ano and cd.tipo_categoria = 3)
                                             where item ilike '%%ISSN%%'
                                             group by cp.nome_producao, cd.id_pessoa, cp.ano, issn, p.nome_area_avaliacao
                                            order by cp.ano)

                                             select nome_producao, id_pessoa, ano, qtotal.issn, nome_area_avaliacao, qualis from capes_qualis_periodicos as cqp
                                             inner join qtotal on (qtotal.issn = cqp.issn and trim(cqp.area) = trim(nome_area_avaliacao))
                                             group by nome_producao, id_pessoa, ano, qtotal.issn, nome_area_avaliacao, qualis
                                             order by qualis ASC)

                                              select ano, id_pessoa, SUM(CASE WHEN qualis = 'A1' THEN 1 ELSE 0 END) AS "A1",
                                                                                     SUM(CASE WHEN qualis = 'A2' THEN 1 ELSE 0 END) AS "A2",
                                                                                     SUM(CASE WHEN qualis = 'A3' THEN 1 ELSE 0 END) AS "A3",
                                                                                     SUM(CASE WHEN qualis = 'A4' THEN 1 ELSE 0 END) AS "A4",
                                                                                     SUM(CASE WHEN qualis = 'B1' THEN 1 ELSE 0 END) AS "B1",
                                                                                     SUM(CASE WHEN qualis = 'B2' THEN 1 ELSE 0 END) AS "B2",
                                                                                     SUM(CASE WHEN qualis = 'B3' THEN 1 ELSE 0 END) AS "B3",
                                                                                     SUM(CASE WHEN qualis = 'B4' THEN 1 ELSE 0 END) AS "B4",
                                                                                     SUM(CASE WHEN qualis = 'C' THEN 1 ELSE 0 END) AS "C"
                                             from qqualis
											 group by ano, id_pessoa
											 order by ano"""

        # print("Query retorna_contagem_de_indprodart_absoluto: ", query)
        
        row = db.fetch_all(query, id=id, anoi=anoi, anof=anof)
        products = [dict(r) for r in row]

        lista_qualis = []

        indprods = {}
        for a in range(anoi, anof+1):
            indprods[a] = 0.0
        
        products_atual = self.retorna_contagem_de_qualis_do_lattes(id, anof, ultimo_ano_coleta)

        if products_atual and len(products_atual) > 0:
           products.extend(products_atual)
        
        products = sorted(products, key=lambda k: k['ano'])

            
        for prod in products:
            if prod['id_pessoa'] in permanentes[prod['ano']]:
                lista_qualis.append(prod)

        artigos_total = {}
        for a in range(anoi, anof+1):
            artigos_total[a] = {'A1':0,'A2':0,'A3':0,'A4':0,'B1':0,'B2':0,'B3':0,'B4':0, 'C':0}

        artigos_total[ultimo_ano_coleta] = {'A1':0,'A2':0,'A3':0,'A4':0,'B1':0,'B2':0,'B3':0,'B4':0, 'C':0}

        for l in  lista_qualis:
            for tipo in l.keys():
                if tipo != 'ano' and tipo != 'id_pessoa':
                    artigos_total[l['ano']][tipo] += l[tipo]

        
        qarea = """select pesos.* from pesos_indart_areas_avaliacao as pesos
                    inner join programas as p on p.nome_area_avaliacao = pesos.nome_area_avaliacao 
                    where p.codigo_programa = %(id)s"""
        
        area = db.fetch_one(qarea, id=id)

        retorno = {}

        if area:
            contagem_permanentes = {}
            for ano,qualis in artigos_total.items():
                indProdArt, formula = utils.calcula_indprod(id,qualis,db)
                indprods[int(ano)] = indProdArt
                contagem_permanentes[int(ano)] = len(permanentes[ano])

            indprods_ext = self.retorna_indprods_medios_extratificados_sem_dps(id, anoi, anof)

            retorno = {'indprods': indprods, 'permanentes': contagem_permanentes, 'formula': formula}

            retorno.update(indprods_ext)


        return {'indprod':retorno}

    @tratamento_excecao_db_ppg()
    def retorna_indprods_extsup_medios_extratificados(self, id: str, anoi: int, anof: int, db: DBConnector = None):
        """
        IndProds ExtSup extratificados

        Parameters:
            id(str): Id of PPG
            anoi(int): Year of Start
            anof(int): Year of End
            db(class): DataBase
        Results:
            indprods(list of dictionarys):
                indprod(float): Average Indprod of PPG
                ano(int): Year
        """

        rotulos = []

        dictindprods = {}

        query = """select cast(max(conceito) as integer) as conceito from programas as p
			where
                    p.situacao ilike '%%FUNCIONAMENTO%%' and 
					p.modalidade = (select modalidade from programas where codigo_programa = %(id)s) and
                    p.nome_area_avaliacao = (select nome_area_avaliacao from programas where codigo_programa = %(id)s)
					and conceito <> 'A'"""

        row = db.fetch_one(query, id=id)
        nota_maxima = 7
        if row:
            nota_maxima = row[0]

        query = """select conceito from programas where codigo_programa = %(id)s"""

        row = db.fetch_one(query, id=id)
        conceito = 3
        if row:
            conceito = row[0]

        dictindprods['conceito'] = conceito
        

        query = """select avg(cast(dados->>'indProdExtSup' as float)) as indProdAll, pb.ano, avg(cast(dados->>'quantidade_permanentes' as float)) as permanentes
                    from programas as p
                    inner join programas_historico as pb on (p.id_programa=pb.id_programa) where
                    p.situacao ilike '%%FUNCIONAMENTO%%' and 
					p.modalidade = (select modalidade from programas where codigo_programa = %(id)s) and
					p.conceito = %(nota)s and
                    p.nome_area_avaliacao = (select nome_area_avaliacao from programas where codigo_programa = %(id)s)
                    and pb.ano >= %(anoi)s and pb.ano <= %(anof)s and p.codigo_programa <> %(id)s group by pb.ano order by pb.ano
				"""
        
        for i in range(3, nota_maxima+1):
            row = db.fetch_all(query, id=id, anof=anof, anoi=anoi, nota=str(i))
            indprods = [dict(r) for r in row]
            dictindprods[str(i)] = indprods
            rotulos.append(str(i))

        dictindprods['maxima'] = str(nota_maxima)

        query = """select avg(cast(dados->>'indProdExtSup' as float)) as indProdAll, pb.ano, avg(cast(dados->>'quantidade_permanentes' as float)) as permanentes
                    from programas as p
                    inner join programas_historico as pb on (p.id_programa=pb.id_programa) where
                    p.situacao ilike '%%FUNCIONAMENTO%%' and 
					p.modalidade = (select modalidade from programas where codigo_programa = %(id)s) and
                    p.nome_area_avaliacao = (select nome_area_avaliacao from programas where codigo_programa = %(id)s)
                    and pb.ano >= %(anoi)s and pb.ano <= %(anof)s and p.codigo_programa <> %(id)s group by pb.ano order by pb.ano
				"""

        row = db.fetch_all(query, id=id, anof=anof, anoi=anoi)
        indprods = [dict(r) for r in row]
        dictindprods['país'] = indprods
        rotulos.append('país')

        query = """select avg(cast(dados->>'indProdExtSup' as float)) as indProdAll, pb.ano, avg(cast(dados->>'quantidade_permanentes' as float)) as permanentes
                    from programas as p
                    inner join programas_historico as pb on (p.id_programa=pb.id_programa) where
                    p.situacao ilike '%%FUNCIONAMENTO%%' and 
                    p.nome_regiao = (select nome_regiao from programas where codigo_programa = %(id)s) and
					p.modalidade = (select modalidade from programas where codigo_programa = %(id)s) and
                    p.nome_area_avaliacao = (select nome_area_avaliacao from programas where codigo_programa = %(id)s)
                    and pb.ano >= %(anoi)s and pb.ano <= %(anof)s and p.codigo_programa <> %(id)s group by pb.ano order by pb.ano
				"""

        row = db.fetch_all(query, id=id, anof=anof, anoi=anoi)
        indprods = [dict(r) for r in row]
        dictindprods['região'] = indprods
        rotulos.append('região')

        query = """select nome_regiao from programas where codigo_programa = %(id)s"""

        row = db.fetch_one(query, id=id)
        if row:
            nome_regiao = row[0]
            dictindprods['nome_regiao'] = nome_regiao

        query = """select avg(cast(dados->>'indProdExtSup' as float)) as indProdAll, pb.ano, avg(cast(dados->>'quantidade_permanentes' as float)) as permanentes
                    from programas as p
                    inner join programas_historico as pb on (p.id_programa=pb.id_programa) where
                    p.situacao ilike '%%FUNCIONAMENTO%%' and 
                    p.sigla_uf = (select sigla_uf from programas where codigo_programa = %(id)s) and
					p.modalidade = (select modalidade from programas where codigo_programa = %(id)s) and
                    p.nome_area_avaliacao = (select nome_area_avaliacao from programas where codigo_programa = %(id)s)
                    and pb.ano >= %(anoi)s and pb.ano <= %(anof)s and p.codigo_programa <> %(id)s group by pb.ano order by pb.ano
				"""

        row = db.fetch_all(query, id=id, anof=anof, anoi=anoi)
        indprods = [dict(r) for r in row]
        dictindprods['uf'] = indprods

        query = """select sigla_uf from programas where codigo_programa = %(id)s"""

        row = db.fetch_one(query, id=id)
        if row:
            uf = row[0]
            dictindprods['nome_uf'] = uf

        dictindprods['rotulos'] = rotulos
        return dictindprods


    @tratamento_excecao_db_ppg()
    def retorna_contagem_de_indprodart_extrato_superior_com_listanegra(self, id: str, anoi: int, anof: int, listanegra: List, db: DBConnector = None):
        """
        Retornar o quantitativo de indprodart ExtSup por docente (id_pessoa) para que o filtro do simulador de parâmetros da página funcione

        Parametros:
            id(str): Id do PPG
            anoi(int): ano de início
            anof(int): ano de fim
            db(class): DataBase
        Returno:
            produtos(dicionario)
        """

        query = """select * from metricas_indicadores_areas_avaliacao
                    where nome_area_avaliacao = (select nome_area_avaliacao from programas where codigo_programa = %(id)s) 
                        and metrica = 'indprodextsup'"""
        row = db.fetch_one(query, id=id, anof=anof, anoi=anoi)
        if row:
            indicadores = dict(row)
        else:
            indicadores = {'mbom':0, 'bom':0,'regular':0, 'fraco':0}

        permanentes = {}
        ano_atual = datetime.now().year
        
        ultimo_ano_coleta = self.retorna_ultimo_ano_coleta()

        diferenca_anos = ano_atual - ultimo_ano_coleta
        
        for a in range(anoi, ultimo_ano_coleta+diferenca_anos+1):
            if a > ultimo_ano_coleta:
                lista_permanente = self.retorna_lista_de_permanentes_do_ppg(id, ultimo_ano_coleta)
            else:
                lista_permanente = self.retorna_lista_de_permanentes_do_ppg(id, a)
            if lista_permanente:
                permanentes[a] = eval(lista_permanente)
        
        
        if listanegra:
            query = """with qqualis as(
                                             with qtotal as (select cp.nome_producao, cd.id_pessoa, cp.ano, substring(cdp.valor,2,9) as issn, p.nome_area_avaliacao 
                                             from coleta_detalhamento_producao as cdp 
                                             inner join coleta_producoes as cp on (cdp.id_producao = cp.id_producao and cp.ano >= %(anoi)s and cp.ano <= %(anof)s and cp.id_sub_tipo_producao = 18)
                                             inner join programas as p on p.id_programa = cp.id_programa and p.codigo_programa = %(id)s
                                             inner join coleta_autores as ca on (ca.id_producao = cp.id_producao and ca.tipo_vinculo = 3)
                                             inner join coleta_docentes as cd on (cd.id_pessoa = ca.id_pessoa and cp.ano = cd.ano and cd.tipo_categoria = 3)
                                             where item ilike '%%ISSN%%'
                                             group by cp.nome_producao, cd.id_pessoa, cp.ano, issn, p.nome_area_avaliacao
                                            order by cp.ano)

                                             select nome_producao, id_pessoa, ano, qtotal.issn, nome_area_avaliacao, qualis from capes_qualis_periodicos as cqp
                                             inner join qtotal on (qtotal.issn = cqp.issn and trim(cqp.area) = trim(nome_area_avaliacao))
                                             group by nome_producao, id_pessoa, ano, qtotal.issn, nome_area_avaliacao, qualis
                                             order by qualis ASC)

                                              select ano, id_pessoa, SUM(CASE WHEN qualis = 'A1' THEN 1 ELSE 0 END) AS "A1",
                                                                                     SUM(CASE WHEN qualis = 'A2' THEN 1 ELSE 0 END) AS "A2",
                                                                                     SUM(CASE WHEN qualis = 'A3' THEN 1 ELSE 0 END) AS "A3",
                                                                                     SUM(CASE WHEN qualis = 'A4' THEN 1 ELSE 0 END) AS "A4",
                                                                                     SUM(CASE WHEN qualis = 'B1' THEN 1 ELSE 0 END) AS "B1",
                                                                                     SUM(CASE WHEN qualis = 'B2' THEN 1 ELSE 0 END) AS "B2",
                                                                                     SUM(CASE WHEN qualis = 'B3' THEN 1 ELSE 0 END) AS "B3",
                                                                                     SUM(CASE WHEN qualis = 'B4' THEN 1 ELSE 0 END) AS "B4",
                                                                                     SUM(CASE WHEN qualis = 'C' THEN 1 ELSE 0 END) AS "C"
                                             from qqualis
											 group by ano, id_pessoa
											 order by ano"""


        else:
            query = """with qqualis as(
                                             with qtotal as (select cp.nome_producao, cp.ano, substring(cdp.valor,2,9) as issn, p.nome_area_avaliacao 
                                             from coleta_detalhamento_producao as cdp 
                                             inner join coleta_producoes as cp on (cdp.id_producao = cp.id_producao and cp.ano >= %(anoi)s and cp.ano <= %(anof)s and cp.id_sub_tipo_producao = 18)
                                             inner join programas as p on p.id_programa = cp.id_programa and p.codigo_programa = %(id)s
                                             inner join coleta_autores as ca on (ca.id_producao = cp.id_producao and ca.tipo_vinculo = 3)
                                             inner join coleta_docentes as cd on (cd.id_pessoa = ca.id_pessoa and cp.ano = cd.ano and cd.tipo_categoria = 3)
                                             where item ilike '%%ISSN%%'
                                             group by cp.nome_producao, cp.ano, issn, p.nome_area_avaliacao
                                            order by cp.ano)

                                             select nome_producao, ano, qtotal.issn, nome_area_avaliacao, qualis from capes_qualis_periodicos as cqp
                                             inner join qtotal on (qtotal.issn = cqp.issn and trim(cqp.area) = trim(nome_area_avaliacao))
                                             group by nome_producao, ano, qtotal.issn, nome_area_avaliacao, qualis
                                             order by qualis ASC)

                                              select ano, SUM(CASE WHEN qualis = 'A1' THEN 1 ELSE 0 END) AS "A1",
                                                                                     SUM(CASE WHEN qualis = 'A2' THEN 1 ELSE 0 END) AS "A2",
                                                                                     SUM(CASE WHEN qualis = 'A3' THEN 1 ELSE 0 END) AS "A3",
                                                                                     SUM(CASE WHEN qualis = 'A4' THEN 1 ELSE 0 END) AS "A4",
                                                                                     SUM(CASE WHEN qualis = 'B1' THEN 1 ELSE 0 END) AS "B1",
                                                                                     SUM(CASE WHEN qualis = 'B2' THEN 1 ELSE 0 END) AS "B2",
                                                                                     SUM(CASE WHEN qualis = 'B3' THEN 1 ELSE 0 END) AS "B3",
                                                                                     SUM(CASE WHEN qualis = 'B4' THEN 1 ELSE 0 END) AS "B4",
                                                                                     SUM(CASE WHEN qualis = 'C' THEN 1 ELSE 0 END) AS "C"
                                             from qqualis
											 group by ano
											 order by ano"""

        
        row = db.fetch_all(query, id=id, anoi=anoi, anof=anof)
        products = [dict(r) for r in row]

        lista_qualis = []

        indprods = {}
        for a in range(anoi, anof+1):
            indprods[a] = 0.0


        # adiciona resultado do ano atual com os dados do lattes
        for a in range(ultimo_ano_coleta+1, ultimo_ano_coleta+diferenca_anos+1):
            products_atual = self.retorna_contagem_de_qualis_do_lattes(id, a, ultimo_ano_coleta)

            if products_atual and len(products_atual) > 0:
                products.extend(products_atual)
        
        products = sorted(products, key=lambda k: k['ano'])

        if listanegra is None:
            listanegra = []

            lista_qualis = products
        
        else:
            # print(products)
            for prod in products:
                if prod['id_pessoa'] in permanentes[prod['ano']] and prod['id_pessoa'] not in listanegra:
                    lista_qualis.append(prod)

        artigos_total = {}
        for a in range(anoi, anof+1):
            artigos_total[a] = {'A1':0,'A2':0,'A3':0,'A4':0,'B1':0,'B2':0,'B3':0,'B4':0, 'C':0}

        for a in range(ultimo_ano_coleta+1, ultimo_ano_coleta+diferenca_anos+1):
            artigos_total[a] = {'A1':0,'A2':0,'A3':0,'A4':0,'B1':0,'B2':0,'B3':0,'B4':0, 'C':0}

        for l in  lista_qualis:
            for tipo in l.keys():
                if tipo != 'ano' and tipo != 'id_pessoa':
                    artigos_total[l['ano']][tipo] += l[tipo]

        
        qarea = """select pesos.* from pesos_indart_areas_avaliacao as pesos
                    inner join programas as p on p.nome_area_avaliacao = pesos.nome_area_avaliacao 
                    where p.codigo_programa = %(id)s"""
        
        area = db.fetch_one(qarea, id=id)

        retorno = {}

        if area:
            contagem_permanentes = {}
            for ano,qualis in artigos_total.items():
                indProdArt, formula = utils.calcula_indprod_extsup(id,qualis,db)

                
                indprods[int(ano)] = indProdArt/len(permanentes[ano])
                contagem_permanentes[int(ano)] = len(permanentes[ano])

            indprods_ext = self.retorna_indprods_extsup_medios_extratificados(id, anoi, anof)

            retorno = {'indprods': indprods, 'permanentes': contagem_permanentes, 'formula': formula}

            retorno.update(indprods_ext)


        return {'indprod':retorno, 'indicadores':indicadores}

    @tratamento_excecao_db_ppg()
    def retorna_indori(self, id: str, anoi: int, anof: int, db: DBConnector  = None):
        """
        Retorna o IndOri a partir do anoi até o anof do PPG
        
        Paramêtros:
            id(str): Id do PPG
            anoi(int): Ano de início
            anof(int): Ano Final
            db(class): DataBase
        """
        query = """select mbom, bom, regular, fraco from metricas_indicadores_areas_avaliacao
                    where nome_area_avaliacao = (select nome_area_avaliacao from programas where codigo_programa = %(id)s) 
                        and metrica = 'indori'"""
        row = db.fetch_one(query, id=id, anof=anof, anoi=anoi)
        if row:
            indicadores = dict(row)
        else:
            indicadores = {'mbom':0, 'bom':0,'regular':0, 'fraco':0}
        
        #query = """select cast(dados->>'indOri' as float) as indOri, ano from programas_historico where id = %(id)s
		#			and (ano>=%(anoi)s and ano <=%(anof)s) and id=%(id)s order by ano"""
        query = """select cast(dados->>'indOri' as float) as indOri, ano from programas_historico where id_programa = (select id_programa from programas where codigo_programa = %(id)s)
					and (ano >= %(anoi)s and ano <= %(anof)s) order by ano"""
        row = db.fetch_all(query, id=id, anof=anof, anoi=anoi)
        indoris = [dict(r) for r in row]

        ano_in = False
        for a in range(anoi, anof+1):
            for i in indoris:
                if i['indori'] is None:
                    i['indori'] = 0.0
                if a == i['ano']:
                    ano_in = True
            if ano_in == False:
                indoris.append({'indori': 0.0, 'ano': a})
        indoris = sorted(indoris, key=lambda k: k['ano'])
        return {'indori': indoris, 'indicadores': indicadores}
    
    @tratamento_excecao_db_ppg()
    def retorna_inddistori(self, id: str, anoi: int, anof: int, db: DBConnector  = None):
        """
        Retorna o Inddistori a partir do anoi até o anof do PPG
        
        Paramêtros:
            id(str): Id do PPG
            anoi(int): Ano de início
            anof(int): Ano Final
            db(class): DataBase
        """
        query = """select mbom, bom, regular, fraco from metricas_indicadores_areas_avaliacao
                    where nome_area_avaliacao = (select nome_area_avaliacao from programas where codigo_programa = %(id)s) 
                        and metrica = 'inddistori'"""
        row = db.fetch_one(query, id=id, anof=anof, anoi=anoi)
        if row:
            indicadores = dict(row)
        else:
            indicadores = {'mbom':0, 'bom':0,'regular':0, 'fraco':0}

        #query = """select cast(dados->>'indDistOri' as float) as indDistOri, ano from programas_historico where id = %(id)s
        #            and (ano>=%(anoi)s and ano <=%(anof)s) and id=%(id)s order by ano"""
        query = """select cast(dados->>'indDistOri' as float) as indDistOri, ano from programas_historico where id_programa = (select id_programa from programas where codigo_programa = %(id)s)
					and (ano >= %(anoi)s and ano <= %(anof)s) order by ano"""
        row = db.fetch_all(query, id=id, anof=anof, anoi=anoi)
        inddistoris = [dict(r) for r in row]
        ano_in = False
        for a in range(anoi, anof+1):
            for i in inddistoris:
                if i['inddistori'] is None:
                    i['inddistori'] = 0.0
                if a == i['ano']:
                    ano_in = True
            if ano_in == False:
                inddistoris.append({'inddistori': 0.0, 'ano': a})
        inddistoris = sorted(inddistoris, key=lambda k: k['ano'])
        return {'inddistori': inddistoris, 'indicadores': indicadores}
    
    @tratamento_excecao_db_ppg()
    def retorna_indaut(self, id: str, anoi: int, anof: int, db: DBConnector  = None):
        """
        Retorna o Indaut a partir do anoi até o anof do PPG
        
        Paramêtros:
            id(str): Id do PPG
            anoi(int): Ano de início
            anof(int): Ano Final
            db(class): DataBase
        """
        query = """select mbom, bom, regular, fraco from metricas_indicadores_areas_avaliacao
                    where nome_area_avaliacao = (select nome_area_avaliacao from programas where codigo_programa = %(id)s) 
                        and metrica = 'indaut'"""
        row = db.fetch_one(query, id=id, anof=anof, anoi=anoi)
        if row:
            indicadores = dict(row)
        else:
            indicadores = {'mbom':0, 'bom':0,'regular':0, 'fraco':0}

        #query = """select cast(dados->>'indAut' as float) as indAut, ano from programas_historico where id = %(id)s
		#			and (ano>=%(anoi)s and ano <=%(anof)s) and id= %(id)s order by ano"""
        query = """select cast(dados->>'indAutDis' as float) as indAut, ano from programas_historico where id_programa = (select id_programa from programas where codigo_programa = %(id)s)
					and (ano >= %(anoi)s and ano <= %(anof)s) order by ano"""
        row = db.fetch_all(query, id=id, anof=anof, anoi=anoi)
        indauts = [dict(r) for r in row]
        ano_in = False
        for a in range(anoi, anof+1):
            for i in indauts:
                if i['indaut'] is None:
                    i['indaut'] = 0.0
                if a == i['ano']:
                    ano_in = True
            if ano_in == False:
                indauts.append({'indaut': 0.0, 'ano': a})
        indauts = sorted(indauts, key=lambda k: k['ano'])
        return {'indaut':indauts,'indicadores':indicadores}
    
    @tratamento_excecao_db_ppg()
    def retorna_inddis(self, id: str, anoi: int, anof: int, db: DBConnector  = None):
        """
        Retorna o Inddis a partir do anoi até o anof do PPG
        
        Paramêtros:
            id(str): Id do PPG
            anoi(int): Ano de início
            anof(int): Ano Final
            db(class): DataBase
        """
        query = """select mbom, bom, regular, fraco from metricas_indicadores_areas_avaliacao
                    where nome_area_avaliacao = (select nome_area_avaliacao from programas where codigo_programa = %(id)s) 
                        and metrica = 'indproddis'"""
        row = db.fetch_one(query, id=id, anof=anof, anoi=anoi)
        if row:
            indicadores = dict(row)
        else:
            indicadores = {'mbom':0, 'bom':0,'regular':0, 'fraco':0}

        #query = """select cast(dados->>'indDis' as float) as indDis, ano from programas_historico where id = %(id)s
		#			and (ano>=%(anoi)s and ano <=%(anof)s) and id=%(id)s order by ano"""
        query = """select cast(dados->>'indDis' as float) as indDis, ano from programas_historico where id_programa = (select id_programa from programas where codigo_programa = %(id)s)
					and (ano >= %(anoi)s and ano <= %(anof)s) order by ano"""
        row = db.fetch_all(query, id=id, anof=anof, anoi=anoi)
        inddiss = [dict(r) for r in row]
        ano_in = False
        for a in range(anoi, anof+1):
            for i in inddiss:
                if i['inddis'] is None:
                    i['inddis'] = 0.0
                if a == i['ano']:
                    ano_in = True
            if ano_in == False:
                inddiss.append({'inddis': 0.0, 'ano': a})
        inddiss = sorted(inddiss, key=lambda k: k['ano'])
        return {'inddis':inddiss, 'indicadores':indicadores}
    
    @tratamento_excecao_db_ppg()
    def retorna_partdis(self, id: str, anoi: int, anof: int, db: DBConnector  = None):
        """
        Retorna o partdis a partir do anoi até o anof do PPG
        
        Paramêtros:
            id(str): Id do PPG
            anoi(int): Ano de início
            anof(int): Ano Final
            db(class): DataBase
        """
        query = """select mbom, bom, regular, fraco from metricas_indicadores_areas_avaliacao
                    where nome_area_avaliacao = (select nome_area_avaliacao from programas where codigo_programa = %(id)s) 
                        and metrica = 'partdis'"""
        row = db.fetch_one(query, id=id, anof=anof, anoi=anoi)
        if row:
            indicadores = dict(row)
        else:
            indicadores = {'mbom':0, 'bom':0,'regular':0, 'fraco':0}

        #query = """select cast(dados->>'partDisc' as float) as partDis, ano from programas_historico where id = %(id)s
		#			and (ano>=%(anoi)s and ano <=%(anof)s) and id=%(id)s order by ano"""
        query = """select cast(dados->>'partDis' as float) as partDis, ano from programas_historico where id_programa = (select id_programa from programas where codigo_programa = %(id)s)
					and (ano >= %(anoi)s and ano <= %(anof)s) order by ano"""
        row = db.fetch_all(query, id=id, anof=anof, anoi=anoi)
        partdiss = [dict(r) for r in row]
        ano_in = False
        for a in range(anoi, anof+1):
            for i in partdiss:
                if i['partdis'] is None:
                    i['partdis'] = 0.0
                if a == i['ano']:
                    ano_in = True
            if ano_in == False:
                partdiss.append({'partdis': 0.0, 'ano': a})
        partdiss = sorted(partdiss, key=lambda k: k['ano'])
        return {'partdis':partdiss, 'indicadores':indicadores}
    
    @tratamento_excecao_db_ppg()
    def retorna_indcoautoria(self, id: str, anoi: int, anof: int, db: DBConnector  = None):
        """
        Retorna o Indcoautoria a partir do anoi até o anof do PPG
        
        Paramêtros:
            id(str): Id do PPG
            anoi(int): Ano de início
            anof(int): Ano Final
            db(class): DataBase
        """
        query = """select mbom, bom, regular, fraco from metricas_indicadores_areas_avaliacao
                    where nome_area_avaliacao = (select nome_area_avaliacao from programas where codigo_programa = %(id)s) 
                        and metrica = 'indcoaut'"""
        row = db.fetch_one(query, id=id, anof=anof, anoi=anoi)
        if row:
            indicadores = dict(row)
        else:
            indicadores = {'mbom':0, 'bom':0,'regular':0, 'fraco':0}

        #query = """select cast(dados->>'coautoria' as float) as indcoautoria, ano from programas_historico where id = %(id)s
		#			and (ano>= %(anoi)s and ano <= %(anof)s) and id= %(id)s order by ano"""
        query = """select cast(dados->>'indCoaut' as float) as indcoautoria, ano from programas_historico where id_programa = (select id_programa from programas where codigo_programa = %(id)s)
					and (ano >= %(anoi)s and ano <= %(anof)s) order by ano"""
        row = db.fetch_all(query, id=id, anof=anof, anoi=anoi)
        coautorias = [dict(r) for r in row]
        ano_in = False
        for a in range(anoi, anof+1):
            for i in coautorias:
                if i['indcoautoria'] is None:
                    i['indcoautoria'] = 0.0
                if a == i['ano']:
                    ano_in = True
            if ano_in == False:
                coautorias.append({'indcoautoria': 0.0, 'ano': a})
        coautorias = sorted(coautorias, key=lambda k: k['ano'])
        return {'indcoautoria':coautorias,'indicadores':indicadores}
    
    @tratamento_excecao_db_ppg()
    def retorna_indori_medio(self, id: str, anoi: int, anof: int, db: DBConnector = None):
        """
        Retorna o IndOri médio a partir do anoi até o anof do PPG
        
        Paramêtros:
            id(str): Id do PPG
            anoi(int): Ano de início
            anof(int): Ano Final
            db(class): DataBase
        """
        query = """select avg(cast(dados->>'indOri' as float)) as indOriAll, 
                           pb.ano
                    from programas as p
                    inner join programas_historico as pb on (p.id_programa=pb.id_programa) where
                    p.situacao ilike '%%FUNCIONAMENTO%%' and p.modalidade = (select modalidade from programas where codigo_programa = %(id)s) and
                    p.conceito = (select conceito from programas where codigo_programa = %(id)s) and
					p.nome_area_avaliacao = (select nome_area_avaliacao from programas where codigo_programa = %(id)s) 
                    and pb.ano >= %(anoi)s and pb.ano <= %(anof)s and p.codigo_programa <> %(id)s group by pb.ano order by pb.ano"""
        row = db.fetch_all(query, id=id, anof=anof, anoi=anoi)
        indOris = [dict(r) for r in row]
        return indOris
    
    @tratamento_excecao_db_ppg()
    def retorna_partdis_medio(self, id: str, anoi: int, anof: int, db: DBConnector = None):
        """
        Retorna o partdis médio a partir do anoi até o anof do PPG
        
        Paramêtros:
            id(str): Id do PPG
            anoi(int): Ano de início
            anof(int): Ano Final
            db(class): DataBase
        """
        query = """select avg(cast(dados->>'partDis' as float)) as partDisAll, 
                           pb.ano
                    from programas as p
                    inner join programas_historico as pb on (p.id_programa=pb.id_programa) where
                    p.situacao ilike '%%FUNCIONAMENTO%%' and p.modalidade = (select modalidade from programas where codigo_programa = %(id)s) and
                    p.conceito = (select conceito from programas where codigo_programa = %(id)s) and
					p.nome_area_avaliacao = (select nome_area_avaliacao from programas where codigo_programa = %(id)s) 
                    and pb.ano >= %(anoi)s and pb.ano <= %(anof)s and p.codigo_programa <> %(id)s group by pb.ano order by pb.ano"""
        row = db.fetch_all(query, id=id, anof=anof, anoi=anoi)
        partDisc = [dict(r) for r in row]
        return partDisc

    @tratamento_excecao_db_ppg()
    def retorna_inddistori_medio(self, id: str, anoi: int, anof: int, db: DBConnector = None):
        """
        Retorna o inddistori médio a partir do anoi até o anof do PPG
        
        Paramêtros:
            id(str): Id do PPG
            anoi(int): Ano de início
            anof(int): Ano Final
            db(class): DataBase
        """
        query = """select avg(cast(dados->>'indDistOri' as float)) as indDistOriAll, 
                           pb.ano
                    from programas as p
                    inner join programas_historico as pb on (p.id_programa=pb.id_programa) where
                    p.situacao ilike '%%FUNCIONAMENTO%%' and p.modalidade = (select modalidade from programas where codigo_programa = %(id)s) and
                    p.conceito = (select conceito from programas where codigo_programa = %(id)s) and
					p.nome_area_avaliacao = (select nome_area_avaliacao from programas where codigo_programa = %(id)s) 
                    and pb.ano >= %(anoi)s and pb.ano <= %(anof)s and p.codigo_programa <> %(id)s group by pb.ano order by pb.ano"""
        row = db.fetch_all(query, id=id, anof=anof, anoi=anoi)
        indDistOris = [dict(r) for r in row]
        return indDistOris

    @tratamento_excecao_db_ppg()
    def retorna_indaut_medio(self, id: str, anoi: int, anof: int, db: DBConnector = None):
        """
        Retorna o indaut médio a partir do anoi até o anof do PPG
        
        Paramêtros:
            id(str): Id do PPG
            anoi(int): Ano de início
            anof(int): Ano Final
            db(class): DataBase
        """
        query = """select avg(cast(dados->>'indAutDis' as float)) as indAutAll, 
                           pb.ano
                    from programas as p
                    inner join programas_historico as pb on (p.id_programa=pb.id_programa) where
                    p.situacao ilike '%%FUNCIONAMENTO%%' and p.modalidade = (select modalidade from programas where codigo_programa = %(id)s) and
                    p.conceito = (select conceito from programas where codigo_programa = %(id)s) and
					p.nome_area_avaliacao = (select nome_area_avaliacao from programas where codigo_programa = %(id)s) 
                    and pb.ano >= %(anoi)s and pb.ano <= %(anof)s and p.codigo_programa <> %(id)s group by pb.ano order by pb.ano"""
        row = db.fetch_all(query, id=id, anof=anof, anoi=anoi)
        indAuts = [dict(r) for r in row]
        return indAuts

    @tratamento_excecao_db_ppg()
    def retorna_inddis_medio(self, id: str, anoi: int, anof: int, db: DBConnector = None):
        """
        Retorna o inddis médio a partir do anoi até o anof do PPG
        
        Paramêtros:
            id(str): Id do PPG
            anoi(int): Ano de início
            anof(int): Ano Final
            db(class): DataBase
        """
        query = """select avg(cast(dados->>'indDis' as float)) as indDisAll, 
                       pb.ano
                    from programas as p
                    inner join programas_historico as pb on (p.id_programa=pb.id_programa) where
                    p.situacao ilike '%%FUNCIONAMENTO%%' and p.modalidade = (select modalidade from programas where codigo_programa = %(id)s) and
                    p.conceito = (select conceito from programas where codigo_programa = %(id)s) and
					p.nome_area_avaliacao = (select nome_area_avaliacao from programas where codigo_programa = %(id)s) 
                    and pb.ano >= %(anoi)s and pb.ano <= %(anof)s and p.codigo_programa <> %(id)s group by pb.ano order by pb.ano"""
        row = db.fetch_all(query, id=id, anof=anof, anoi=anoi)
        indDiss = [dict(r) for r in row]
        return indDiss

    @tratamento_excecao_db_ppg()
    def retorna_indcoautoria_medio(self, id: str, anoi: int, anof: int, db: DBConnector = None):
        """
        Retorna o indcouatoria médio a partir do anoi até o anof do PPG
        
        Paramêtros:
            id(str): Id do PPG
            anoi(int): Ano de início
            anof(int): Ano Final
            db(class): DataBase
        """
        query = """select avg(cast(dados->>'indCoaut' as float)) as indcoautoriaAll, 
                           pb.ano
                    from programas as p
                    inner join programas_historico as pb on (p.id_programa=pb.id_programa) where
                    p.situacao ilike '%%FUNCIONAMENTO%%' and p.modalidade = (select modalidade from programas where codigo_programa = %(id)s) and
                    p.conceito = (select conceito from programas where codigo_programa = %(id)s) and
					p.nome_area_avaliacao = (select nome_area_avaliacao from programas where codigo_programa = %(id)s) 
                    and pb.ano >= %(anoi)s and pb.ano <= %(anof)s and p.codigo_programa <> %(id)s group by pb.ano order by pb.ano"""
        row = db.fetch_all(query, id=id, anof=anof, anoi=anoi)
        coautoria = [dict(r) for r in row]
        return coautoria
  
    @tratamento_excecao_db_ppg()
    def retorna_tempos_de_conclusao(self, id: str, anoi: int, anof: int, db: DBConnector):
        """
        Retorna tempo de conclusão dos professores do PPG

        Paramêtros:
            Id(str): Id do PPG
            anoi(int): Ano de início
            anof(int): Ano final
            db(class): DataBase
        """
        
        query = """select distinct co.id_pessoa, cast(EXTRACT(year FROM age(co.fim,co.inicio))*12 + 
                                    EXTRACT(month FROM age(co.fim,co.inicio)) as integer) as meses, cdis.grau_academico as nivel, csd.situacao from coleta_orientacoes as co
                    inner join coleta_discentes as cdis on (co.id_pessoa = cdis.id_pessoa and co.id_programa = cdis.id_programa and co.ano = cdis.ano)
                    inner join coleta_situacao_discente as csd on (csd.id = cdis.situacao_discente)
                    where co.id_programa = (select id_programa from programas where codigo_programa = %(id)s) and co.ano >= %(anoi)s and co.ano <= %(anof)s and
                        cdis.situacao_discente = 8 and 
                EXTRACT(year FROM age(co.fim,co.inicio)) > 0 and 
                EXTRACT(year FROM age(co.fim,co.inicio))*12 + 
                EXTRACT(month FROM age(co.fim,co.inicio)) < 70"""
        row = db.fetch_all(query, id=id, anoi=anoi, anof=anof)
        times = [dict(r) for r in row]
        return times
    
    #* Docentes
    
    @staticmethod
    def generates_combinations(artigos: list):
        combinations_list = combinations(artigos, 2)

        return combinations_list
    
    @tratamento_excecao_db_ppg()
    def retorna_professores_por_categoria(self, id: str, anoi: int, anof: int, db: DBConnector = None):
        """
        Retorna a quatidade de professores por categoria

        Paramêtros:
            Id(str): Id do PPG
            anoi(int): Ano de início
            anof(int): Ano final
            db(class): DataBase
        """
        query = """select count(ctc.categoria), ctc.categoria, cd.ano from coleta_docentes as cd
                    inner join coleta_tipo_categoria_docente as ctc on (ctc.id = cd.tipo_categoria)
                    where cd.ano >= %(anoi)s and cd.ano <= %(anof)s and 
                                        cd.id_programa = (select id_programa from programas where codigo_programa = %(id)s)
                                        group by cd.ano, ctc.categoria order by cd.ano"""
        row = db.fetch_all(query, id=id, anoi=anoi, anof=anof)
        profs = [dict(r) for r in row]
        return profs
    
    @tratamento_excecao_db_ppg()
    def retorna_quantidade_de_discentes_titulados(self, id: str, anoi: int, anof: int, db: DBConnector = None):
        """
        Retorna a quantidade de discentes titulos por ano do PPG

        Paramêtros:
            Id(str): Id do PPG
            anoi(int): Ano de início
            anof(int): Ano final
            db(class): DataBase
        """
        query = """select count(*), ano, grau_academico as nivel from coleta_discentes 
                    where ano >= %(anoi)s and ano <= %(anof)s and id_programa = (select id_programa from programas where codigo_programa = %(id)s) and 
                    situacao_discente = 8 group by ano, nivel order by ano"""
        row = db.fetch_all(query, id=id, anof=anof, anoi=anoi)
        profs = [dict(r) for r in row]
        return profs
    
    @tratamento_excecao_db_ppg()
    def retorna_tempo_de_atualizacao_do_lattes(self, id: str, anoi: int, anof: int, db: DBConnector = None):
        """
        Retorna a quantidade de Perfis Lattes desatualizados por PPG
        
        Paramêtros:
            id(str): Id do PPG
            db(class): DataBase
        """
        query = """select dt_atualizacao, ld.num_identificador, nm_completo from lattes_docentes as ld
                    inner join (select cd.id_pessoa, p.lattes as num_identificador from coleta_docentes as cd
								inner join pessoas as p on (cd.id_pessoa = p.id_pessoa) where cd.id_programa = (select id_programa from programas where codigo_programa = %(id)s)
                    and ano >= %(anoi)s and ano <= %(anof)s) as ids
                    on (ld.num_identificador = ids.num_identificador)
                    group by dt_atualizacao, ld.num_identificador, nm_completo
					"""
        row = db.fetch_all(query, id=id, anoi=anoi, anof=anof)
        datas = [dict(r) for r in row]
        um_mes_atras = datetime.now() - timedelta(days=1 * 30)
        tres_meses_atras = datetime.now() - timedelta(days=3 * 30)
        seis_meses_atras = datetime.now() - timedelta(days=6 * 30)
        oito_meses_atras = datetime.now() - timedelta(days=8 * 30)
        doze_meses_atras = datetime.now() - timedelta(days=12 * 30)

        datas_lattes = {'até 2 meses': 0, '3 e 6 meses': 0,
                        '6 e 8 meses': 0, '8 e 12 meses': 0, '+12 meses': 0}

        for data in datas:
            dt = data['dt_atualizacao'][0:2]+'-' + \
                data['dt_atualizacao'][2:4]+'-'+data['dt_atualizacao'][4:]
            dt_format = '%d-%m-%Y'
            data['dt_atualizacao'] = datetime.strptime(dt, dt_format)

            if data['dt_atualizacao'] < doze_meses_atras:
                datas_lattes['+12 meses'] += 1
            elif data['dt_atualizacao'] < oito_meses_atras and data['dt_atualizacao'] >= doze_meses_atras:
                datas_lattes['8 e 12 meses'] += 1
            elif data['dt_atualizacao'] < seis_meses_atras and data['dt_atualizacao'] >= oito_meses_atras:
                datas_lattes['6 e 8 meses'] += 1
            elif data['dt_atualizacao'] < tres_meses_atras and data['dt_atualizacao'] >= seis_meses_atras:
                datas_lattes['3 e 6 meses'] += 1
            else:
                datas_lattes['até 2 meses'] += 1

            dicionario = [{'quantidade': datas_lattes['+12 meses'], 'legenda':'+12 meses'},
                          {'quantidade': datas_lattes['8 e 12 meses'],
                              'legenda':'8 e 12 meses'},
                          {'quantidade': datas_lattes['6 e 8 meses'],
                              'legenda':'6 e 8 meses'},
                          {'quantidade': datas_lattes['3 e 6 meses'],
                              'legenda':'3 e 6 meses'},
                          {'quantidade': datas_lattes['até 2 meses'], 'legenda':'até 2 meses'}]

        return dicionario

    @tratamento_excecao_db_ppg()
    def retorna_lista_de_professores_por_ano(self, id: str, anoi: int, anof: int, db: DBConnector = None):
        """
        Retorna lista de professores por ano

        Paramêtros:
            Id(str): Id do PPG
            anoi(int): Ano de início
            anof(int): Ano final
            db(class): DataBase
        """

        # FONTE: lattes
        query = """with query_qualis as (
	            with query_ids as (
                    with query_qualis as (
                    select ld.num_identificador, 
                        issn, 
                        titulo, 
                        (select qualis from capes_qualis_periodicos as cqp 
                                where cqp.issn = artigos_total.issn and 
                                cqp.area ilike  ANY (
			 						select '%%' || nome_area_avaliacao || '%%' from programas where codigo_programa = %(id)s )
                                     group by qualis
                        ) as qualis, 
                        ano, 
                        count(*) as quantidade 
                        from (select CONCAT(SUBSTRING(d."DETALHAMENTO-DO-ARTIGO"->>'@ISSN', 1, 4), '-', SUBSTRING(d."DETALHAMENTO-DO-ARTIGO"->>'@ISSN', 5)) as issn, 
                                    d."DADOS-BASICOS-DO-ARTIGO"->>'@TITULO-DO-ARTIGO' as titulo,
                                    cast(d."DADOS-BASICOS-DO-ARTIGO"->>'@ANO-DO-ARTIGO' as integer) as ano,
                                    num_identificador
                                from lattes_producao_bibliografica as lpb
                                join lateral jsonb_to_recordset(lpb.dados) as d("DETALHAMENTO-DO-ARTIGO" jsonb, "DADOS-BASICOS-DO-ARTIGO" jsonb) on true    
                                where lpb.tipo = 'ARTIGO-PUBLICADO' and 
                                    d."DETALHAMENTO-DO-ARTIGO"->>'@ISSN' != '' and 									  
                                    d."DADOS-BASICOS-DO-ARTIGO"->>'@ANO-DO-ARTIGO' >= '%(anoi)s'  and
							        d."DADOS-BASICOS-DO-ARTIGO"->>'@ANO-DO-ARTIGO' <= '%(anof)s'
                            ) as artigos_total
                        inner join lattes_docentes as ld on (ld.num_identificador = artigos_total.num_identificador)
                        group by ld.num_identificador, issn, titulo, qualis, ano
                    )
                        
                    select  qq.ano,
                            issn,
                            titulo,
                            qualis,
                            quantidade,
                            STRING_AGG(num_identificador, ',') as ids
                        from query_qualis as qq
                        where qualis is not null
                        group by qq.ano,
                                issn,
                                titulo,
                                qualis,
                                quantidade
                                order by titulo)
			select qids.ano, dp.id_pessoa, p.nome_pessoa, p.lattes, qids.issn, qids.titulo, qids.qualis, qids.ids, qids.quantidade from coleta_docentes as dp 
	inner join pessoas as p on dp.id_pessoa = p.id_pessoa and dp.ano >= %(anoi)s and dp.ano <= %(anof)s and dp.id_programa = (select id_programa from programas where codigo_programa = %(id)s)
    left join query_ids as qids on ids like '%%'||p.lattes||'%%'
                    group by qids.ano, dp.id_pessoa, p.nome_pessoa, p.lattes, qids.issn, qids.titulo, qids.qualis, qids.ids, qids.quantidade)
			select  qq.id_pessoa as id_sucupira, qq.nome_pessoa as nome, qq.lattes as num_identificador, 
                    SUM(CASE WHEN qualis = 'A1' THEN 1 ELSE 0 END) AS "A1",
                        SUM(CASE WHEN qualis = 'A2' THEN 1 ELSE 0 END) AS "A2",
                        SUM(CASE WHEN qualis = 'A3' THEN 1 ELSE 0 END) AS "A3",
                        SUM(CASE WHEN qualis = 'A4' THEN 1 ELSE 0 END) AS "A4",
                        SUM(CASE WHEN qualis = 'B1' THEN 1 ELSE 0 END) AS "B1",
                        SUM(CASE WHEN qualis = 'B2' THEN 1 ELSE 0 END) AS "B2",
                        SUM(CASE WHEN qualis = 'B3' THEN 1 ELSE 0 END) AS "B3",
                        SUM(CASE WHEN qualis = 'B4' THEN 1 ELSE 0 END) AS "B4",
                        SUM(CASE WHEN qualis = 'C' THEN 1 ELSE 0 END) AS "C"
                from query_qualis as qq
                where qq.lattes != ''
                group by qq.id_pessoa, qq.nome_pessoa, qq.lattes
                order by qq.nome_pessoa"""
        
        query_ano_atual = """with query_qualis as (
	            with query_ids as (
                    with query_qualis as (
                    select ld.num_identificador, 
                        issn, 
                        titulo, 
                        (select qualis from capes_qualis_periodicos as cqp 
                                where cqp.issn = artigos_total.issn and 
                                cqp.area ilike  ANY (
			 						select '%%' || nome_area_avaliacao || '%%' from programas where codigo_programa = %(id)s )
                                     group by qualis
                        ) as qualis, 
                        ano, 
                        count(*) as quantidade 
                        from (select CONCAT(SUBSTRING(d."DETALHAMENTO-DO-ARTIGO"->>'@ISSN', 1, 4), '-', SUBSTRING(d."DETALHAMENTO-DO-ARTIGO"->>'@ISSN', 5)) as issn, 
                                    d."DADOS-BASICOS-DO-ARTIGO"->>'@TITULO-DO-ARTIGO' as titulo,
                                    cast(d."DADOS-BASICOS-DO-ARTIGO"->>'@ANO-DO-ARTIGO' as integer) as ano,
                                    num_identificador
                                from lattes_producao_bibliografica as lpb
                                join lateral jsonb_to_recordset(lpb.dados) as d("DETALHAMENTO-DO-ARTIGO" jsonb, "DADOS-BASICOS-DO-ARTIGO" jsonb) on true    
                                where lpb.tipo = 'ARTIGO-PUBLICADO' and 
                                    d."DETALHAMENTO-DO-ARTIGO"->>'@ISSN' != '' and 									  
                                    d."DADOS-BASICOS-DO-ARTIGO"->>'@ANO-DO-ARTIGO' >= '%(anoi)s'  and
							        d."DADOS-BASICOS-DO-ARTIGO"->>'@ANO-DO-ARTIGO' <= '%(anof)s'
                            ) as artigos_total
                        inner join lattes_docentes as ld on (ld.num_identificador = artigos_total.num_identificador)
                        group by ld.num_identificador, issn, titulo, qualis, ano
                    )
                        
                    select  qq.ano,
                            issn,
                            titulo,
                            qualis,
                            quantidade,
                            STRING_AGG(num_identificador, ',') as ids
                        from query_qualis as qq
                        where qualis is not null
                        group by qq.ano,
                                issn,
                                titulo,
                                qualis,
                                quantidade
                                order by titulo)
			select qids.ano, dp.id_pessoa, p.nome_pessoa, p.lattes, qids.issn, qids.titulo, qids.qualis, qids.ids, qids.quantidade from coleta_docentes as dp 
                    inner join pessoas as p on dp.id_pessoa = p.id_pessoa and dp.ano >= %(ano_anterior)s and dp.ano <= %(anof)s and dp.id_programa = (select id_programa from programas where codigo_programa = %(id)s)
                    left join query_ids as qids on ids like '%%'||p.lattes||'%%'
                    group by qids.ano, dp.id_pessoa, p.nome_pessoa, p.lattes, qids.issn, qids.titulo, qids.qualis, qids.ids, qids.quantidade)
			select  qq.id_pessoa as id_sucupira, qq.nome_pessoa as nome, qq.lattes as num_identificador, 
                    SUM(CASE WHEN qualis = 'A1' THEN 1 ELSE 0 END) AS "A1",
                        SUM(CASE WHEN qualis = 'A2' THEN 1 ELSE 0 END) AS "A2",
                        SUM(CASE WHEN qualis = 'A3' THEN 1 ELSE 0 END) AS "A3",
                        SUM(CASE WHEN qualis = 'A4' THEN 1 ELSE 0 END) AS "A4",
                        SUM(CASE WHEN qualis = 'B1' THEN 1 ELSE 0 END) AS "B1",
                        SUM(CASE WHEN qualis = 'B2' THEN 1 ELSE 0 END) AS "B2",
                        SUM(CASE WHEN qualis = 'B3' THEN 1 ELSE 0 END) AS "B3",
                        SUM(CASE WHEN qualis = 'B4' THEN 1 ELSE 0 END) AS "B4",
                        SUM(CASE WHEN qualis = 'C' THEN 1 ELSE 0 END) AS "C"
                from query_qualis as qq
                where qq.lattes != ''
                group by qq.id_pessoa, qq.nome_pessoa, qq.lattes
                order by qq.nome_pessoa"""
        
        ultimo_ano_coleta = self.retorna_ultimo_ano_coleta() + 1
        if anoi == anof and anoi == ultimo_ano_coleta:
            row = db.fetch_all(query_ano_atual, id=id, anof=anof, anoi=anoi, ano_anterior=anoi-1)
        else:
            row = db.fetch_all(query, id=id, anof=anof, anoi=anoi)
        professors = [dict(r) for r in row]
        for i in professors:
            for k in i.keys():
                if i[k] is None:
                    i[k] = 0
        producoes = {}
        orientados = {}
        avatares = {}
        datalattes = {}
        indprods = {}
        status = {}
        for p in professors:
            if 'nome' in p:
                id_professor = p['num_identificador']
                datalattes[id_professor] = self.retorna_tempo_de_atualizacao_do_lattes_do_professor(id_professor)
                # FONTE: lattes
                producoes[id_professor] = self.retorna_producoes_do_professor(id_professor, anoi, anof)
                # FONTE: sucupira
                orientados[id_professor] = self.retorna_orientandos_do_professor(id, p['id_sucupira'], anoi, anof)
                # FONTE: sucupira
                status[id_professor] = self.getStatusOfProfessor(id, p['id_sucupira'], anoi, anof)
                status[id_professor] = list(set(status[id_professor].replace(' ','').split(',')))
                # query = f"select cast(id as text) from docentes where nome ilike '{id_professor}' limit 1"
                if id_professor:
                    avatares[id_professor] = self.retorna_link_avatar_lattes(id_professor, True)
                    

                indprod_prof, formula = utils.calcula_indprod(id,p,db)
                p['indprod'] = (indprod_prof/len(range(anoi,anof+1)))

                #indprods[id_professor] = (indprod_prof/len(range(anoi,anof+1)))
                #indprods[id_professor] = (1 * p['A1'] + 0.875 * p['A2'] + 0.75 * p['A3'] + 0.625 * p['A4'] + 0.5 * p['B1'] + 0.375 * p['B2'] + 0.25 * p['B3'] + 0.125 * p['B4'])/(anof-anoi if anoi<anof else 1)
        professors = sorted(professors, key=lambda p: p['indprod'], reverse=True)
        medias = self.retorna_indprods_medios_extratificados(id,anoi, anof)
        

        medias_uteis = {}
        if len(medias['uf']) > 0:
            medias_uteis['PPGs de '+medias['nome_uf']] = self.calcula_medias(medias['uf'])
        if len(medias['país']) > 0:
            medias_uteis['PPGs do país'] = self.calcula_medias(medias['país'])
        if len(medias['região']) > 0:
            medias_uteis['PPGs da região '+medias['nome_regiao']] = self.calcula_medias(medias['região'])
        
        for c in range(int(medias['conceito']), int(medias['maxima'])+1):
            if len(medias[str(c)]) > 0:
                medias_uteis['PPGs nota '+str(c)] = self.calcula_medias(medias[str(c)])


        medias = dict(sorted(medias_uteis.items(),  key=lambda p: p[1],  reverse=True))
        medias['menor'] = 0

        return {'professores': professors, 'medias':medias, 'produtos': producoes, 'orientados': orientados, 'avatares': avatares, 'datalattes': datalattes, 'status':status, 'formula': formula}
    
    def calcula_medias(self, lista):
        medias = sum([l['indprodall'] for l in lista])
        return medias/len(lista)
    
    @tratamento_excecao_db_ppg()
    def retorna_orientandos_do_professor(self, id: str, id_docente: str, anoi: int, anof: int, db: DBConnector = None):
        """
        Retorna orientandos do professor

        Paramêtros:
            Id(str): Id do PPG
            id_docente(str): Id Sucupira of the Professor
            anoi(int): Ano de início
            anof(int): Ano final
            db(class): DataBase
        """

        query = """select distinct co.id_pessoa, cast(EXTRACT(year FROM age(co.fim,co.inicio))*12 + 
                                    EXTRACT(month FROM age(co.fim,co.inicio)) as integer) as tempo, cdis.grau_academico as nivel, csd.situacao from coleta_orientacoes as co
                    inner join coleta_discentes as cdis on (co.id_pessoa = cdis.id_pessoa and co.id_programa = cdis.id_programa and co.ano = cdis.ano)
                    inner join coleta_situacao_discente as csd on (csd.id = cdis.situacao_discente)
                    where co.id_programa = (select id_programa from programas where codigo_programa = %(id)s) and co.ano >= %(anoi)s and co.ano <= %(anof)s and
                        co.id_docente = %(id_docente)s and co.principal = 1 and cdis.situacao_discente != 7 """

        row = db.fetch_all(query, id=id, anoi=anoi, anof=anof, id_docente=id_docente)
        orientados = [dict(r) for r in row]
        df = pd.DataFrame(orientados)
        doutorado_dentro = {'TITULADO': 0, 'ABANDONOU': 0,
                            'DESLIGADO': 0, 'MUDANCA DE NÍVEL COM DEFESA': 0}
        doutorado_fora = {'TITULADO': 0, 'ABANDONOU': 0,
                          'DESLIGADO': 0, 'MUDANCA DE NÍVEL COM DEFESA': 0}
        mestrado_dentro = {'TITULADO': 0, 'ABANDONOU': 0,
                           'DESLIGADO': 0, 'MUDANCA DE NÍVEL COM DEFESA': 0}
        mestrado_fora = {'TITULADO': 0, 'ABANDONOU': 0,
                         'DESLIGADO': 0, 'MUDANCA DE NÍVEL COM DEFESA': 0}

        if not df.empty:
            situacoes = set(df['situacao'].values)
            niveis = set(df['nivel'].values)

            for n in niveis:
                for s in situacoes:
                    if 'mestrado' in n.lower():
                        mestrado_fora[s] = len(df[(df['nivel'] == n) & (
                            df['situacao'] == s) & (df['tempo'] > 24)])
                        mestrado_dentro[s] = len(df[(df['nivel'] == n) & (
                            df['situacao'] == s) & (df['tempo'] <= 24)])
                    elif 'doutorado' in n.lower():
                        doutorado_fora[s] = len(df[(df['nivel'] == n) & (
                            df['situacao'] == s) & (df['tempo'] > 48)])
                        doutorado_dentro[s] = len(df[(df['nivel'] == n) & (
                            df['situacao'] == s) & (df['tempo'] <= 48)])

        # Doutorado TITULADO <=48 4
        # Doutorado MUDANCA DE NÍVEL COM DEFESA >48 0
        # Doutorado MUDANCA DE NÍVEL COM DEFESA <=48 1
        # Mestrado MATRICULADO >24 0
        # Mestrado MATRICULADO <=24 0
        # Mestrado TITULADO >24 3
        # Mestrado TITULADO <=24 4
        # Mestrado MUDANCA DE NÍVEL COM DEFESA >24 0
        # Mestrado MUDANCA DE NÍVEL COM DEFESA <=24 0

        return [doutorado_dentro, doutorado_fora, mestrado_dentro, mestrado_fora]
    
    
    @tratamento_excecao_db_ppg()
    def getStatusOfProfessor(self, id: str, id_docente: str, anoi: int, anof: int, db: DBConnector = None):
        """
        Returns the status (permanente, colaborador, visitante) of Professors


        Parameters:
            Id(str): Id of PPG
            id_docente(str): Id Sucupira of the Professor
            anoi(str): Year of Start
            anof(str): Year of End
            db(class): DataBase
        """
        query = """select STRING_AGG(ctcd.categoria, ', ') AS categorias_concatenadas from coleta_docentes as cd
                    inner join coleta_tipo_categoria_docente as ctcd on ctcd.id = cd.tipo_categoria
                    where cd.ano >= %(anoi)s and cd.ano <= %(anof)s and cd.id_pessoa =  %(id_docente)s and 
                    cd.id_programa = (select id_programa from programas where codigo_programa = %(id)s)"""
        query_ano_atual = """select STRING_AGG(ctcd.categoria, ', ') AS categorias_concatenadas from coleta_docentes as cd
                    inner join coleta_tipo_categoria_docente as ctcd on ctcd.id = cd.tipo_categoria
                    where cd.ano >= %(ano_anterior)s and cd.ano <= %(anof)s and cd.id_pessoa =  %(id_docente)s and 
                    cd.id_programa = (select id_programa from programas where codigo_programa = %(id)s)"""

        ultimo_ano_coleta = self.retorna_ultimo_ano_coleta() + 1
        if anoi == anof and anoi == ultimo_ano_coleta:
            row = db.fetch_one(query_ano_atual, id=id, anof=anof, id_docente=id_docente, ano_anterior=anoi-1)
        else:
            row = db.fetch_one(query, id=id, anoi=anoi, anof=anof, id_docente=id_docente)
        if row:
            return row[0]
        return ''
    
    @tratamento_excecao_db_ppg()
    def retorna_grafo_de_coautores_do_ppg(self, id: str, anoi: int, anof: int, db: DBConnector = None):
        """
        Retorna um grafo de coautoria do PPG

        Paramêtros:
            Id(str): Id do PPG
            anoi(int): Ano de início
            anof(int): Ano final
            db(class): DataBase
        """
        query = """select cp.nome_producao as id_producao, p.nome_pessoa as nm_autor, ca.ano from coleta_autores as ca
                    inner join coleta_producoes as cp on (cp.id_producao = ca.id_producao and cp.id_sub_tipo_producao = 18)
                    inner join pessoas as p on (p.id_pessoa = ca.id_pessoa)
                    where ca.id_programa = (select id_programa from programas where codigo_programa = %(id)s) 
                        and ca.ano >= %(anoi)s and ca.ano <= %(anof)s
                        and ca.tipo_vinculo = 3
                        group by cp.nome_producao, p.nome_pessoa, ca.ano
                        order by cp.nome_producao ASC, ca.ano ASC"""
        row = db.fetch_all(query, id=id, anoi=anoi, anof=anof)
        coauts = [dict(r) for r in row]

        artigos = {}
        nodes_authors = set()
        nodes_authors_solos = set()
        nodes_papers = set()
        links = []

        links_count = {}

        for c in coauts:
            if c['id_producao'] not in artigos:
                artigos[c['id_producao']] = []
            artigos[c['id_producao']].append(c['nm_autor'])
            nodes_authors.add(c['nm_autor'])

        for k, v in artigos.items():
            if len(v) > 1:
                comb = self.generates_combinations(v)
                for c in comb:
                    if (c[0], c[1]) not in links_count:
                        links_count[(c[0], c[1])] = 1
                    else:
                        links_count[(c[0], c[1])] += 1

        for k, v in links_count.items():
            links.append(
                {'source': str(k[0]), 'target': str(k[1]), 'value': v})

        grafo = {'nodes': [], 'links': links}

        for n in nodes_authors:
            grafo['nodes'].append({'id': str(n), 'group': 'authors'})

        return grafo
    
    @tratamento_excecao_db_ppg()
    def retorna_grafo_de_coautores_do_programa(self, id_ies: str, id: str, anoi: int, anof: int, autor: str, db: DBConnector = None):
        """
        Retorna um grafo de coautoria de um autor (ou todos) com os professores do mesmo PPG
        
        Paramêtros:
            Id(str): Id do PPG
            anoi(str): Ano de início
            anof(str): Ano final
            autor(str): Principal Autor 
            db(class): DataBase
        """
        query = """ select cp.nome_producao as id_producao, p.id_pessoa as id_autor, p.nome_pessoa as nm_autor, ca.ano from coleta_autores as ca
                    inner join coleta_producoes as cp on (cp.id_producao = ca.id_producao and cp.id_programa = ca.id_programa)
                    inner join coleta_sub_tipo_producao as cstp on (cstp.id = cp.id_sub_tipo_producao and cstp.id = 18)
                    inner join pessoas as p on (p.id_pessoa = ca.id_pessoa)
                    inner join programas as prog on (prog.id_programa = ca.id_programa and prog.id_ies = %(id_ies)s and prog.codigo_programa = %(id)s)
                    where ca.ano >= %(anoi)s and ca.ano <= %(anof)s
                        and ca.tipo_vinculo = 3
                        group by cp.nome_producao, p.id_pessoa, p.nome_pessoa, ca.ano, prog.codigo_programa
                        order by ca.ano ASC"""
        row = db.fetch_all(query, id_ies=id_ies, id=id, anoi=anoi, anof=anof)
        coauts = [dict(r) for r in row]

        artigos = {}
        nodes_authors = set()
        nodes_authors_solos = set()
        nodes_papers = set()
        links = []

        for c in coauts:
            if c['id_producao'] not in artigos:
                artigos[c['id_producao']] = []
            artigos[c['id_producao']].append(c['nm_autor'])

        if autor != 'todos':
            for c in coauts:
                if str(c['id_autor']) in autor:
                    nodes_papers.add(c['id_producao'])
        else:
            for c in coauts:
                nodes_papers.add(c['id_producao'])

        for k, v in artigos.items():
            if len(v) == 1:
                if k in nodes_papers:
                    nodes_papers.remove(k)

        for c in coauts:
            if c['id_producao'] in nodes_papers:
                nodes_authors.add(c['nm_autor'])
                links.append(
                    {'source': str(c['nm_autor']), 'target': str(c['id_producao'])})
            else:
                nodes_authors_solos.add(c['nm_autor'])

        nodes_authors_solos = nodes_authors_solos.difference(nodes_authors)

        grafo = {'nodes': [], 'links': links}

        for n in nodes_authors:
            grafo['nodes'].append({'id': str(n), 'group': 'authors'})
        for n in nodes_authors_solos:
            grafo['nodes'].append({'id': str(n), 'group': 'authors_solo'})
        for n in nodes_papers:
            grafo['nodes'].append({'id': str(n), 'group': 'papers'})

        return grafo
    
    @tratamento_excecao_db_ppg()
    def retorna_producoes_do_professor(self, id: str, anoi: int, anof: int, db: DBConnector = None):
        """
        Retorna todas as produções do professor por anos
        
        Paramêtros:
            Id(str): IdLattes do Professor
            anoi(str): Ano de início
            anof(str): Ano Final
            db(class): DataBase
        """
        query = """SELECT
                        tipo,
                        dados
                    FROM lattes_producao_bibliografica
                    WHERE num_identificador = %(id)s
                    UNION ALL
                    SELECT
                        tipo,
                        dados
                    FROM lattes_producao_tecnica
                    WHERE num_identificador = %(id)s
                    UNION ALL
                    SELECT
                        tipo,
                        dados
                    FROM lattes_outra_producao
                    WHERE num_identificador = %(id)s"""
        row = db.fetch_all(query, id=id)
        prods = [dict(r) for r in row]

        contagens = {}


        for prod in prods:
            if prod['tipo'] not in contagens and 'ORIENTACOES' not in prod['tipo'] and 'APRESENTACAO-DE-TRABALHO' not in prod['tipo']:
                contagens[prod['tipo']] = 0
                for dado in prod['dados']:
                    dado_key = [k for k in dado.keys() if 'DADOS' in k][0]
                    ano_key = [a for a in dado[dado_key].keys() if 'ANO' in a][0]
                    try:
                        if dado[dado_key][ano_key] != '' and anoi <= int(dado[dado_key][ano_key]) <= anof:
                            contagens[prod['tipo']] += 1
                    except:
                        pass
        

        prods = []
        for k, v in contagens.items():
            p = {'subtipo': k, 'qdade': v}
            if v > 0:
                prods.append(p)

        return prods
    
    @tratamento_excecao_db_ppg()
    def retorna_dados_de_projetos(self, id: str, anoi: int, anof: int, db: DBConnector = None):
        query = """with qprojetos as (select ano_inicio, nm_projeto as nome, situacao,  num_doutorado, num_mestrado, num_graduacao,
                        CASE WHEN producoes IS NULL OR jsonb_typeof(producoes) = 'null' OR (producoes = '[]') THEN 0 ELSE 1 END as producao from lattes_projetos as lp
                    inner join lattes_docentes as ld on (ld.num_identificador = lp.num_identificador)
                        where lp.num_identificador = any (
														
                                select lattes as num_identificador from pessoas as p 
								inner join coleta_docentes as cd on (cd.id_pessoa = p.id_pessoa and cd.id_programa = (select id_programa from programas where codigo_programa = %(id)s))
                                
                            ) and natureza = 'PESQUISA' and ano_inicio >= %(anoi)s and ano_inicio <= %(anof)s
                            group by ano_inicio, nm_projeto, situacao,  num_doutorado, num_mestrado, num_graduacao, producao
                            order by ano_inicio)

                    select ROW_NUMBER() OVER (ORDER BY (SELECT 1)) AS id, * from qprojetos"""
        row = db.fetch_all(query, id=id, anof=anof, anoi=anoi)
        projetos = [dict(r) for r in row]

        nos =     [{'name':f"projeto{projetos[i]['id']}",'titulo': projetos[i]['nome'],'category':'projeto'} for i in range(0, len(projetos))]
        nos.append({'name':'doutorado','category':'tipo aluno'})
        nos.append({'name':'mestrado','category':'tipo aluno'})
        nos.append({'name':'graduação','category':'tipo aluno'})
        nos.append({'name':'com produção','category':'producao'})
        nos.append({'name':'sem produção','category':'producao'})
        nos.append({'name':'concluído','category':'finalizacao'})
        nos.append({'name':'em andamento','category':'finalizacao'})
        nos.append({'name':'desativado','category':'finalizacao'})
        links = []
        for proj in projetos:
            ultimo = -1
            tipo_aluno = f"projeto{proj['id']}"
            flag = True
            aluno_doutorado = ''
            aluno_mestrado = ''
            aluno_graduacao = ''

            if proj['num_doutorado'] > 0:
                links.append({"source":f"projeto{proj['id']}","target":'doutorado',"value":proj['num_doutorado']})
                flag = False
                aluno_doutorado = 'doutorado'
                
            if proj['num_mestrado'] > 0:
                links.append({"source":f"projeto{proj['id']}","target":"mestrado","value":proj['num_mestrado']})
                flag = False
                aluno_mestrado = "mestrado"
                
            if proj['num_graduacao'] > 0:
                links.append({"source":f"projeto{proj['id']}","target":"graduação","value":proj['num_graduacao']})
                flag = False
                aluno_graduacao = "graduação"                

            if proj['producao'] > 0:
                if flag:
                    links.append({"source":tipo_aluno,"target":"com produção","value":1})
                else:
                    if aluno_graduacao != '':
                        links.append({"source":'graduação',"target":"com produção","value":1})
                    if aluno_mestrado != '':
                        links.append({"source":'mestrado',"target":"com produção","value":1})
                    if aluno_doutorado != '':
                        links.append({"source":'doutorado',"target":"com produção","value":1})

                ultimo = "com produção"
            else:
                if flag:
                    links.append({"source":tipo_aluno,"target":"sem produção","value":1})
                else:
                    if aluno_graduacao != '':
                        links.append({"source":'graduação',"target":"sem produção","value":1})
                    if aluno_mestrado != '':
                        links.append({"source":'mestrado',"target":"sem produção","value":1})
                    if aluno_doutorado != '':
                        links.append({"source":'doutorado',"target":"sem produção","value":1})

                ultimo = "sem produção"

            if proj['situacao'] == 'EM_ANDAMENTO':
                links.append({"source":ultimo,"target":'em andamento',"value":1})
            elif proj['situacao'] == 'CONCLUIDO':
                links.append({"source":ultimo,"target":'concluído',"value":1})
            elif proj['situacao'] == 'DESATIVADO':
                links.append({"source":ultimo,"target":'desativado',"value":1})


        return {'nodes': nos, 'links':links}
    
    @tratamento_excecao_db_ppg()
    def retorna_dados_de_linhas_de_pesquisa(self, id: str, anoi: int, anof: int, db: DBConnector = None):
        query1 = """select ctp.tipo as source, cstp.sub_tipo as target, count(*) as value from coleta_producoes as cp
			inner join coleta_sub_tipo_producao as cstp on (cstp.id = cp.id_sub_tipo_producao)
			inner join coleta_tipo_producao as ctp on (ctp.id = cp.id_tipo_producao)
            where id_programa = (select id_programa from programas where codigo_programa = %(id)s) and cp.ano >= %(anoi)s and cp.ano <= %(anof)s
            group by ctp.tipo, cstp.sub_tipo"""
        query2 = """select cstp.sub_tipo as source, CASE WHEN nome_linha_pesquisa IS NULL OR nome_linha_pesquisa = 'null' OR (nome_linha_pesquisa = '') THEN 'NÃO INFORMADO' ELSE nome_linha_pesquisa END as target, count(*) as value from coleta_producoes as cp 
			inner join coleta_sub_tipo_producao as cstp on (cstp.id = cp.id_sub_tipo_producao)
            where id_programa = (select id_programa from programas where codigo_programa = %(id)s) and cp.ano >= %(anoi)s and cp.ano <= %(anof)s
            group by cstp.sub_tipo, nome_linha_pesquisa"""
        
        row = db.fetch_all(query1, id=id, anof=anof, anoi=anoi)
        producao = [dict(r) for r in row]

        links = []

        for prod in producao:
            if 'BIBLIO' in prod['source']:
                prod['source'] = 'BIBLIOGRAFICA'
            elif 'CNICA' in prod['source']:
                prod['source'] = 'TECNICA'

        nodes_items = list(set([prod['source'] for prod in producao]))
        nodes = []
        for n in nodes_items:
            nodes.append({'name':n, 'category':'tipo'})

        for prod in producao:
            links.append({"source":prod['source'],"target":prod['target'],"value":prod['value']})

        row = db.fetch_all(query2, id=id, anof=anof, anoi=anoi)
        producao = [dict(r) for r in row]

        nodes_items = list(set([prod['source'] for prod in producao]))
        for n in nodes_items:
            nodes.append({'name':n, 'category':'subtipo'})

        nodes_items = list(set([prod['target'] for prod in producao]))
        for n in nodes_items:
            nodes.append({'name':n, 'category':'linha'})


        
        for prod in producao:
            links.append({"source":prod['source'],"target":prod['target'],"value":prod['value']})


        return {'nodes': nodes, 'links':links}

    #* Bancas
    
    @tratamento_excecao_db_ppg()
    def retorna_levantemento_externos_em_bancas(self, id: str, anoi: int, anof: int, db: DBConnector = None):
        query = """with qqext as (select distinct cdpt.dados->>'id' as id, d."idPessoa" as idpessoa, 
			   d."categoria", d."nomePessoa" as nome, qq.ano
                    FROM coleta_detalhamento_producao_tcc as cdpt
                    INNER JOIN (select id_producao, ano from coleta_producoes where 
                    id_programa = (select id_programa from programas where codigo_programa = %(id)s)
                    and id_tipo_producao = 2 and ano >= %(anoi)s and ano <= %(anof)s
                    order by ano) as qq ON qq.id_producao = cdpt.id_producao
                    join lateral jsonb_to_recordset(cdpt.dados->'banca') as d("idPessoa" text, "categoria" text, "nomePessoa" text) on true
                    where d."categoria" = 'Participante externo')

                    select qqext.ano, p.id_pessoa, qqext.nome, p.nome_pais_pessoa, p.pais_ies_titulacao, p.grau_academico, trim(p.nome_area_titulacao) as nome_area_titulacao, STRING_AGG (cd.id_programa, ',') as ppgs, STRING_AGG (cast(cd.tipo_categoria as text), ',') as categorias from qqext
                    inner join pessoas as p on p.id_pessoa = qqext.idpessoa
                    left join coleta_docentes as cd on cd.id_pessoa = p.id_pessoa and qqext.ano = cd.ano
                    group by qqext.ano, p.id_pessoa, qqext.nome, p.nome_pais_pessoa, p.pais_ies_titulacao, p.grau_academico, p.nome_area_titulacao
                    order by qqext.ano"""
        row = db.fetch_all(query, id=id, anoi=anoi, anof=anof)
        bancas = [dict(r) for r in row]

        pais_origem = {}
        pais_titulacao = {}
        grau_academico = {}
        area_titulacao = {}
        participa_ppg = {'Sim':0, 'Não':0}
        tipo_participacao_ppg = {'Permanente':0, 'Colaborador':0, 'Visitante':0, 'Nenhum':0}
        for b in bancas:
            if b['nome_pais_pessoa'] not in pais_origem:
                pais_origem[b['nome_pais_pessoa']] = 1
            else:
                pais_origem[b['nome_pais_pessoa']] += 1
            
            if b['pais_ies_titulacao'] not in pais_titulacao:
                pais_titulacao[b['pais_ies_titulacao']] = 1
            else:
                pais_titulacao[b['pais_ies_titulacao']] += 1

            if b['grau_academico'] not in grau_academico:
                grau_academico[b['grau_academico']] = 1
            else:
                grau_academico[b['grau_academico']] += 1

            if b['nome_area_titulacao'] == '':
                b['nome_area_titulacao'] = 'Não informado'

            if b['nome_area_titulacao'] not in area_titulacao:
                area_titulacao[b['nome_area_titulacao']] = 1
            else:
                area_titulacao[b['nome_area_titulacao']] += 1

            if b['ppgs'] == None or b['ppgs'] == 'null' or b['ppgs'] == '':
                participa_ppg['Não'] += 1
            else:
                participa_ppg['Sim'] += 1

            if b['categorias']:
                if '3' in b['categorias']:
                    tipo_participacao_ppg['Permanente'] += 1
                elif '2' in b['categorias']:
                    tipo_participacao_ppg['Visitante'] += 1
                elif '1' in b['categorias']:
                    tipo_participacao_ppg['Colaborador'] += 1
            else:
                tipo_participacao_ppg['Nenhum'] += 1

        query = """select cdpt.dados->>'id' as id, string_agg(d."categoria",',') as banca, qq.ano
                    FROM coleta_detalhamento_producao_tcc as cdpt
                    INNER JOIN (select id_producao, ano from coleta_producoes where 
                    id_programa = (select id_programa from programas where codigo_programa = %(id)s)
                    and id_tipo_producao = 2 and ano >= %(anoi)s and ano <= %(anof)s
                    order by ano) as qq ON qq.id_producao = cdpt.id_producao
                    join lateral jsonb_to_recordset(cdpt.dados->'banca') as d("idPessoa" text, "categoria" text, "nomePessoa" text) on true
                    group by cdpt.dados->>'id', qq.ano"""

        row = db.fetch_all(query, id=id, anoi=anoi, anof=anof)
        bancas = [dict(r) for r in row]

        contagem_externos = 0
        contagem_internos = 0

        for b in bancas:
            contagem_externos += b['banca'].count('Participante externo')
            contagem_internos += b['banca'].count('Docente')

        return {'pais_origem': dict(sorted(pais_origem.items(), key=lambda item: item[1], reverse=True)) , 'pais_titulacao': dict(sorted(pais_titulacao.items(), key=lambda item: item[1], reverse=True)) , 
                'grau_academico': grau_academico, 'area_titulacao': dict(sorted(area_titulacao.items(), key=lambda item: item[1], reverse=True)), 'participa_ppg': participa_ppg,
                'tipo_participacao_ppg': tipo_participacao_ppg, 'quantidade_externos':contagem_externos, 'quantidade_internos': contagem_internos, 'quantidade_bancas': len(bancas)}

    @tratamento_excecao_db_ppg()
    def retorna_media_dados_de_produtos_por_tcc_nacional(self, id: str, anoi: int, anof: int, db: DBConnector = None):
        # query1 = """
        #     select tp_producao as source, subtipo as target, count(*) as value from producoes 
        #     where id_programa = %(id)s and ano_publicacao >= %(anoi)s and ano_publicacao <= %(anof)s
        #     group by tp_producao, subtipo"""
        query1 = """with qppgs as (select id_producao, cp.ano, p.codigo_programa from coleta_producoes as cp
                    inner join programas as p on 
                            p.id_programa = cp.id_programa
                    where id_sub_tipo_producao = 12 and
                        cp.id_programa != %(id)s and
                        p.programa_em_rede != 1 and
                        p.situacao ilike '%%FUNCIONAMENTO%%' and p.modalidade = (select modalidade from programas where codigo_programa = %(id)s) and
                        p.conceito = (select conceito from programas where codigo_programa = %(id)s) and
                        p.nome_area_avaliacao = (select nome_area_avaliacao from programas where codigo_programa = %(id)s) 
                        and ano >= %(anoi)s and ano <= %(anof)s
                    group by id_producao, cp.ano, p.codigo_programa
                    order by ano)

                    select qppgs.ano, qppgs.codigo_programa, qppgs.id_producao, dados->'producoesAssociadas' as producoes from coleta_detalhamento_producao_tcc as cdptcc
                    inner join qppgs on qppgs.id_producao = cdptcc.id_producao
                    group by qppgs.ano, qppgs.codigo_programa, qppgs.id_producao, producoes
                    order by qppgs.ano"""
        
        row = db.fetch_all(query1, id=id, anof=anof, anoi=anoi)
        producoes = [dict(r) for r in row]

        produtos = {}
        for ano in range(anoi, anof+1):
            for prod in producoes:
                if prod['ano'] == ano:
                    if ano not in produtos:
                        produtos[ano] = {}
                    if prod['codigo_programa'] not in produtos[ano]:
                        produtos[ano][prod['codigo_programa']] = {'Nenhum':0, 'Apenas bibliográficos': 0, 'Apenas técnicos': 0, 'Técnicos + bibliograficos':0}
                    if prod['producoes']:
                        bibliograficas = False
                        tecnicas = False
                        for produto in prod['producoes']:
                            if produto:
                                if produto['nomeTipoProducao'] == 'BIBLIOGRÁFICA':
                                    bibliograficas = True
                                elif produto['nomeTipoProducao'] == 'TÉCNICA':
                                    tecnicas = True
                                
                        if bibliograficas and not tecnicas:
                            produtos[ano][prod['codigo_programa']]['Apenas bibliográficos'] += 1
                        elif tecnicas and not bibliograficas:
                            produtos[ano][prod['codigo_programa']]['Apenas técnicos'] += 1
                        elif tecnicas and bibliograficas:
                            produtos[ano][prod['codigo_programa']]['Técnicos + bibliograficos'] += 1
                    else:
                        produtos[ano][prod['codigo_programa']]['Nenhum'] += 1

        #return produtos
                
        # tccs_com_livros = {}

        # for ano, prod in produtos.items():
        #     if 'LIVRO' in prod:
        #         if ano not in tccs_com_livros:
        #             tccs_com_livros[ano] = 0
        #         tccs_com_livros[ano] += 1
        medias_producoes = {} 
        for ano, dados in produtos.items():
            if ano not in medias_producoes:
                medias_producoes[ano] = {'Nenhum (média)':0, 'Apenas bibliográficos (média)': 0, 'Apenas técnicos (média)': 0, 'Técnicos + bibliograficos (média)':0}
            cont = 0
            for prog, items in dados.items():
                medias_producoes[ano]['Nenhum (média)'] += items['Nenhum']
                medias_producoes[ano]['Apenas bibliográficos (média)'] += items['Apenas bibliográficos']
                medias_producoes[ano]['Apenas técnicos (média)'] += items['Apenas técnicos']
                medias_producoes[ano]['Técnicos + bibliograficos (média)'] += items['Técnicos + bibliograficos']
                cont += 1
            medias_producoes[ano]['Nenhum (média)'] /= cont
            medias_producoes[ano]['Apenas bibliográficos (média)'] /= cont
            medias_producoes[ano]['Apenas técnicos (média)'] /= cont
            medias_producoes[ano]['Técnicos + bibliograficos (média)'] /= cont


        return medias_producoes#, 'tccs_com_producoes': tccs_com_producoes, 'tccs_com_livros': tccs_com_livros}
   
    
    @tratamento_excecao_db_ppg()
    def retorna_dados_de_produtos_por_tcc(self, id: str, anoi: int, anof: int, db: DBConnector = None):
        # query1 = """
        #     select tp_producao as source, subtipo as target, count(*) as value from producoes 
        #     where id_programa = %(id)s and ano_publicacao >= %(anoi)s and ano_publicacao <= %(anof)s
        #     group by tp_producao, subtipo"""
        query1 = """with qppgs as (select id_producao, ano from coleta_producoes 
                    where id_sub_tipo_producao = 12 
                        and id_programa = (select id_programa from programas where codigo_programa = %(id)s)
                        and ano >= %(anoi)s and ano <= %(anof)s
                    group by id_producao, ano
                    order by ano)

                    select qppgs.ano, qppgs.id_producao, dados->'producoesAssociadas' as producoes from coleta_detalhamento_producao_tcc as cdptcc
                    inner join qppgs on qppgs.id_producao = cdptcc.id_producao
                    group by qppgs.ano, qppgs.id_producao, producoes
                    order by qppgs.ano"""
        
        row = db.fetch_all(query1, id=id, anof=anof, anoi=anoi)
        producoes = [dict(r) for r in row]

        query2 = """
            WITH qtotal AS (
                SELECT substring(cdp.valor, 2, 9) AS issn, p.nome_area_avaliacao
                FROM coleta_detalhamento_producao AS cdp
                INNER JOIN programas AS p ON p.codigo_programa = %(id)s
                WHERE item ILIKE '%%ISSN%%' AND cdp.id_producao IN %(ids)s
                GROUP BY issn, p.nome_area_avaliacao
            )

            SELECT qtotal.issn, nome_area_avaliacao, qualis 
            FROM capes_qualis_periodicos AS cqp
            INNER JOIN qtotal ON (qtotal.issn = cqp.issn AND trim(cqp.area) = trim(nome_area_avaliacao))
            GROUP BY qtotal.issn, nome_area_avaliacao, qualis
            ORDER BY qualis ASC;
            """

        produtos = {}
        tccs_com_producoes = {}
        for ano in range(anoi, anof+1):
            for prod in producoes:
                if prod['ano'] == ano:
                    if ano not in produtos:
                        produtos[ano] = {'total': 0}
                    if ano not in tccs_com_producoes:
                        tccs_com_producoes[ano] = {'Nenhum':0, 'Apenas bibliográficos': 0, 'Apenas técnicos': 0, 'Técnicos + bibliograficos':0, 'Periódicos':[]}
                    if prod['producoes']:
                        bibliograficas = False
                        tecnicas = False
                        for produto in prod['producoes']:
                            if produto:
                                if produto['nomeSubTipoProducao'] not in produtos[ano]:
                                    produtos[ano][produto['nomeSubTipoProducao']] = 0
                                produtos[ano][produto['nomeSubTipoProducao']] += 1
                                if produto['nomeSubTipoProducao'] == 'ARTIGO EM PERIÓDICO':
                                    tccs_com_producoes[ano]['Periódicos'].append(f"{produto['idProducao']}")
                                if produto['nomeTipoProducao'] not in produtos[ano]:
                                    produtos[ano][produto['nomeTipoProducao']] = 0
                                produtos[ano][produto['nomeTipoProducao']] += 1

                                if produto['nomeTipoProducao'] == 'BIBLIOGRÁFICA':
                                    bibliograficas = True
                                elif produto['nomeTipoProducao'] == 'TÉCNICA':
                                    tecnicas = True
                                
                            produtos[ano]['total'] += 1
                        if bibliograficas and not tecnicas:
                            tccs_com_producoes[ano]['Apenas bibliográficos'] += 1
                        elif tecnicas and not bibliograficas:
                            tccs_com_producoes[ano]['Apenas técnicos'] += 1
                        elif tecnicas and bibliograficas:
                            tccs_com_producoes[ano]['Técnicos + bibliograficos'] += 1
                    else:
                        tccs_com_producoes[ano]['Nenhum'] += 1
                
        tccs_com_qualis = {}
        tccs_com_livros = {}

        anos_validos = []

        for ano, prods in tccs_com_producoes.items():
            anos_validos.append(ano)
            if len(prods['Periódicos']) > 0:
                row = db.fetch_all(query2, id=id, ids=tuple(prods['Periódicos']))
                qualis = [dict(r) for r in row]
                if ano not in tccs_com_qualis:
                    tccs_com_qualis[ano] = {'A1':0,'A2':0,'A3':0,'A4':0,'B1':0,'B2':0,'B3':0,'B4':0, 'C':0}
                for q in qualis:
                    tccs_com_qualis[ano][q['qualis']] += 1

        for ano, prod in produtos.items():
            if 'LIVRO' in prod:
                if ano not in tccs_com_livros:
                    tccs_com_livros[ano] = 0
                tccs_com_livros[ano] += 1

        anos_validos.sort()
        anos_validos = list(set(anos_validos))

        medias = self.retorna_media_dados_de_produtos_por_tcc_nacional(id, anos_validos[0], anos_validos[-1])

        return {'medias': medias, 'produtos': produtos, 'tccs_com_producoes': tccs_com_producoes, 'tccs_com_qualis': tccs_com_qualis, 'tccs_com_livros': tccs_com_livros}
  
    
    @tratamento_excecao_db_ppg()
    def retorna_dados_de_tccs_por_linhas_de_pesquisa(self, id: str, anoi: int, anof: int, db: DBConnector = None):
        query1 = """select ctp.tipo as source, cstp.sub_tipo as target, count(*) as value from coleta_producoes as cp
			inner join coleta_sub_tipo_producao as cstp on (cstp.id = cp.id_sub_tipo_producao)
			inner join coleta_tipo_producao as ctp on (ctp.id = cp.id_tipo_producao)
            where id_programa = (select id_programa from programas where codigo_programa = %(id)s) and cp.ano >= %(anoi)s and cp.ano <= %(anof)s and cp.id_tipo_producao = 2
            group by ctp.tipo, cstp.sub_tipo"""
        query2 = """select cstp.sub_tipo as source, CASE WHEN nome_linha_pesquisa IS NULL OR nome_linha_pesquisa = 'null' OR (nome_linha_pesquisa = '') THEN 'NÃO INFORMADO' ELSE nome_linha_pesquisa END as target, count(*) as value from coleta_producoes as cp 
			inner join coleta_sub_tipo_producao as cstp on (cstp.id = cp.id_sub_tipo_producao)
            where id_programa = (select id_programa from programas where codigo_programa = %(id)s) and cp.ano >= %(anoi)s and cp.ano <= %(anof)s
            group by cstp.sub_tipo, nome_linha_pesquisa"""
        
        row = db.fetch_all(query1, id=id, anof=anof, anoi=anoi)
        producao_1 = [dict(r) for r in row]

        links = []

        targets = [prod['target'] for prod in producao_1]

        nodes_items = list(set([prod['source'] for prod in producao_1]))
        nodes = []
        for n in nodes_items:
            nodes.append({'name':n, 'category':'tipo'})

        for prod in producao_1:
            links.append({"source":prod['source'],"target":prod['target'],"value":prod['value']})

        row = db.fetch_all(query2, id=id, anof=anof, anoi=anoi)
        producao_2 = [dict(r) for r in row]

        nodes_items = list(set([prod['source'] for prod in producao_2 if prod['source'] in targets]))
        for n in nodes_items:
            nodes.append({'name':n, 'category':'subtipo'})

        nodes_items = list(set([prod['target'] for prod in producao_2]))
        for n in nodes_items:
            nodes.append({'name':n, 'category':'linha'})


        
        for prod in producao_2:
            if prod['source'] in targets:
                links.append({"source":prod['source'],"target":prod['target'],"value":prod['value']})


        return {'nodes': nodes, 'links':links}
    
    @tratamento_excecao_db_ppg()
    def retorna_dados_de_projetos_e_linhas_de_pesquisa(self, id: str, anoi: int, anof: int, db: DBConnector = None):
        query1 = """select CASE WHEN nome_projeto_pesquisa IS NULL OR nome_projeto_pesquisa = 'null' OR (nome_projeto_pesquisa = '') THEN 'NÃO INFORMADO' ELSE nome_projeto_pesquisa END as source, CASE WHEN nome_linha_pesquisa IS NULL OR nome_linha_pesquisa = 'null' OR (nome_linha_pesquisa = '') THEN 'NÃO INFORMADO' ELSE nome_linha_pesquisa END as target, count(*) as value from coleta_producoes as cp 
            where id_programa = (select id_programa from programas where codigo_programa = %(id)s) and cp.ano >= %(anoi)s and cp.ano <= %(anof)s
            group by nome_projeto_pesquisa, nome_linha_pesquisa"""
        
        row = db.fetch_all(query1, id=id, anof=anof, anoi=anoi)
        projetos = [dict(r) for r in row]

        links = []

        nodes_items = list(set([proj['source'] for proj in projetos]))

        nodes = []
        
        for n in nodes_items:
            if n == 'NÃO INFORMADO':
                nodes.append({'name':'Nenhum', 'category':'projeto'})
            else:
                nodes.append({'name':n, 'category':'projeto'})

        nodes_items = list(set([proj['target'] for proj in projetos]))
        for n in nodes_items:
            nodes.append({'name':n, 'category':'linha'})

        
        for proj in projetos:
            if proj['source'] == 'NÃO INFORMADO':
                links.append({"source":'Nenhum',"target":proj['target'],"value":50 if proj['value']>50 else proj['value']})
            else:
                links.append({"source":proj['source'],"target":proj['target'],"value":proj['value']})


        return {'nodes': nodes, 'links':links}

    #* Projetos
    
    #* Egressos
    
    @tratamento_excecao_db_ppg()
    def retorna_tempo_de_atualizacao_do_lattes_do_egresso(self, id: str, db: DBConnector = None):
        """
        Retorna a quantidade de tempo que o Perfi Lattes está desatualizado
        
        Paramêtros:
            id(str): Id Lattes do professor
            db(class): DataBase
        """
        query = """select dt_atualizacao from lattes_egressos
                    where idlattes = %(id)s"""
        row = db.fetch_one(query, id=id)

        tres_meses_atras = datetime.now() - timedelta(days=3 * 30)
        seis_meses_atras = datetime.now() - timedelta(days=6 * 30)
        oito_meses_atras = datetime.now() - timedelta(days=8 * 30)
        doze_meses_atras = datetime.now() - timedelta(days=12 * 30)

        if row:
            data = row[0]
            dt = data[0:2]+'-'+data[2:4]+'-'+data[4:]
            dt_format = '%d-%m-%Y'
            data = datetime.strptime(dt, dt_format)

            if data < doze_meses_atras:
                return '+12 meses'
            elif data < oito_meses_atras and data >= doze_meses_atras:
                return 'entre 8 e 12 meses'
            elif data < seis_meses_atras and data >= oito_meses_atras:
                return 'entre 6 e 8 meses'
            elif data < tres_meses_atras and data >= seis_meses_atras:
                return 'entre 3 e 6 meses'
            else:
                return 'menos de 2 meses'

        return ''
    
    
    @tratamento_excecao_db_ppg()
    def retorna_dados_egressos(self, id_ppg, ano_inicial, ano_final, db: DBConnector = None):
        query = f"""
                WITH idlattes_egressos AS (
                SELECT DISTINCT p.lattes
                FROM coleta_egressos AS ce
                INNER JOIN pessoas AS p ON (p.id_pessoa = ce.id_pessoa)
                INNER JOIN programas AS prog ON (prog.id_programa = ce.id_programa)
                WHERE ce.ano_egresso BETWEEN {ano_inicial}
                AND {ano_final}
                AND prog.codigo_programa = '{id_ppg}'
                )
                SELECT le.*
                FROM lattes_egressos as le where le.idlattes in (select * from idlattes_egressos) order by le.nome
        """
        # ultimo_ano = self.retorna_ultimo_ano_coleta(db) + 1
        rows = db.fetch_all(query)
        egressos = [dict(r) for r in rows]
        
        datalattes = {}
        
        dados_egressos = []
        try:
            for egresso in egressos:
                id_professor = egresso['idlattes']
                
                
                
                egresso_titulacao = egresso.pop('modalidade').replace(" ", "-")
                atuacao_antes = egresso.pop('atuacao_antes')
                atuacao_depois = egresso.pop('atuacao_depois')
                ano_egresso = egresso.pop('ano_egresso')
                
                
                if id_professor in datalattes:
                    datalattes[id_professor]['modalidades'][egresso_titulacao] = {'atuacao_antes':atuacao_antes, 'atuacao_depois':atuacao_depois, 'ano_egresso':ano_egresso}
                else:
                    # egresso['modalidades'] = {}
                    datalattes[id_professor] = {'modalidades':{} }
                    datalattes[id_professor]['modalidades'][egresso_titulacao] = {'atuacao_antes':atuacao_antes, 'atuacao_depois':atuacao_depois, 'ano_egresso':ano_egresso}
                    if atuacao_depois['local_trabalho'] == 'Não encontrado':
                        egresso['mudanca'] = "Sem mudança"
                    else:
                        egresso['mudanca'] = "Com mudança"
                    
                    dados_egressos.append(egresso)
                    
                datalattes[id_professor]['atualizacao_lattes'] = self.retorna_tempo_de_atualizacao_do_lattes_do_egresso(id_professor)
                
            # Ordenar os dados pela chave 'mudanca'
            dados_egressos_ordenado = sorted(dados_egressos, key=lambda egresso: egresso['mudanca'])

            
            return {'dados': dados_egressos_ordenado, 'lattes': datalattes}
        except Exception as error:
            print(error)
            
    @tratamento_excecao_db_ppg()
    def retorna_tempo_de_atualizacao_do_lattes_egressos(self, id: str, anoi: int, anof: int, db: DBConnector = None):
        """
        Retorna a quantidade de Perfis Lattes desatualizados por PPG
        
        Paramêtros:
            id(str): Id do PPG
            db(class): DataBase
        """
        query = """select dt_atualizacao, le.idlattes, nome from lattes_egressos as le
                    inner join (select ce.id_pessoa, p.lattes as lattes from coleta_egressos as ce
								inner join pessoas as p on (ce.id_pessoa = p.id_pessoa) where ce.id_programa = (select id_programa from programas where codigo_programa = %(id)s)
                    and ano_titulacao BETWEEN %(anoi)s and %(anof)s) as ids
                    on (le.idlattes = ids.lattes)
                    group by dt_atualizacao, le.idlattes, nome
					"""
        row = db.fetch_all(query, id=id, anoi=anoi, anof=anof)
        datas = [dict(r) for r in row]
        
        tres_meses_atras = datetime.now() - timedelta(days=3 * 30)
        seis_meses_atras = datetime.now() - timedelta(days=6 * 30)
        oito_meses_atras = datetime.now() - timedelta(days=8 * 30)
        doze_meses_atras = datetime.now() - timedelta(days=12 * 30)

        datas_lattes = {'até 2 meses': 0, '3 e 6 meses': 0,
                        '6 e 8 meses': 0, '8 e 12 meses': 0, '+12 meses': 0}

        for data in datas:
            dt = data['dt_atualizacao'][0:2]+'-' + \
                data['dt_atualizacao'][2:4]+'-'+data['dt_atualizacao'][4:]
            dt_format = '%d-%m-%Y'
            data['dt_atualizacao'] = datetime.strptime(dt, dt_format)

            if data['dt_atualizacao'] < doze_meses_atras:
                datas_lattes['+12 meses'] += 1
            elif data['dt_atualizacao'] < oito_meses_atras and data['dt_atualizacao'] >= doze_meses_atras:
                datas_lattes['8 e 12 meses'] += 1
            elif data['dt_atualizacao'] < seis_meses_atras and data['dt_atualizacao'] >= oito_meses_atras:
                datas_lattes['6 e 8 meses'] += 1
            elif data['dt_atualizacao'] < tres_meses_atras and data['dt_atualizacao'] >= seis_meses_atras:
                datas_lattes['3 e 6 meses'] += 1
            else:
                datas_lattes['até 2 meses'] += 1

            dicionario = [{'quantidade': datas_lattes['+12 meses'], 'legenda':'+12 meses'},
                          {'quantidade': datas_lattes['8 e 12 meses'],
                              'legenda':'8 e 12 meses'},
                          {'quantidade': datas_lattes['6 e 8 meses'],
                              'legenda':'6 e 8 meses'},
                          {'quantidade': datas_lattes['3 e 6 meses'],
                              'legenda':'3 e 6 meses'},
                          {'quantidade': datas_lattes['até 2 meses'], 'legenda':'até 2 meses'}]

        return dicionario

    @tratamento_excecao_db_ppg()
    def retorna_quantidade_egressos_titulados_por_ano(self, id: str, anoi: int, anof: int, db: DBConnector = None):
        # query = """select count(le.idlattes) as quantidade, ids.ano_titulacao from lattes_egressos as le
        # inner join (select ce.id_pessoa, p.lattes as lattes, p.ano_titulacao from coleta_egressos as ce
        # inner join pessoas as p on (ce.id_pessoa = p.id_pessoa) where ce.id_programa = (select id_programa from programas where codigo_programa = %(id)s)
        # and ano_titulacao >= %(anoi)s and ano_titulacao <= %(anof)s) as ids
        # on (le.idlattes = ids.lattes)
        # group by ids.ano_titulacao
        # """
        
        titulacao_grau = {}
        
        query_graus_academicos = """
        select distinct grau_academico from coleta_egressos where id_programa = (select id_programa from programas where codigo_programa = %(id)s)
        and ano_egresso BETWEEN %(anoi)s and %(anof)s
        """
        
        row_grau_academico = db.fetch_all(query_graus_academicos, id=id, anoi=anoi, anof=anof)
        
        grau_academico = [dict(r) for r in row_grau_academico]
        
        for grau in grau_academico:
            titulacao_grau[grau['grau_academico']] = []
        
        
        query = """select ano_egresso, count(id_pessoa) as quantidade, grau_academico from coleta_egressos where id_programa = (select id_programa from programas where codigo_programa = %(id)s)
        and ano_egresso BETWEEN %(anoi)s and %(anof)s
        group by ano_egresso, grau_academico order by ano_egresso"""
        
        row = db.fetch_all(query, id=id, anoi=anoi, anof=anof)
        datas = [dict(r) for r in row]
        
        for d in datas:
            titulacao_grau[d['grau_academico']].append({'ano_egresso' : d['ano_egresso'], 'quantidade': d['quantidade']})
        
        return titulacao_grau    

    @tratamento_excecao_db_ppg()
    def retorna_producoes_egresso(self, id: str, anoi:int, anof:int, db:DBConnector = None):
        query = """with t as (select p.lattes, ce.ano from coleta_egressos as ce inner join pessoas as p on (p.id_pessoa = ce.id_pessoa)
        inner join programas as prog on (prog.id_programa = ce.id_programa) 
        and ce.ano BETWEEN %(ano_inicial)s and %(ano_final)s where prog.codigo_programa = %(id_ppg)s)
        select distinct lattes_egressos.idlattes, t.ano from lattes_egressos inner join t on (t.lattes = lattes_egressos.idlattes)"""
        rows = db.fetch_all(query, id_ppg=id, ano_final=anof, ano_inicial=anoi)
        idlattes_egressos = [dict(r) for r in rows]
        datas = {}
        for row in idlattes_egressos:
            idlattes = row['idlattes']
            ano_titulacao = row['ano']
            datas[idlattes] = self.retorna_producoes_do_professor(idlattes, anoi, ano_titulacao)
        
        return datas
    
    # @tratamento_excecao_db_ppg()
    # def retorna_producoes_do_professor(self, id: str, anoi: int, anof: int, db: DBConnector = None):
    #     """
    #     Retorna todas as produções do professor por anos
        
    #     Paramêtros:
    #         Id(str): IdLattes do Professor
    #         anoi(str): Ano de início
    #         anof(str): Ano Final
    #         db(class): DataBase
    #     """
    #     query = """SELECT
    #                     tipo,
    #                     dados
    #                 FROM lattes_producao_bibliografica
    #                 WHERE num_identificador = %(id)s
    #                 UNION ALL
    #                 SELECT
    #                     tipo,
    #                     dados
    #                 FROM lattes_producao_tecnica
    #                 WHERE num_identificador = %(id)s
    #                 UNION ALL
    #                 SELECT
    #                     tipo,
    #                     dados
    #                 FROM lattes_outra_producao
    #                 WHERE num_identificador = %(id)s"""
    #     row = db.fetch_all(query, id=id)
    #     prods = [dict(r) for r in row]

    #     contagens = {}


    #     for prod in prods:
    #         if prod['tipo'] not in contagens and 'ORIENTACOES' not in prod['tipo'] and 'APRESENTACAO-DE-TRABALHO' not in prod['tipo']:
    #             contagens[prod['tipo']] = 0
    #             for dado in prod['dados']:
    #                 dado_key = [k for k in dado.keys() if 'DADOS' in k][0]
    #                 ano_key = [a for a in dado[dado_key].keys() if 'ANO' in a][0]
    #                 try:
    #                     if dado[dado_key][ano_key] != '' and anoi <= int(dado[dado_key][ano_key]) <= anof:
    #                         contagens[prod['tipo']] += 1
    #                 except:
    #                     pass
        

    #     prods = []
    #     for k, v in contagens.items():
    #         p = {'subtipo': k, 'qdade': v}
    #         if v > 0:
    #             prods.append(p)

    #     return prods
    
    
    @tratamento_excecao_db_ppg()
    def retorna_lista_programas(self, id_ies: str, db: DBConnector = None):
        """   
        Retorna todos os PPG de uma instituição
        
        Paramêtros:
            id_ies: Id da instituição
            db(class): DataBase
        """
        query = """select t3.codigo_programa as id, UPPER(t3.nome) as nome, t3.nome_area_avaliacao as area, t3.conceito as nota, t1.nome as nome_ies, t1.sigla as sigla_ies from instituicoes as t1 
                    inner join programas as t3 on t3.id_ies=t1.id_ies
					where t1.id_ies=%(id)s and t3.programa_em_rede != 1
					order by t3.nome"""
        row = db.fetch_all(query, id=id_ies)
        programas = [dict(r) for r in row]
        return programas
    
    @tratamento_excecao_db_ppg()
    def retorna_lista_docentes_do_ppg_do_ultimo_ano(self, id: str, db: DBConnector = None):
        """
        Retorna a lista de todos os docentes do ultimo ano de coleta
        """

        ano =  self.retorna_ultimo_ano_coleta()

        query = """select p.lattes as num_identificador, p.nome_pessoa as nome, ctv.vinculo as vinculo_ies, d.tipo_vinculo_ies, ldg.dados->'ENDERECO'->'ENDERECO-PROFISSIONAL'->>'@NOME-INSTITUICAO-EMPRESA' as ies from coleta_docentes as d
                    inner join pessoas as p on p.id_pessoa = d.id_pessoa
                    inner join coleta_tipo_vinculo_ies as ctv on ctv.id = d.tipo_vinculo_ies
                    inner join lattes_dados_gerais as ldg on ldg.num_identificador = p.lattes
                    where d.id_programa = (select id_programa from programas where codigo_programa = %(id)s) and d.ano = %(ano)s"""
        
        row = db.fetch_all(query, id=id, ano=ano)
        professores = [dict(r) for r in row]
        return professores

    @tratamento_excecao_db_ppg()
    def retorna_tempo_de_atualizacao_do_lattes_do_professor(self, id: str, db: DBConnector = None):
        """
        Retorna a quantidade de tempo que o Perfi Lattes está desatualizado
        
        Paramêtros:
            id(str): Id Lattes do professor
            db(class): DataBase
        """
        query = """select dt_atualizacao from lattes_docentes
                    where num_identificador = %(id)s"""
        row = db.fetch_one(query, id=id)

        um_mes_atras = datetime.now() - timedelta(days=1 * 30)
        tres_meses_atras = datetime.now() - timedelta(days=3 * 30)
        seis_meses_atras = datetime.now() - timedelta(days=6 * 30)
        oito_meses_atras = datetime.now() - timedelta(days=8 * 30)
        doze_meses_atras = datetime.now() - timedelta(days=12 * 30)

        if row:
            data = row[0]
            dt = data[0:2]+'-'+data[2:4]+'-'+data[4:]
            dt_format = '%d-%m-%Y'
            data = datetime.strptime(dt, dt_format)

            if data < doze_meses_atras:
                return '+12 meses'
            elif data < oito_meses_atras and data >= doze_meses_atras:
                return 'entre 8 e 12 meses'
            elif data < seis_meses_atras and data >= oito_meses_atras:
                return 'entre 6 e 8 meses'
            elif data < tres_meses_atras and data >= seis_meses_atras:
                return 'entre 3 e 6 meses'
            else:
                return 'menos de 2 meses'

        return ''
    
    @tratamento_excecao_db_ppg()
    def retorna_producoes_do_professor_totais(self, id: str, db: DBConnector = None):
        """
        Retorna todas as produções do professor por anos
        
        Paramêtros:
            Id(str): IdLattes do Professor
            anoi(str): Ano de início
            anof(str): Ano Final
            db(class): DataBase
        """
        query = """SELECT
                        tipo,
                        dados
                    FROM lattes_producao_bibliografica
                    WHERE num_identificador = %(id)s
                    UNION ALL
                    SELECT
                        tipo,
                        dados
                    FROM lattes_producao_tecnica
                    WHERE num_identificador = %(id)s
                    UNION ALL
                    SELECT
                        tipo,
                        dados
                    FROM lattes_outra_producao
                    WHERE num_identificador = %(id)s"""
        row = db.fetch_all(query, id=id)
        prods = [dict(r) for r in row]

        contagens = {}


        for prod in prods:
            if prod['tipo'] not in contagens and 'ORIENTACOES' not in prod['tipo'] and 'APRESENTACAO-DE-TRABALHO' not in prod['tipo']:
                contagens[prod['tipo']] = 0
                for dado in prod['dados']:
                    dado_key = [k for k in dado.keys() if 'DADOS' in k][0]
                    ano_key = [a for a in dado[dado_key].keys()
                            if 'ANO' in a][0]
                    contagens[prod['tipo']] += 1
        

        prods = []
        for k, v in contagens.items():
            p = {'subtipo': k, 'qdade': v}
            prods.append(p)

        return prods
    
    @tratamento_excecao_db_ppg()
    def retorna_lista_de_professores_atuais_para_ranking(self, id: str, db: DBConnector = None):
        """
        Retorna lista de professores por ano

        Paramêtros:
            Id(str): Id do PPG
            anoi(int): Ano de início
            anof(int): Ano final
            db(class): DataBase
        """

        professores = self.retorna_lista_docentes_do_ppg_do_ultimo_ano(id)

        producoes = {}
        avatares = {}
        datalattes = {}
       
        for p in professores:
            if 'nome' in p:
                id_professor = p['num_identificador']
                datalattes[id_professor] = self.retorna_tempo_de_atualizacao_do_lattes_do_professor(id_professor)
                producoes[id_professor] = self.retorna_producoes_do_professor_totais(id_professor)
                
                if id_professor:
                    avatares[id_professor] = self.retorna_link_avatar_lattes(id_professor, True)

        return {'professores': professores,'produtos': producoes, 'avatares': avatares, 'datalattes': datalattes}
  
    @tratamento_excecao_db_ppg()
    def retorna_dados_home(self, id_ies: str, db: DBConnector = None):
        """   
        Retorna todos os PPG de uma instituição
        
        Paramêtros:
            id_ies: Id da instituição
            db(class): DataBase
        """
        programs = self.retorna_lista_programas(id_ies)
        
        lista = []
        for prog in programs:
            try:
                lista.append(self.retorna_lista_de_professores_atuais_para_ranking(prog['id']))
            except:
                print('Erro ao tentar recuperar a lista de professores atuais.')
                pass

        professores = {}
        for l in lista:
            for prof in l['professores']:
                professores[prof['num_identificador']] = {'nome': prof['nome'], 
                                                          'ies': prof['ies'] if prof['ies']!='' and prof['ies']!=None else programs[0]['nome_ies'] if prof['tipo_vinculo_ies'] == 1 else 'Informação não encontrada', 
                                                          'vinculo_ies': prof['vinculo_ies'],
                                                          'sigla_ies_vinculo': programs[0]['sigla_ies']}

        for l in lista:
            for prof in l['avatares'].keys():
                professores[prof]['avatar'] = l['avatares'][prof]
        
        for l in lista:
            for prof in l['produtos'].keys():
                if 'produtos' not in professores[prof]:
                    professores[prof]['produtos'] = {}
                for subtipo in l['produtos'][prof]:
                    professores[prof]['produtos'][subtipo['subtipo']] = subtipo['qdade']

        
        dicionario_ordenado = dict(sorted(professores.items(), 
                                          key=lambda item: (item[1]['produtos']['ARTIGO-PUBLICADO'] if 'ARTIGO-PUBLICADO' in item[1]['produtos'] else 0, 
                                                            item[1]['produtos']['TRABALHO-EM-EVENTOS'] if 'TRABALHO-EM-EVENTOS' in item[1]['produtos'] else 0,
                                                            item[1]['produtos']['LIVROS-PUBLICADOS-OU-ORGANIZADOS'] if 'LIVROS-PUBLICADOS-OU-ORGANIZADOS' in item[1]['produtos'] else 0,
                                                            item[1]['produtos']['CAPITULOS-DE-LIVROS-PUBLICADOS'] if 'CAPITULOS-DE-LIVROS-PUBLICADOS' in item[1]['produtos'] else 0), reverse=True))

        return {'programas': programs, 'time':str(time.time()), 'ranking': dicionario_ordenado}

    @tratamento_excecao_db_ppg()
    def retorna_informacao_ppg(self, id: str, db: DBConnector = None):
        """        
        Retorna as informações do PPG
        
        Paramêtros:
            id(str): Id do PPG
            db(class): DataBase
        
        Retorno:
            dict: Contendo todas as informações do PPG
        """
        
        query = """select * from programas where codigo_programa = %(id)s"""
        row = db.fetch_one(query, id=id)
        #ret = [dict(r) for r in row]

        texto = ''
        if row:
            texto = f"""O programa de pós-graduação em {row['nome']} possui curso(s) de nível {row['grau']}, na modalidade {row['modalidade']}. 
                        O PPG foi criado em {row['ano_inicio']} e atualmente é coordenado por {row['nome_coordenador']}, é avaliado pela área {row['nome_area_avaliacao']}, 
                        área de conhecimento {row['nome_area_conhecimento']} e recebeu nota {row['conceito']} na última avaliação."""

            return {'info': texto, 'sigla_ies':row['sigla_ies'], 'nome':row['nome'], 'nota': row['conceito'], 'siglas': row['sigla_curso'], 'url': row['contato_url'], 'email':row['contato_email']}
        return None

    @tratamento_excecao_db_ppg()
    def retorna_lista_de_artigos_da_universidade(self, id_ies: str, ano: int, db: DBConnector = None):
        """
        Retornar a lista de artigos de toda a universidade considerando a base de dados lattes

        Parametros:
            Id(str): Id da IES
            ano(int): ano atual
            db(class): DataBase
        """

        query = """
            with query_ids as (
                    select STRING_AGG(DISTINCT ld.num_identificador, ',') as ids, 
                        issn, 
						doi,
                        titulo,                          
                        ano
                        from (select CONCAT(SUBSTRING(d."DETALHAMENTO-DO-ARTIGO"->>'@ISSN', 1, 4), '-', SUBSTRING(d."DETALHAMENTO-DO-ARTIGO"->>'@ISSN', 5)) as issn, 
							       d."DADOS-BASICOS-DO-ARTIGO"->>'@DOI' as doi,
                                    d."DADOS-BASICOS-DO-ARTIGO"->>'@TITULO-DO-ARTIGO' as titulo,
                                    cast(d."DADOS-BASICOS-DO-ARTIGO"->>'@ANO-DO-ARTIGO' as integer) as ano,
                                    num_identificador
                                from lattes_producao_bibliografica as lpb
                                join lateral jsonb_to_recordset(lpb.dados) as d("DETALHAMENTO-DO-ARTIGO" jsonb, "DADOS-BASICOS-DO-ARTIGO" jsonb) on true    
                                where lpb.tipo = 'ARTIGO-PUBLICADO' and 
                                    d."DETALHAMENTO-DO-ARTIGO"->>'@ISSN' != '' and 									  
                                    d."DADOS-BASICOS-DO-ARTIGO"->>'@ANO-DO-ARTIGO' = '%(ano)s'
                            ) as artigos_total
                        inner join lattes_docentes as ld on (ld.num_identificador = artigos_total.num_identificador)
                        group by issn, doi, titulo, ano
						order by titulo
                    )
                        
			select qids.ano, qids.issn, lower(qids.titulo) as nome_producao, qids.doi, STRING_AGG(DISTINCT prog.nome, ',') as programas  from query_ids as qids
					inner join pessoas as p on ids like '%%'||p.lattes||'%%'					
                    inner join coleta_docentes as dp on dp.id_pessoa = p.id_pessoa and dp.tipo_categoria = 3 and dp.ano = %(anocoleta)s
                    inner join programas as prog on prog.id_programa = dp.id_programa and prog.id_ies = %(id_ies)s
					group by qids.ano, qids.issn, qids.doi, nome_producao
					order by nome_producao
        """


        anocoleta = self.retorna_ultimo_ano_coleta()

        row = db.fetch_all(query, id_ies=id_ies, ano=ano, anocoleta=anocoleta)
        artigos = [dict(r) for r in row]
        for art in artigos:
            art['duplicado'] = 0
            art['id_dupl'] = -1
            art['programas'] = art['programas'].split(',')

        count_dupl = 0
        for art1 in artigos:
            if art1['nome_producao'] != '---FORA':
                if art1['id_dupl'] == -1:
                    art1['id_dupl'] = count_dupl
                    count_dupl += 1
                if art1['duplicado'] == 0:
                    for art2 in artigos:
                        if art2['duplicado'] == 0:
                            if art1 != art2:
                                similarity = jellyfish.jaro_winkler_similarity(art1['nome_producao'], art2['nome_producao'])
                                if similarity > 0.9 and (art1['ano'] == art2['ano']):
                                    if art1['issn'] == art2['issn'] or (art1['doi'] == art2['doi'] and art1['doi'] != ''):
                                        art1['duplicado'] = art2['duplicado'] = similarity
                                        art1['programas'].extend(art2['programas'])
                                        art1['programas'] = list(set(art1['programas']))
                                        art2['nome_producao'] = '---FORA'
                                        if art1['doi'] == '' and art2['doi'] != '':
                                            art1['doi'] = art2['doi']


        nova_lista = [dicionario for dicionario in artigos if dicionario['nome_producao'] != '---FORA']

        return nova_lista

    @tratamento_excecao_db_ppg()
    def retorna_grafo_de_coautores_por_subtipo(self, id_ies: str, produto: str, tipo: str, anoi: int, anof: int, db: DBConnector = None):
        """
        Retorna um grafo de coautorias por subtipo de todos os PPG's
        
        Paramêtros:
            Produto(str): Tipo do Produto
            anoi(str): Ano de início
            anof(str): Ano final
            db(class): DataBase
        """
        if produto == 'DESENVOLVIMENTO DE TÉCNICA E SERVIÇOS TÉCNICOS':
            where = "cstp.sub_tipo ilike 'DESENVOLVIMENTO DE TÉCNICA' or cstp.sub_tipo ilike 'SERVIÇOS TÉCNICOS'"
        else:
            where = "cstp.sub_tipo ilike %(produto)s"
        
        query = f"""select cp.nome_producao as id_producao, p.nome_pessoa as nm_autor, ca.ano as ano_publicacao, prog.codigo_programa as id_programa from coleta_autores as ca
                    inner join coleta_producoes as cp on (cp.id_producao = ca.id_producao and cp.id_programa = ca.id_programa)
                    inner join coleta_sub_tipo_producao as cstp on (cstp.id = cp.id_sub_tipo_producao and {where})
                    inner join pessoas as p on (p.id_pessoa = ca.id_pessoa)
                    inner join programas as prog on (prog.id_programa = ca.id_programa and prog.id_ies = %(id_ies)s)
                    where ca.ano >= %(anoi)s and ca.ano <= %(anof)s
                        and ca.tipo_vinculo = 3
                        group by cp.nome_producao, p.nome_pessoa, ca.ano, prog.codigo_programa
                        order by ca.ano ASC"""
        row = db.fetch_all(query, id_ies=id_ies, anoi=anoi, anof=anof, produto=produto)
        coauts = [dict(r) for r in row]

        artigos = {}
        nodes_authors = {}
        importance_authors = {}
        links = []

        links_count = {}

        for c in coauts:
            if c['id_producao'] not in artigos:
                artigos[c['id_producao']] = []
            artigos[c['id_producao']].append(c['nm_autor'])
            if c['nm_autor'] not in nodes_authors:
                nodes_authors[c['nm_autor']] = []
                importance_authors[c['nm_autor']] = 1
            nodes_authors[c['nm_autor']].append(c['id_programa'])

        for k, v in artigos.items():
            if len(v) > 1:
                comb = self.generates_combinations(v)
                for c in comb:
                    if (c[0], c[1]) not in links_count:
                        links_count[(c[0], c[1])] = 1
                    else:
                        links_count[(c[0], c[1])] += 1

        for k, v in links_count.items():
            links.append(
                {'source': str(k[0]), 'target': str(k[1]), 'value': v})
            if k[0] in importance_authors:
                importance_authors[k[0]] += 1
            if k[1] in importance_authors:
                importance_authors[k[1]] += 1

        grafo = {'nodes': [], 'links': links}

        programas_prp = utils.retorna_programas_ppg(id_ies,db)

        grupos = {}

        for k, v in nodes_authors.items():
            max = pd.Series(v).value_counts()
            importancia = 1
            if k in importance_authors:
                importancia = importance_authors[k]

            grupos[k] = programas_prp[max.idxmax()]
            grafo['nodes'].append({'id': k, 'group': max.idxmax(), 'nome': programas_prp[max.idxmax()], 'importancia': importancia})

        forca = -60

        #teste para diminuir o tamanho do grafo agrupando os docentes em programas
        if tipo == 'ppgs' or len(grafo['nodes']) > 1000:
            forca = -400
            importance_authors = {}
            grafo = {'nodes': [], 'links': []}
            nos_ppgs = list(set(grupos.values()))

            for k, v in links_count.items():
                if grupos[k[0]] != grupos[k[1]]:
                    if grupos[k[0]] not in importance_authors:
                        importance_authors[grupos[k[0]]] = 1
                    else:
                        importance_authors[grupos[k[0]]] += 1
                    if grupos[k[1]] not in importance_authors:
                        importance_authors[grupos[k[1]]] = 1
                    else:
                        importance_authors[grupos[k[1]]] += 1

                    grafo['links'].append({'source': grupos[k[0]], 'target': grupos[k[1]], 'value': 1})

            for e, g in enumerate(nos_ppgs):
                grafo['nodes'].append({'id': g, 'group': e, 'nome': g, 'importancia':  importance_authors[g] if g in importance_authors else 1})

        return grafo,forca

    @tratamento_excecao_db_ppg()
    def retorna_ranking_ppgs(self, id: str, anoi: int, anof: int, db: DBConnector = None):
        """
        Retorna a posição de PPG's de mesma área
        
        Paramêtros:
            id(str): Id do PPG
            anoi(int): Ano de início
            anof(int): Ano final
            db(class): DataBase
        """
        query = """
                select avg(cast(dados->>'indProd' as float)) as indProd, 
					p.nome,
					p.codigo_programa as id,
					i.sigla,
                    p.conceito as nota,
					m.nome as municipio,
					p.sigla_uf as uf,
					i.categoria_administrativa as status,
					m.latitude,
					m.longitude
                    from programas as p
                    inner join programas_historico as pb on (p.id_programa=pb.id_programa)
					inner join municipios as m on (m.nome = p.municipio)
					inner join instituicoes as i on (i.id_ies = p.id_ies)
					inner join estados as e on (e.codigo_uf = m.codigo_uf and e.uf = p.sigla_uf)
					where
					p.programa_em_rede != 1 and
                    p.situacao ilike '%%FUNCIONAMENTO%%' and p.modalidade = (select modalidade from programas where codigo_programa = %(id)s) and
                    p.conceito = (select conceito from programas where codigo_programa = %(id)s) and
					p.nome_area_avaliacao = (select nome_area_avaliacao from programas where codigo_programa = %(id)s) 
                    and pb.ano >= %(anoi)s and pb.ano <= %(anof)s
					group by p.nome,
					p.codigo_programa,
					i.sigla,
                    p.conceito,
					m.nome,
					p.sigla_uf,
					i.categoria_administrativa,
					m.latitude,
					m.longitude
					order by indprod DESC

                """
        row = db.fetch_all(query, anoi=anoi, anof=anof, id=id)
        progs = [dict(r) for r in row]
        menor = 10000
        maior = 0
        for ppg in progs:
            if ppg['indprod'] > maior:
                maior = ppg['indprod']
            if ppg['indprod'] < menor:
                menor = ppg['indprod']
                    
        return progs, maior, menor

    @tratamento_excecao_db_ppg()
    def retorna_indprod_medio_entre_ppgs_dada_nota(self, id: str, anoi: int, anof: int, nota: str | None, db: DBConnector = None):
        """
        Retorna indprod medio entre PPG's dada nota
        """
        if nota:
            query = """select avg(cast(dados->>'indProd' as float)) as indprod
                    from programas as p
                    inner join programas_historico as pb on (p.id_programa=pb.id_programa) where
                    p.situacao ilike '%%FUNCIONAMENTO%%' and 
					pb.ano >= %(anoi)s and pb.ano <= %(anof)s and
					p.conceito = %(nota)s and
					p.modalidade = (select modalidade from programas where codigo_programa = %(id)s) and
					p.nome_area_avaliacao = (select nome_area_avaliacao from programas where codigo_programa = %(id)s)"""
        else:
            query = """select avg(cast(dados->>'indProd' as float)) as indprod
                    from programas as p
                    inner join programas_historico as pb on (p.id_programa=pb.id_programa) where
                    p.situacao ilike '%%FUNCIONAMENTO%%' and 
					pb.ano >= %(anoi)s and pb.ano <= %(anof)s and
					p.conceito = (select conceito from programas where codigo_programa = %(id)s) and
					p.modalidade = (select modalidade from programas where codigo_programa = %(id)s) and
					p.nome_area_avaliacao = (select nome_area_avaliacao from programas where codigo_programa = %(id)s)"""
            
        row = db.fetch_one(query, anoi=anoi, anof=anof, id=id, nota=nota)
        return row[0]

    @tratamento_excecao_db_ppg()
    def retorna_popsitions_avg_ppg(self, id : str, anoi : int, anof : int):
        indprods, maior, menor  = self.retorna_ranking_ppgs(id, anoi, anof)
        media = self.retorna_indprod_medio_entre_ppgs_dada_nota(id, anoi, anof, None)
        media_maior = [0.0]
        if len(indprods) > 0:
            ncount = 0
            if indprods[0]['nota'] != 'A' and int(indprods[0]['nota']) < 7:
                media_maior[ncount] = self.retorna_indprod_medio_entre_ppgs_dada_nota(id, anoi, anof, str(int(indprods[0]['nota'])+(ncount+1)))
        return {'media':media, 'media_maior':media_maior, 'maior_indprod': maior, 'menor_indprod':menor, 'indprods':indprods}

queries_ppg = QueriesPPG()
