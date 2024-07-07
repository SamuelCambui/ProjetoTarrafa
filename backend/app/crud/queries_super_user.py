from backend.db.db import DBConnector
from backend.core import utils

from datetime import date, datetime, timedelta
from dateutil.relativedelta import relativedelta

class QueriesSuperUser():
    async def getLogacess(self, id:str, type: str, name:str, delimiter1:str, delimiter2:str, db: DBConnector):
        """
        Função responsável por retornar os logs de um certo intervalo de tempo
        """
        match type:
            case 'year': 
                delimiter1 = datetime.strptime(delimiter1, '%Y')
                delimiter2 = datetime.strptime(delimiter2, '%Y')
                if delimiter1 == delimiter2:
                    delimiter2 = delimiter2.date() + relativedelta(years=+1) - timedelta(days=1) #corrigindo intervaldo para a consulta
                    query = """select count(idlattes) as acessos, date_part('month', date) as momento from(select * from %(table_name)s where date BETWEEN %(delimiter1)s and %(delimiter2)s) as intervalo group by momento order by momento"""
                    d1 = delimiter1.month #Intervalo inicial do mes 
                    d2 = delimiter2.month #Intervalo final do mes
                    
                else:
                    query = """select count(idlattes) as acessos, date_part('year', date) as momento from(select * from %(table_name)s where date BETWEEN %(delimiter1)s and %(delimiter2)s) as intervalo group by momento order by momento"""
                    d1 = delimiter1.year #Intervalo inicial do ano selecionado 
                    d2 = delimiter2.year #Intervalo final do ano selecionado
                
            case 'month':
                delimiter1 = datetime.strptime(delimiter1, '%Y-%m')
                delimiter2 = datetime.strptime(delimiter2, '%Y-%m')
                if delimiter1 == delimiter2:
                    delimiter2 = delimiter2.date() + relativedelta(months=+1) - timedelta(days=1) #corrigindo intervaldo para a consulta
                    query = """select count(idlattes) as acessos, date_part('day', date) as momento from(select * from %(table_name)s where date BETWEEN %(delimiter1)s and %(delimiter2)s) as intervalo group by momento order by momento"""
                    d1 = delimiter1.day #Intervalo inicial do mes 
                    d2 = delimiter2.day #Intervalo final do mes
                    
                else:
                    if delimiter1.year == delimiter2.year:
                        query = """select count(idlattes) as acessos, date_part('month', date) as momento from(select * from %(table_name)s where date BETWEEN %(delimiter1)s and %(delimiter2)s) as intervalo group by momento order by momento"""
                        d1 = delimiter1.month #Intervalo inicial do ano selecionado 
                        d2 = delimiter2.month #Intervalo final do ano selecionado
                    else:
                        return await self.getLogAcessYears_Month(id, name, delimiter1, delimiter2, db)
                    
            case 'day':
                delimiter1 = datetime.strptime(delimiter1, '%Y-%m-%d')
                delimiter2 = datetime.strptime(delimiter2, '%Y-%m-%d')
                if delimiter1 == delimiter2:
                    query = """select count(idlattes) as acessos, date_part('hour', access_time) as momento from(select * from %(table_name)s where date BETWEEN %(delimiter1)s and %(delimiter2)s) as intervalo group by momento order by momento"""
                    d1 = 0 #Intervalo inicial de horas 
                    d2 = 23 #Intervalo final de horas
                    
                else:
                    if delimiter1.month == delimiter2.month:
                        query = """select count(idlattes) as acessos, date_part('day', date) as momento from(select * from %(table_name)s where date BETWEEN %(delimiter1)s and %(delimiter2)s) as intervalo group by momento order by momento"""
                        d1 = delimiter1.day #Intervalo inicial do ano selecionado 
                        d2 = delimiter2.day #Intervalo final do ano selecionado
                    else:
                        return await self.getLogAcessMonth_days(id, name, delimiter1, delimiter2, db)
               
        query = query.replace("%(table_name)s", f"log_{name}")
                    
        if id != 'all':
            query = query.replace("%(delimiter2)s", "%(delimiter2)s and ppg_id = %(id)s")
            rows = db.fetch_all(query, delimiter1 = delimiter1.strftime("%Y-%m-%d"), delimiter2 = delimiter2.strftime("%Y-%m-%d"), id = id)
        else:
            rows = db.fetch_all(query, delimiter1 = delimiter1.strftime("%Y-%m-%d"), delimiter2 = delimiter2.strftime("%Y-%m-%d"))

        ret = [dict(r) for r in rows]
        
        for e in range(d1, d2+1):
            inser = False
            for r in ret:
                if r['momento'] == e:
                    inser = True
            if inser == False:
                ret.append({'acessos':0, 'momento':e})

        if ret:
            ret = sorted(ret, key = lambda x:x['momento'])
            return ret


    async def getLogAcessYears_Month(self, id:str, name:str, delimiter1: datetime, delimiter2:datetime, db: DBConnector):
        """
        Função responsável por retornar o log de um certo intevalo de tempo, por mês, de anos diferentes
        """
        years = {}
        
        for i in range(delimiter1.year, delimiter2.year + 1):
            if i == delimiter1.year:
                query = "select count(idlattes) as acessos, date_part('Month', date) as momento from (select * from %(table_name)s where extract(YEAR from date) = %(year)s and EXTRACT(MONTH from date) > %(month)s) as ano_especifico group by momento order by momento;"
                d1 = month = delimiter1.month
                d2 = 12
            elif i == delimiter2.year:
                query = "select count(idlattes) as acessos, date_part('Month', date) as momento from (select * from %(table_name)s where extract(YEAR from date) = %(year)s and EXTRACT(MONTH from date) < %(month)s) as ano_especifico group by momento order by momento;"
                d1 = 1
                d2 = month = delimiter2.month
            else:
                query = "select count(idlattes) as acessos, date_part('Month', date) as momento from (select * from %(table_name)s where extract(YEAR from date) = %(year)s) as ano_especifico group by momento order by momento;"
                month = None
                d1 = 1
                d2 = 12
        
            query = query.replace("%(table_name)s", f"log_{name}")
            if id != 'all':
                query = query.replace("%(month)s", "%(month)s and ppg_id = %(id)s")
                if month:
                    rows = db.fetch_all(query, year = i, month = month, id = id)
                else:
                    rows = db.fetch_all(query, year = i, id = id)
            else:
                if month:
                    rows = db.fetch_all(query, year = i, month = month, id = id)
                else:
                    rows = db.fetch_all(query, year = i, id = id)
            
            ret = [dict(r) for r in rows]
            
            for e in range(d1, d2+1):
                inser = False
                for r in ret:
                    if r['momento'] == e:
                        inser = True
                if inser == False:
                    ret.append({'acessos':0, 'momento':e})

            if ret:
                ret = sorted(ret, key = lambda x:x['momento'])
                years[i] = ret
        
        return years
        
    async def getLogAcessMonth_days(self, id:str, name:str, delimiter1: datetime, delimiter2:datetime, db: DBConnector):
        """
        Função responsável por retornar o log de um certo intevalo de tempo, por dia, de meses diferentes
        """
        months = {}
        
        query = "select count(idlattes) as acessos, date_part('day', date) as momento from (select * from %(table_name)s where extract(MONTH from date) = %(month)s) as mes_especifico group by momento order by momento;"
        
        for i in range(delimiter1.month, delimiter2.month + 1):
            iteracao_mes = datetime.strptime(f"{delimiter1.year}-{i}", "%Y-%m")
            iteracao_mes = iteracao_mes.date() + relativedelta(years=+1) - timedelta(days=1)
            d1 = 1
            d2 = iteracao_mes.day
        
            query = query.replace("%(table_name)s", f"log_{name}")
            
            if id != 'all':
                query = query.replace("%(month)s", "%(month)s and ppg_id = %(id)s")
                rows = db.fetch_all(query, month = i, id = id)
            else:
                rows = db.fetch_all(query, month = i)
            
            ret = [dict(r) for r in rows]
            
            for e in range(d1, d2+1):
                inser = False
                for r in ret:
                    if r['momento'] == e:
                        inser = True
                if inser == False:
                    ret.append({'acessos':0, 'momento':e})

            if ret:
                ret = sorted(ret, key = lambda x:x['momento'])
                months[i] = ret
        
        return months

queries_super_user = QueriesSuperUser()