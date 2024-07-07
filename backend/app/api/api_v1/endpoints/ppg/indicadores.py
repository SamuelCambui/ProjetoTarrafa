from typing import Any

from fastapi import Request, BackgroundTasks

import traceback

import time

from fastapi import APIRouter, Depends, HTTPException
from backend.db.db import DBConnector

from backend.schemas.ppg import ListaNegra

from starlette.requests import Request
from backend.app import crud
from backend import schemas
from backend.core import deps, utils
from backend.db.db import DBConnector
from backend.db.cache import *

from celery import Celery
from celery.result import AsyncResult
from celery import shared_task
from celery import group
from backend.worker.queries import *

router = APIRouter()

@router.get("/indicadores_paralelo/{id}/{anoi}/{anof}")
##@cache_redis_async
async def indicadores_paralelo(
    *,
    id: str,
    anoi: int,
    anof: int,
    request: Request,
    #db: DBConnector = Depends(deps.get_db),
    current_user: schemas.User = Depends(deps.get_current_active_user),
    redis : RedisConnector = Depends(deps.get_redis),
    ) -> Any:
    try:
        retornos = {}
        tarefas = []
        print('Acumulando unica tarefas...')
        tarefas.append(tarefa_retorna_contagem_de_indprodart_com_listanegra.s(id, anoi, anof, None))
        #resp = crud.queries_ppg.retorna_contagem_de_indprodart_com_listanegra(id, anoi, anof, None,db)
        tarefas.append(tarefa_retorna_contagem_de_qualis_com_listanegra.s(id, anoi, anof, None))
        tarefas.append(tarefa_retorna_contagem_de_qualis_discentes.s(id, anoi, anof))
        tarefas.append(tarefa_retorna_estatisticas_de_artigos.s(id, anoi, anof))
        tarefas.append(tarefa_retorna_contagem_de_indprodart_extrato_superior_com_listanegra.s(id, anoi, anof, None))
        tarefas.append(tarefa_retorna_dados_posicoes.s(id, anoi, anof))
        tarefas.append(tarefa_retorna_tempos_de_conclusao.s(id, anoi, anof))
        tarefas.append(tarefa_retorna_quantidade_de_discentes_titulados.s(id, anoi, anof))
        tarefas.append(tarefa_retorna_indori.s(id, anoi, anof))
        tarefas.append(tarefa_retorna_inddistori.s(id, anoi, anof))
        tarefas.append(tarefa_retorna_indaut.s(id, anoi, anof))
        tarefas.append(tarefa_retorna_inddis.s(id, anoi, anof))
        tarefas.append(tarefa_retorna_partdis.s(id, anoi, anof))
        tarefas.append(tarefa_retorna_indcoautoria.s(id, anoi, anof))
        tarefas.append(tarefa_retorna_indori_medio.s(id, anoi, anof))
        tarefas.append(tarefa_retorna_inddistori_medio.s(id, anoi, anof))
        tarefas.append(tarefa_retorna_indaut_medio.s(id, anoi, anof))
        tarefas.append(tarefa_retorna_inddis_medio.s(id, anoi, anof))
        tarefas.append(tarefa_retorna_partdis_medio.s(id, anoi, anof))
        tarefas.append(tarefa_retorna_indcoautoria_medio.s(id, anoi, anof))

        print('Agrupando e disparando tarefas...')
        
        job = group(tarefas)
        result = job.apply_async()
        start_time = time.time()
        ret_values = result.get()
        print('Coletando resultados das tarefas...')
        end_time = time.time()  # Tempo final
        print(f"Tempo de execução  ret: {end_time - start_time} segundos")
        for result in ret_values:
            retornos.update(result)
        #retornos.update(resp)
        print('Retornando resultados.')
        return retornos
    except Exception as e:
        print(e)
        # await utils.log_erros(db, path_error = request.url.path, traceback = traceback.format_exc())
        raise HTTPException(status_code=400, detail="Erro ao tentar recuperar as informações de artigos qualis discentes do ppg.")
    

