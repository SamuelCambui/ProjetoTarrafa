import pytest


@pytest.fixture
def params_tasks_id_ies():
    return {
        "id_ies": "3727",
    }


@pytest.fixture
def params_tasks_id_ies_ano():
    return {"id_ies": "3727", "ano": 2022}


@pytest.fixture
def params_tasks_grafo():
    return {
        "id_ies": "3727",
        "anoi": 2017,
        "anof": 2022,
        "tipo": "docente",
        "produto": "ARTIGO EM PERIÓDICO",
    }


def test_tarefa_retorna_lista_programas(params_tasks_id_ies):
    from backend.worker.tasks_ppg.task_home import tarefa_retorna_lista_programas

    resultado = tarefa_retorna_lista_programas(**params_tasks_id_ies)

    assert resultado["nome"] == "listaProgramas"
    assert "json" in resultado


def test_tarefa_retorna_dados_home(params_tasks_id_ies):
    from backend.worker.tasks_ppg.task_home import tarefa_retorna_dados_home

    resultado = tarefa_retorna_dados_home(**params_tasks_id_ies)

    assert resultado["nome"] == "dadosHome"
    assert "json" in resultado


def test_tarefa_retorna_lista_de_artigos_da_universidade(params_tasks_id_ies_ano):
    from backend.worker.tasks_ppg.task_home import (
        tarefa_retorna_lista_de_artigos_da_universidade,
    )

    resultado = tarefa_retorna_lista_de_artigos_da_universidade(
        **params_tasks_id_ies_ano
    )

    assert resultado["nome"] == "listaArtigos"
    assert "json" in resultado


def test_tarefa_retorna_grafo_de_coautores_por_subtipo(params_tasks_grafo):
    from backend.worker.tasks_ppg.task_home import (
        tarefa_retorna_grafo_de_coautores_por_subtipo,
    )

    resultado = tarefa_retorna_grafo_de_coautores_por_subtipo(**params_tasks_grafo)

    assert resultado["nome"] == "grafoCoautores"
    assert "json" in resultado
