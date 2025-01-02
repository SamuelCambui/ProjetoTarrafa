from redis import Redis
from functools import wraps
from google.protobuf.json_format import ParseDict, MessageToDict
from protos.out import messages_pb2
import json
from grpc import ServicerContext
from backend.worker import crud
from backend.core.config import settings


def cache_grpc(response_type):
   def decorator(func):
      @wraps(func)
      def wrapper(self, request, context: ServicerContext):
         redis = RedisConnector()
         
         cache_key = f"{func.__name__}_" + "_".join(str(value) for _, value in request.ListFields())

         print(cache_key)
         universidade = request.id_ies
        
         
         try:
            print("id_ies: ", universidade)
            cached_result = redis.existsField(universidade, cache_key)
            if cached_result:
               print('Cache hit')
               res = redis.getField(universidade, cache_key)
               return ParseDict(res, response_type())
         except Exception as e:
            print(f"Error retrieving from cache: {e}")

         # Chamar a função original
         result = func(self, request, context)

         try:
            # Salvar o resultado no cache
            redis.setField(universidade, cache_key, MessageToDict(result))
            print('Cache set')
         except Exception as e:
            print(f"Error setting cache: {e}")

         return result
      return wrapper
   return decorator


def cache_grpc_ppg():
   return cache_grpc(messages_pb2.PpgResponse)

def cache_grpc_ppgls():
   return cache_grpc(messages_pb2.PPGLSResponse)
   
def cache_grpc_grad():
   return cache_grpc(messages_pb2.GradResponse)

def cache_redis_sync(func):
   @wraps(func)
   def wrapper(*args, **kwargs):
      """
      Anotação responsável por setar o retorno dos endpoints no redis
      """
      universidade = None
      if 'id' in kwargs:
         universidade = crud.queries_ppg.retorna_id_ies(kwargs['id'], kwargs['db'])
      if universidade is None:
         universidade = kwargs['current_user'].id_ies
      path = kwargs['request'].url.path
      try:
         ver = kwargs['redis'].existsField(universidade, path)
         if ver == 1:
            res = kwargs['redis'].getField(universidade, path)
            return res

         ret = func(*args, **kwargs)
         if ret:
            kwargs['redis'].setField(universidade, path, ret)
         
         return ret
      except Exception as err:
         raise err
   return wrapper

def cache_redis_async(func):
   @wraps(func)
   async def wrapper(*args, **kwargs):
      """
      Anotação responsável por setar o retorno dos endpoints no redis
      """
      universidade = None
      if 'id' in kwargs:
         universidade = crud.queries_ppg.retorna_id_ies(kwargs['id'], kwargs['db'])
      if universidade is None:
         universidade = kwargs['current_user'].id_ies
      path = kwargs['request'].url.path
      try:
         ver = kwargs['redis'].existsField(universidade, path)
         if ver == 1:
            print('recuperando do cache...')
            res = kwargs['redis'].getField(universidade, path)
            return res

         ret = await func(*args, **kwargs)
         if ret:
            print('inserindo o cache...')
            kwargs['redis'].setField(universidade, path, ret)
         
         return ret
      except Exception as err:
         raise err
   return wrapper

class Singleton:
  def __init__(self, klass):
    self.klass = klass
    self.instance = None
  def __call__(self, *args, **kwds):
    if self.instance == None:
      self.instance = self.klass(*args, **kwds)
    return self.instance