# Endpoint sem cache devido ser do tipo POST
@router.post("/artigosqualis/{id}/{anoi}/{anof}")
async def artigos_qualis_post(
    *,
    id: str,
    anoi: int,
    anof: int,
    lista_negra: ListaNegra,  #lista com docentes a serem removidos do gráfico (parâmetros de simulação)
    request: Request,
    db: DBConnector = Depends(deps.get_db),
    current_user: schemas.User = Depends(deps.get_current_active_user),
    redis : RedisConnector = Depends(deps.get_redis),
    ) -> Any:
    """
    Retorna um Json com as informações para o gráfico de artigos com Qualis filtrado pelos IDs dos docentes (lista_negra)
    
    Args:
        id: Id do PPG (codigo_do_programa)
        anoi: ano inicial
        anof: ano final
        lista_negra: lista com docentes a serem removidos do gráfico (parâmetros de simulação)
        request: necessário para o annotation @cache_redis
        db: DataBase, dependência da conexão com o banco
        current_user: dependência do usuário (ativo)
        redis: dependência de conexão com o redis
    """
    try:
        contagem = crud.queries_ppg.retorna_contagem_de_qualis_com_listanegra(id, anoi, anof, lista_negra.lista_negra, db)
        return contagem
    except Exception as e:
        print(e)
        await utils.log_erros(db, path_error = request.url.path, traceback = traceback.format_exc())
        raise HTTPException(status_code=400, detail="Erro ao tentar recuperar as informações de artigos qualis do ppg.")
    

# Mesmo endpoint sem a lista negra
@router.get("/artigosqualis/{id}/{anoi}/{anof}")
#@cache_redis_async
async def artigos_qualis_get(
    *,
    id: str,
    anoi: int,
    anof: int,
    request: Request,
    db: DBConnector = Depends(deps.get_db),
    current_user: schemas.User = Depends(deps.get_current_active_user),
    redis : RedisConnector = Depends(deps.get_redis),
    ) -> Any:
    """
    Retorna um Json com as informações para o gráfico de artigos com Qualis filtrado pelos IDs dos docentes (lista_negra)
    
    Args:
        id: Id do PPG (codigo_do_programa)
        anoi: ano inicial
        anof: ano final
        request: necessário para o annotation @cache_redis
        db: DataBase, dependência da conexão com o banco
        current_user: dependência do usuário (ativo)
        redis: dependência de conexão com o redis
    """
    try:
        contagem = crud.queries_ppg.retorna_contagem_de_qualis_com_listanegra(id, anoi, anof, None, db)
        return contagem
    except Exception as e:
        print(e)
        await utils.log_erros(db, path_error = request.url.path, traceback = traceback.format_exc())
        raise HTTPException(status_code=400, detail="Erro ao tentar recuperar as informações de artigos qualis do ppg.")
    

@router.get("/artigosqualisdiscente/{id}/{anoi}/{anof}")
#@cache_redis_async
async def artigos_qualis_discente_get(
    *,
    id: str,
    anoi: int,
    anof: int,
    request: Request,
    db: DBConnector = Depends(deps.get_db),
    current_user: schemas.User = Depends(deps.get_current_active_user),
    redis : RedisConnector = Depends(deps.get_redis),
    ) -> Any:
    """
    Retorna um Json com as informações para o gráfico de artigos com Qualis filtrado pelos IDs dos discentes
    
    Args:
        id: Id do PPG (codigo_do_programa)
        anoi: ano inicial
        anof: ano final
        request: necessário para o annotation @cache_redis
        db: DataBase, dependência da conexão com o banco
        current_user: dependência do usuário (ativo)
        redis: dependência de conexão com o redis
    """
    try:
        contagem = crud.queries_ppg.retorna_contagem_de_qualis_discentes(id, anoi, anof, db)
        return contagem
    except Exception as e:
        print(e)
        await utils.log_erros(db, path_error = request.url.path, traceback = traceback.format_exc())
        raise HTTPException(status_code=400, detail="Erro ao tentar recuperar as informações de artigos qualis discentes do ppg.")
    
@router.get("/estatisticasartigosdiscente/{id}/{anoi}/{anof}")
#@cache_redis_async
async def estatisticas_artigos_discente_get(
    *,
    id: str,
    anoi: int,
    anof: int,
    request: Request,
    db: DBConnector = Depends(deps.get_db),
    current_user: schemas.User = Depends(deps.get_current_active_user),
    redis : RedisConnector = Depends(deps.get_redis),
    ) -> Any:
    """
    Retorna um Json com as informações para o gráfico com estatisticas de publicacoes de artigos
    
    Args:
        id: Id do PPG (codigo_do_programa)
        anoi: ano inicial
        anof: ano final
        request: necessário para o annotation @cache_redis
        db: DataBase, dependência da conexão com o banco
        current_user: dependência do usuário (ativo)
        redis: dependência de conexão com o redis
    """
    try:
        contagem = crud.queries_ppg.retorna_estatisticas_de_artigos(id, anoi, anof, db)
        return contagem
    except Exception as e:
        print(e)
        await utils.log_erros(db, path_error = request.url.path, traceback = traceback.format_exc())
        raise HTTPException(status_code=400, detail="Erro ao tentar recuperar as informações de artigos qualis discentes do ppg.")

