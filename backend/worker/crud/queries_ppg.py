from backend.db.db import DBConnector
import jellyfish
from backend.core import utils
from backend.core.utils import tratamento_excecao_com_db, tratamento_excecao
from datetime import datetime
from typing import List
import time

class QueriesPPG():

    @tratamento_excecao_com_db
    def retorna_id_ies(self, id: str, db: DBConnector = None):
        query = "select id_ies from programas where codigo_programa = %(id)s"
        row = db.fetch_one(query, id=id)
        if row:
            return row[0]
        return None
    
    @tratamento_excecao
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

    @tratamento_excecao
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
    
    @tratamento_excecao
    def retorna_ultimo_ano_coleta(self, db:DBConnector = None):
        """
        Retorna o ultimo ano de coleta da tabela programa_históricos
        """
        query = 'select max(ano) from (SELECT ano FROM programas_historico group by ano order by ano) as anos'
        
        row = db.fetch_one(query)
        if row:
            return row[0]
        return None

    @tratamento_excecao_com_db
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
        q = query.replace('%(id)s', f"'{id}'").replace('%(anocoleta)s', str(anocoleta)).replace('%(anof)s', str(anof))
        # row = db.fetch_all(query, id=id, anof=anof, anocoleta=anocoleta)
        row = db.fetch_all(q)
        products_atual = [dict(r) for r in row]
        return products_atual
    
    @tratamento_excecao
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

    @tratamento_excecao_com_db
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
        
        ultimo_ano_coleta = self.retorna_ultimo_ano_coleta(db)

        diferenca_anos = ano_atual - ultimo_ano_coleta
        
        for a in range(anoi, ultimo_ano_coleta+diferenca_anos+1):
            if a > ultimo_ano_coleta:
                lista_permanente = self.retorna_lista_de_permanentes_do_ppg(id, ultimo_ano_coleta, db)
            else:
                lista_permanente = self.retorna_lista_de_permanentes_do_ppg(id, a, db)
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
            products_atual, artigos_lattes = self.retorna_contagem_de_qualis_do_lattes_anonimo(id, a, ultimo_ano_coleta, db)

            artigos.extend(artigos_lattes)

            if products_atual and len(products_atual) > 0:
                products.extend(products_atual)
        
        products = sorted(products, key=lambda k: k['ano'])

        if listanegra is None:
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
  
    @tratamento_excecao_com_db
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
        
        ultimo_ano_coleta = self.retorna_ultimo_ano_coleta(db)

        diferenca_anos = ano_atual - ultimo_ano_coleta
        
        for a in range(anoi, ultimo_ano_coleta+diferenca_anos+1):
            if a > ultimo_ano_coleta:
                lista_permanente = self.retorna_lista_de_permanentes_do_ppg(id, ultimo_ano_coleta, db)
            else:
                lista_permanente = self.retorna_lista_de_permanentes_do_ppg(id, a, db)
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

        if listanegra is None:
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

            indprods_ext = self.retorna_indprods_medios_extratificados(id, anoi, anof, db)

            retorno = {'indprods': indprods, 'permanentes': contagem_permanentes, 'formula': formula}

            retorno.update(indprods_ext)

        end_time = time.time()  # Tempo final
        print(f"Tempo 6: {end_time - start_time} segundos")

        return {'indprod':retorno, 'indicadores':indicadores}
    
    @tratamento_excecao
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

        
        for i in range(3, nota_maxima+1):
            row = db.fetch_all(query, id=id, anof=anof, anoi=anoi, nota=str(i))
            indprods = [dict(r) for r in row]
            dictindprods[str(i)] = indprods
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
        dictindprods['pais'] = indprods
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
        dictindprods['regiao'] = indprods
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
    
    @tratamento_excecao_com_db
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

    @tratamento_excecao_com_db
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
    
    @tratamento_excecao_com_db
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

    
    @tratamento_excecao_com_db
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

    @tratamento_excecao
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
    

    @tratamento_excecao_com_db
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

        ultimo_ano_coleta = self.retorna_ultimo_ano_coleta(db) + 1
        
        for a in range(anoi, ultimo_ano_coleta+1):
            if a == ultimo_ano_coleta:
                lista_permanente = self.retorna_lista_de_permanentes_do_ppg(id, a-1, db)
            else:
                lista_permanente = self.retorna_lista_de_permanentes_do_ppg(id, a, db)
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

            indprods_ext = self.retorna_indprods_medios_extratificados_sem_dps(id, anoi, anof, db)

            retorno = {'indprods': indprods, 'permanentes': contagem_permanentes, 'formula': formula}

            retorno.update(indprods_ext)


        return {'indprod':retorno}

    @tratamento_excecao_com_db
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


    @tratamento_excecao_com_db
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
        
        ultimo_ano_coleta = self.retorna_ultimo_ano_coleta(db)

        diferenca_anos = ano_atual - ultimo_ano_coleta
        
        for a in range(anoi, ultimo_ano_coleta+diferenca_anos+1):
            if a > ultimo_ano_coleta:
                lista_permanente = self.retorna_lista_de_permanentes_do_ppg(id, ultimo_ano_coleta, db)
            else:
                lista_permanente = self.retorna_lista_de_permanentes_do_ppg(id, a, db)
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

    @tratamento_excecao_com_db
    def retorna_indori(self, id: str, anoi: int, anof: int, db: DBConnector  = None):
        """
        Retorna o IndOri a partir do anoi até o anof do PPG
        
        Paramêtros:
            id(str): Id do PPG
            anoi(int): Ano de início
            anof(int): Ano Final
            db(class): DataBase
        """
        query = """select * from metricas_indicadores_areas_avaliacao
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
    
    @tratamento_excecao_com_db
    def retorna_inddistori(self, id: str, anoi: int, anof: int, db: DBConnector  = None):
        """
        Retorna o Inddistori a partir do anoi até o anof do PPG
        
        Paramêtros:
            id(str): Id do PPG
            anoi(int): Ano de início
            anof(int): Ano Final
            db(class): DataBase
        """
        query = """select * from metricas_indicadores_areas_avaliacao
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
    
    @tratamento_excecao_com_db
    def retorna_indaut(self, id: str, anoi: int, anof: int, db: DBConnector  = None):
        """
        Retorna o Indaut a partir do anoi até o anof do PPG
        
        Paramêtros:
            id(str): Id do PPG
            anoi(int): Ano de início
            anof(int): Ano Final
            db(class): DataBase
        """
        query = """select * from metricas_indicadores_areas_avaliacao
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
    
    @tratamento_excecao_com_db
    def retorna_inddis(self, id: str, anoi: int, anof: int, db: DBConnector  = None):
        """
        Retorna o Inddis a partir do anoi até o anof do PPG
        
        Paramêtros:
            id(str): Id do PPG
            anoi(int): Ano de início
            anof(int): Ano Final
            db(class): DataBase
        """
        query = """select * from metricas_indicadores_areas_avaliacao
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
    
    @tratamento_excecao_com_db
    def retorna_partdis(self, id: str, anoi: int, anof: int, db: DBConnector  = None):
        """
        Retorna o partdis a partir do anoi até o anof do PPG
        
        Paramêtros:
            id(str): Id do PPG
            anoi(int): Ano de início
            anof(int): Ano Final
            db(class): DataBase
        """
        query = """select * from metricas_indicadores_areas_avaliacao
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
    
    @tratamento_excecao_com_db
    def retorna_indcoautoria(self, id: str, anoi: int, anof: int, db: DBConnector  = None):
        """
        Retorna o Indcoautoria a partir do anoi até o anof do PPG
        
        Paramêtros:
            id(str): Id do PPG
            anoi(int): Ano de início
            anof(int): Ano Final
            db(class): DataBase
        """
        query = """select * from metricas_indicadores_areas_avaliacao
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
        return {'indcoaut':coautorias,'indicadores':indicadores}
    
    @tratamento_excecao_com_db
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
    
    @tratamento_excecao_com_db
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

    @tratamento_excecao_com_db
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

    @tratamento_excecao_com_db
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

    @tratamento_excecao_com_db
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

    @tratamento_excecao_com_db
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
  
    @tratamento_excecao_com_db
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
    

queries_ppg = QueriesPPG()
