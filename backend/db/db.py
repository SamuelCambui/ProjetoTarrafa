from backend.core.config import settings

import psycopg2
import psycopg2.extras
import traceback

class DBConnector:
  dbconn = None
  
  def __init__(self, db_name, db_host, db_port, db_user, db_pass):
    try:
      if self.dbconn is None:
          self.dbconn = psycopg2.connect(
            host=db_host,
            port=db_port,
            database=db_name,
            user=db_user,
            password=db_pass
          )
    except Exception as err:
      print('DBCONNECTOR:', err)
      #self.__print_psycopg2_exception(err)
      self.dbconn = None
 
  def getCursor(self):
    if self.dbconn != None:
      return self.dbconn.cursor(cursor_factory=psycopg2.extras.DictCursor)
  
  def close(self):
    if self.dbconn != None:
      self.dbconn.close()

  def commit(self):
    if self.dbconn != None:
      self.dbconn.commit()

  def rollback(self):
    if self.dbconn != None:
      self.dbconn.rollback()

  def fetch_all(self, query, **kwargs):
    """
    Fetch all query lines
    
    Retorna todas as linhas da query passada
    
    Argumentos:
    
      query: Consulta que será realizada no Banco
      kwargs: As variáveis da consulta
    """
    cursor = self.getCursor()
    try:
      print("Executando query:", query)
      print("Com parâmetros:", kwargs)
      if kwargs:
        cursor.execute(query, kwargs)
      else:
          cursor.execute(query)
      rows = cursor.fetchall()
      print("Resultados:", rows)
      self.commit()
      return rows
    except Exception as err:
      print(err)
      self.rollback()
      return None
    finally:
      cursor.close()

  def fetch_one(self, query, **kwargs):
    """
    Fetch first query line
    
    Retorna a primeira linha da query passada
    
    Argumentos:
    
      query: Consulta que será realizada no Banco
      kwargs: As variáveis da consulta
    """
    cursor = self.getCursor()
    try:
      if kwargs:
        cursor.execute(query, kwargs)
      else:
        cursor.execute(query)
      row = cursor.fetchone()
      self.commit()
      return row
    except Exception as err:
      print('fetch_one:', err)
      self.rollback()
      return None
    finally:
      cursor.close()  
    
  def insert(self, query, **kwargs):
    """
    Insert into DataBase
    
    Realiza a inserção dos dados no Banco
    
    Argumentos:
    
      query: Consulta que será realizada no Banco
      kwargs: As variáveis da consulta
    """
    cursor = self.getCursor()
    try:
      if kwargs:
        cursor.execute(query, kwargs)
      else:
          cursor.execute(query)
      self.commit()
      return True
    except Exception as err:
      self.rollback()
      
      erro_traceback = traceback.format_exc()
      print(f"Erro ao executar a query: {query}");
      print(f"Parâmetros: {kwargs}");
      print(f"Erro: {erro_traceback}");
      return False
    finally:
      cursor.close()

  def delete(self, query, **kwargs):
    """    
    Realiza uma operação de delete no dados no Banco
    
    Argumentos:
    
      query: Consulta que será realizada no Banco
      kwargs: As variáveis da consulta
    """
    cursor = self.getCursor()
    try:
      if kwargs:
        cursor.execute(query, kwargs)
      else:
          cursor.execute(query)
      self.commit()
      return True
    except Exception as err:
      self.rollback()
      return False
    finally:
      cursor.close()
  
  def update(self, query, **kwargs):
    """
    Update in DataBase
    
    Realiza a atualização dos dados no Banco
    
    Argumentos:
    
      query: Consulta que será realizada no Banco
      kwargs: As variáveis da consulta
    """
    cursor = self.getCursor()
    try:
      if kwargs:
        cursor.execute(query, kwargs)
      else:
          cursor.execute(query)
      self.commit()
      return True
    except Exception as err:
      self.rollback()
      return False
    finally:
      cursor.close()


class DBConnectorPPG(DBConnector):
  def __init__(self, 
               db_name=settings.POSTGRES_DB_2, 
               db_host=settings.POSTGRES_HOST_2, 
               db_port=settings.POSTGRES_PORT, 
               db_user=settings.POSTGRES_USER, 
               db_pass=settings.POSTGRES_PASSWORD
              ):
    super().__init__(db_name, db_host, db_port, db_user, db_pass)


class DBConnectorGRAD(DBConnector):
  def __init__(self, 
               db_name=settings.POSTGRES_DB_GRAD, 
               db_host=settings.POSTGRES_HOST_2, 
               db_port=settings.POSTGRES_PORT, 
               db_user=settings.POSTGRES_USER, 
               db_pass=settings.POSTGRES_PASSWORD
              ):
    super().__init__(db_name, db_host, db_port, db_user, db_pass)

class DBConnectorGRADForm(DBConnector):
  def __init__(self, 
               db_name=settings.POSTGRES_DB_GRAD_FORM, 
               db_host=settings.POSTGRES_HOST_2, 
               db_port=settings.POSTGRES_PORT, 
               db_user=settings.POSTGRES_USER, 
               db_pass=settings.POSTGRES_PASSWORD
              ):
    super().__init__(db_name, db_host, db_port, db_user, db_pass)