@router.get("/estatisticasartigosdiscente_correlatos/{id}/{anoi}/{anof}")
#@cache_redis_async
async def estatisticas_artigos_discente_correlatos_get(
    *,
    id: str,
    anoi: int,
    anof: int,
    request: Request,
    db: DBConnector = Depends(deps.get_db),
    current_user: schemas.User = Depends(deps.get_current_active_user),
    redis : RedisConnector = Depends(deps.get_redis),
    ) -> Any:
    """
    Retorna um Json com as informações para o gráfico com estatisticas de publicacoes de artigos de programas correlatos ao ppg alvo
    
    Args:
        id: Id do PPG alvo (codigo_do_programa)
        anoi: ano inicial
        anof: ano final
        request: necessário para o annotation @cache_redis
        db: DataBase, dependência da conexão com o banco
        current_user: dependência do usuário (ativo)
        redis: dependência de conexão com o redis
    """
    try:
        contagem = crud.queries_ppg.retorna_estatisticas_de_artigos_ppgs_correlatos(id, anoi, anof, db)
        return contagem
    except Exception as e:
        print(e)
        await utils.log_erros(db, path_error = request.url.path, traceback = traceback.format_exc())
        raise HTTPException(status_code=400, detail="Erro ao tentar recuperar as informações de artigos qualis discentes do ppg.")
    

# Endpoint sem cache devido ser do tipo POST
@router.post("/indprodart/{id}/{anoi}/{anof}")
async def indprodart_post(
    *,
    id: str,
    anoi: int,
    anof: int,
    lista_negra: ListaNegra,  #lista com docentes a serem removidos do gráfico (parâmetros de simulação)
    request: Request,
    db: DBConnector = Depends(deps.get_db),
    current_user: schemas.User = Depends(deps.get_current_active_user),
    redis : RedisConnector = Depends(deps.get_redis),
    ) -> Any:
    """
    Retorna um Json com as informações para o gráfico de indprodart filtrado pelos IDs dos docentes (lista_negra)
    
    Args:
        id: Id do PPG (codigo_do_programa)
        anoi: ano inicial
        anof: ano final
        lista_negra: lista com docentes a serem removidos do gráfico (parâmetros de simulação)
        request: necessário para o annotation @cache_redis
        db: DataBase, dependência da conexão com o banco
        current_user: dependência do usuário (ativo)
        redis: dependência de conexão com o redis
    """
    try:
        contagem = crud.queries_ppg.retorna_contagem_de_indprodart_com_listanegra(id, anoi, anof, lista_negra.lista_negra, db)
        return contagem
    except Exception as e:
        print(e)
        await utils.log_erros(db, path_error = request.url.path, traceback = traceback.format_exc())
        raise HTTPException(status_code=400, detail="Erro ao tentar recuperar as informações de indprodart do ppg.")
    

# Mesmo endpoint sem a lista negra
@router.get("/indprodart/{id}/{anoi}/{anof}")
#@cache_redis_async
async def indprodart_get(
    *,
    id: str,
    anoi: int,
    anof: int,
    request: Request,
    db: DBConnector = Depends(deps.get_db),
    current_user: schemas.User = Depends(deps.get_current_active_user),
    redis : RedisConnector = Depends(deps.get_redis),
    ) -> Any:
    """
    Retorna um Json com as informações para o gráfico de indprodart não filtrado pelos IDs dos docentes (lista_negra)
    
    Args:
        id: Id do PPG (codigo_do_programa)
        anoi: ano inicial
        anof: ano final
        request: necessário para o annotation @cache_redis
        db: DataBase, dependência da conexão com o banco
        current_user: dependência do usuário (ativo)
        redis: dependência de conexão com o redis
    """
    try:
        contagem = crud.queries_ppg.retorna_contagem_de_indprodart_com_listanegra(id, anoi, anof, None, db)
        return contagem
    except Exception as e:
        print(e)
        await utils.log_erros(db, path_error = request.url.path, traceback = traceback.format_exc())
        raise HTTPException(status_code=400, detail="Erro ao tentar recuperar as informações de indprodart do ppg.")

