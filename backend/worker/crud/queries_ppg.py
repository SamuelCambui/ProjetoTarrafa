from backend.db.db import DBConnector
import jellyfish
from backend.core import utils
from backend.core.utils import tratamento_excecao_com_db, tratamento_excecao
from datetime import datetime
from typing import List
import time

class QueriesPPG():

    @tratamento_excecao_com_db()
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

    @tratamento_excecao
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
        
        row = db.fetch_all(query, id=id, anof=anof, anocoleta=anocoleta)
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

        # ultimo_ano_coleta = self.retorna_ultimo_ano_coleta(db) + 1
        
        # for a in range(anoi, ultimo_ano_coleta+1):
        #     if a == ultimo_ano_coleta:
        #         lista_permanente = self.retorna_lista_de_permanentes_do_ppg(id, a-1, db)
        #     else:
        #         lista_permanente = self.retorna_lista_de_permanentes_do_ppg(id, a, db)
        #     if lista_permanente:
        #         permanentes[a] = eval(lista_permanente)

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
            products_atual = self.retorna_contagem_de_qualis_do_lattes(id, a, ultimo_ano_coleta, db)

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

                #indProdArt = area['A1']*qualis['A1'] + area['A2']*qualis['A2'] + area['A3']*qualis['A3'] + area['A4']*qualis['A4'] + area['B1']*qualis['B1'] + area['B2']*qualis['B2'] + area['B3']*qualis['B3'] + area['B4']*qualis['B4']
                
                # indProdArt = 1*qualis['A1'] + 0.875*qualis['A2'] + 0.75*qualis['A3'] + 0.625*qualis['A4'] + 0.5*qualis['B1'] + 0.375*qualis['B2'] + 0.25*qualis['B3'] + 0.125*qualis['B4']
                # glosa = 0.25*qualis['B3'] + 0.125*qualis['B4']
                # if glosa > (0.2 * indProdArt):
                #     indProdArt = 1*qualis['A1'] + 0.875*qualis['A2'] + 0.75*qualis['A3'] + 0.625*qualis['A4'] + 0.5*qualis['B1'] + 0.375*qualis['B2'] + (0.2 * indProdArt)

                
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
    
queries_ppg = QueriesPPG()