@Singleton
class RedisConnector:
   redisconn = None

   def __init__(self):
      try:
         if self.redisconn is None:
            self.redisconn = Redis(host=settings.LOCAL_REDIS_URL, port=settings.REDIS_PORT, encoding="utf-8", decode_responses=True)
               
      except Exception as err:
         print(err)
         self.redisconn = None

   def close(self):
      self.redisconn.close()

   def isConnected(self):
      """
      Retorna se o redis está conectado
      """
      try:
         if self.redisconn:
            return True
         return False
      except Exception as err:
         return err
   
   def exists(self, key):
      """
      Retorna se existe a chave no redis
      
      Argumentos:
         key: Chave que será verificada no redis
      """
      return self.redisconn.exists(key)
   
   def setKey(self, key, value, expiretime=None):
      try:
         self.redisconn.set(key, value)
         if expiretime:
            self.redisconn.expire(key, expiretime)
      except Exception as err:
         return err
      
   def getKey(self, key):
      try:
         return self.redisconn.get(key)
      except Exception as err:
         return None

   def getLenghQueue(self, queue):
      try:
         return self.redisconn.llen(queue)
      except Exception as err:
         return -1
      
   def incr(self, key):
      try:
         self.redisconn.incr(key)
      except Exception as err:
         return err

   def incrBy(self, key, valor):
      try:
         ret = self.redisconn.incrby(key, valor)
         return ret
      except Exception as err:
         print(err)
         return None

   def decr(self, key):
      try:
         self.redisconn.decr(key)
      except Exception as err:
         return err

   def decrBy(self, key, valor):
      try:
         ret = self.redisconn.decrby(key, valor)
         return ret
      except Exception as err:
         print(err)
         return None

   def push(self, fila, valor):
      try:
         return self.redisconn.rpush(fila, valor)
      except Exception as err:
         return -1

   def pop(self, fila):
      try:
         #pop bloqueante
         mensagem = self.redisconn.blpop(fila)
         return mensagem
      except Exception as err:
         print('erro no pop:', err)
         return None
   
   def set(self, key, mapping, expiretime):
      """
      Insere chave-valor com tempo de expiração redis
      
      Argumentos:
         key: Chave que será inserida no redis
         mapping: Valores que serão associados a chave
         expiretime: Tempo de expiração da chave
      """
      try:
         self.redisconn.hmset(key, mapping)
         self.redisconn.expire(key, expiretime)
      except Exception as err:
         return err

   def setJson(self, key, value, expiretime):
      """    
      Insere chave-valor com tempo de expiração usando Json
      
      Argumentos:
         key: Chave que será inserida no redis
         mapping: Valores que serão associados a chave
         expiretime: Tempo de expiração da chave
      """
      try:
         value_string = json.dumps(value)
         self.redisconn.set(key, value_string)
         self.redisconn.expire(key, expiretime)
      except Exception as err:
         return err

   def getJson(self, key):
      """
      Retorna o Json associado a chave
      
      Argumentos:
         key: Chave que irá retornar os valores
      """
      try:
         value_string = self.redisconn.get(key)
         return json.loads(value_string)
      except Exception as err:
         return err

   def getall(self, key):
      """    
      Retorna todos os valores associados a chave
      
      Argumentos:
         key: Chave que irá retornar os valores
      """
      try:
         return self.redisconn.hgetall(key)
      except Exception as err:
         return err
      
   def scan(self, key):
      """    
      Retorna todos os valores associados a um prefixo
      
      Argumentos:
         key: Chave que irá retornar os valores
      """
      try:
         cursor = 0
         keys = []
         while True:
            # Executar o comando SCAN para recuperar as chaves com o prefixo "usuario:"
            cursor, partial_keys = self.redisconn.scan(cursor, match=f'{key}*')

            # Adicionar as chaves parciais à lista de chaves
            keys.extend(partial_keys)

            # Se o cursor for 0, todas as chaves foram recuperadas
            if cursor == 0:
               break
         return keys
         
      except Exception as err:
         return err

   def getField(self, key, field):
      """  
      Retorna o valor do campo associado a uma chave
      
      Argumentos:
         key: Chave que irá retornar os valores
         field: Campo que irá retornar o valor
      """
      try:
         value_key = self.redisconn.hget(key, field)
         return json.loads(value_key)
      except Exception as err:
         return err

   def setField(self, key, field, value):
      """
      Inserindo campo-valor no redis
      
      Argumentos:
         key: Chave que será inserida no redis 
         field: Campo que será associado a chave
         value: Valor que será associado ao campo
      """
      try:
         value_string = json.dumps(value)
         ret = self.redisconn.hset(key, field, value_string)
         return ret
      except Exception as err:
         return err
      
   def existsField(self, key, field):
      """
      Retorna se existe o campo na chave
      
      Argumentos:
         key: Chave que será verificada no redis 
         field: Campo que será verificado na chave
      """
      try:
         return self.redisconn.hexists(key, field)
      except Exception as err:
         return err

   def deleteField(self, key, field):
      """
      Deleta um campo da chave
      
      Argumentos:
         key: Chave que terá um campo deletado
         field: Campo que será deletado da chave
      """
      try:
         return self.redisconn.hdel(key, field)
      except Exception as err:
         return err
      
   def deleteKey(self, key):
      """
      Deleta uma chave
      
      Argumentos:
         key: Chave que será apagada
      """
      try:
         return self.redisconn.delete(key)
      except Exception as err:
         return err
   
   def close(self):
      """
      Fecha a conexão com o redis
      """
      try:
         self.redisconn.close()
      except Exception as err:
         return err