@router.get("/indprodartabsoluto/{id}/{anoi}/{anof}")
#@cache_redis_async
async def indprodart_absoluto(
    *,
    id: str,
    anoi: int,
    anof: int,
    request: Request,
    db: DBConnector = Depends(deps.get_db),
    current_user: schemas.User = Depends(deps.get_current_active_user),
    redis : RedisConnector = Depends(deps.get_redis),
    ) -> Any:
    """
    Retorna um Json com as informações para o gráfico de indprodart não ponderado pela quantidade de docentes
    
    Args:
        id: Id do PPG (codigo_do_programa)
        anoi: ano inicial
        anof: ano final
        request: necessário para o annotation @cache_redis
        db: DataBase, dependência da conexão com o banco
        current_user: dependência do usuário (ativo)
        redis: dependência de conexão com o redis
    """
    try:
        contagem = crud.queries_ppg.retorna_contagem_de_indprodart_absoluto(id, anoi, anof, db)
        return contagem
    except Exception as e:
        print(e)
        await utils.log_erros(db, path_error = request.url.path, traceback = traceback.format_exc())
        raise HTTPException(status_code=400, detail="Erro ao tentar recuperar as informações de indprodart do ppg.")
    
@router.get("/indprodartextsup/{id}/{anoi}/{anof}")
#@cache_redis_async
async def indprodart_extsup(
    *,
    id: str,
    anoi: int,
    anof: int,
    request: Request,
    db: DBConnector = Depends(deps.get_db),
    current_user: schemas.User = Depends(deps.get_current_active_user),
    redis : RedisConnector = Depends(deps.get_redis),
    ) -> Any:
    """
    Retorna um Json com as informações para o gráfico de indprodart apenas do extrato superior do qualis
    
    Args:
        id: Id do PPG (codigo_do_programa)
        anoi: ano inicial
        anof: ano final
        request: necessário para o annotation @cache_redis
        db: DataBase, dependência da conexão com o banco
        current_user: dependência do usuário (ativo)
        redis: dependência de conexão com o redis
    """
    try:
        contagem = crud.queries_ppg.retorna_contagem_de_indprodart_extrato_superior_com_listanegra(id, anoi, anof, None, db)
        return contagem
    except Exception as e:
        print(e)
        await utils.log_erros(db, path_error = request.url.path, traceback = traceback.format_exc())
        raise HTTPException(status_code=400, detail="Erro ao tentar recuperar as informações de indprodart do ppg.")
    

@router.get("/position/{id}/{anoi}/{anof}")
@log_users
#@cache_redis_async
async def popsitions_avg_ppg(
    *,
    id: str,
    anoi: int,
    anof: int,
    request: Request,
    db: DBConnector = Depends(deps.get_db),
    current_user: schemas.User = Depends(deps.get_current_active_user),
    redis : RedisConnector = Depends(deps.get_redis)
    ) -> Any:
    """
    Retrieve popsitions by years.
    
    Args:
        id: Id of PPG
        anoi: Initial year of search
        anof: Final year of search
        request: Necessary for annotation @cache_redis
        db: DataBase, depends if is conected
        current_user: Current_user active in session
        redis: Data stored in memory, depends if is conected
    """
    try:
        positions = crud.queries_ppg.retorna_dados_posicoes(id, anoi, anof, db)
        return positions
    except Exception as e:
        print(e)
        await utils.log_erros(db, path_error = request.url.path, traceback = traceback.format_exc())
        raise HTTPException(status_code=400, detail="Erro ao retorna a posições do PPG por anos")
    

@router.get("/{ind_name}/{id}/{anoi}/{anof}")
#@cache_redis_async
async def indices(
    *,
    id: str,
    anoi: int,
    anof: int,
    ind_name: str,
    request: Request,
    db: DBConnector = Depends(deps.get_db),
    current_user: schemas.User = Depends(deps.get_current_active_user),
    redis : RedisConnector = Depends(deps.get_redis)
    ) -> Any:
    """
    Retrieve Indices by years.
    
    Args:
        id: Id of PPG
        anoi: Initial year of search
        anof: Final year of search
        ind_name: Name of the Indice that will be retrieved 
        request: Necessary for annotation @cache_redis
        db: DataBase, depends if is conected
        current_user: Current_user active in session
        redis: Data stored in memory, depends if is conected
    """
    try:
        match ind_name:
            #case 'indprod':
            #    ind = crud.queries_ppg.retorna_indprod(id, anoi, anof, db)
            case 'indori':
                ind = crud.queries_ppg.retorna_indori(id, anoi, anof, db)
            case 'inddistori':
                ind = crud.queries_ppg.retorna_inddistori(id, anoi, anof, db)
            case 'indaut':
                ind = crud.queries_ppg.retorna_indaut(id, anoi, anof, db)
            case 'inddis':
                ind = crud.queries_ppg.retorna_inddis(id, anoi, anof, db)
            case 'partdis':
                ind = crud.queries_ppg.retorna_partdis(id, anoi, anof, db)
            case 'indcoautoria':
                ind = crud.queries_ppg.retorna_indcoautoria(id, anoi, anof, db)
            case _:
                ind = None
        return ind
    except:
        await utils.log_erros(db, path_error = request.url.path, traceback = traceback.format_exc())
        raise HTTPException(status_code=400, detail= f"Erro ao retornar o indice {ind_name} por anos")
    

@router.get("/{ind_name}/avg/{id}/{anoi}/{anof}")
#@cache_redis_async
async def indices_avg(
    *,
    id: str,
    anoi: int,
    anof: int,
    ind_name: str,
    request: Request,
    db: DBConnector = Depends(deps.get_db),
    current_user: schemas.User = Depends(deps.get_current_active_user),
    redis : RedisConnector = Depends(deps.get_redis)
    ) -> Any:
    """
    Retrieve Average Indices by years.
    
    Args:
        id: Id of PPG
        anoi: Initial year of search
        anof: Final year of search
        ind_name: Name of the Indice that will be retrieved 
        request: Necessary for annotation @cache_redis
        db: DataBase, depends if is conected
        current_user: Current_user active in session
        redis: Data stored in memory, depends if is conected
    """
    try:
        match ind_name:
            #case 'indprod':
            #    ind = crud.queries_ppg.retorna_indprod_medio_por_anos(id, anoi, anof, db)
            case 'indori':
                ind = crud.queries_ppg.retorna_indori_medio(id, anoi, anof, db)
            case 'inddistori':
                ind = crud.queries_ppg.retorna_inddistori_medio(id, anoi, anof, db)
            case 'indaut':
                ind = crud.queries_ppg.retorna_indaut_medio(id, anoi, anof, db)
            case 'inddis':
                ind = crud.queries_ppg.retotrna_inddis_medio(id, anoi, anof, db)
            case 'partdis':
                ind = crud.queries_ppg.retorna_partdis_medio(id, anoi, anof, db)
            case 'indcoautoria':
                ind = crud.queries_ppg.retorna_indcoautoria_medio(id, anoi, anof, db)
            case _:
                ind = None 
        return ind
    except Exception as e:
        print(e)
        await utils.log_erros(db, path_error = request.url.path, traceback = traceback.format_exc())
        raise HTTPException(status_code=400, detail= f"Erro ao retornar a médio do indice {ind_name} por anos")
    


@router.get("/tempo/conclusoes/{id}/{anoi}/{anof}")
#@cache_redis_async
async def conclusion_times(
    *,
    id: str,
    anoi: int,
    anof: int,
    request: Request,
    db: DBConnector = Depends(deps.get_db),
    current_user: schemas.User = Depends(deps.get_current_active_user),
    redis : RedisConnector = Depends(deps.get_redis),
    ) -> Any:
    """
    Retrieve total number of productions by years considering all kind of professors.

    Args:
        id: Id of PPG
        anoi: Initial year of search
        anof: Final year of search
        request: Necessary for annotation @cache_redis
        db: DataBase, depends if is conected
        current_user: Current_user active in session
        redis: Data stored in memory, depends if is conected
    """
    try:
        times = crud.queries_ppg.retorna_tempos_de_conclusao(id, anoi, anof, db)
        return times
    except:
        await utils.log_erros(db, path_error = request.url.path, traceback = traceback.format_exc())
        raise HTTPException(status_code=400, detail="Erro ao retornar o tempo de conclusão dos professores do PPG")
    
