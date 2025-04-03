from unittest.mock import patch

import pytest


# Fixtures para parâmetros comuns
@pytest.fixture
def params_tasks():
    return {"anoi": 2017, "anof": 2022, "id": "32014015006P0"}


@pytest.fixture
def mock_crud():
    with patch("backend.worker.crud.ppg.queries_ppg") as mock:
        yield mock


def test_tarefa_retorna_dados_de_tccs_por_linhas_de_pesquisa(params_tasks):
    from backend.worker.tasks_ppg.task_bancas import (
        tarefa_retorna_dados_de_tccs_por_linhas_de_pesquisa,
    )

    resultado = tarefa_retorna_dados_de_tccs_por_linhas_de_pesquisa(**params_tasks)

    assert resultado["nome"] == "dadosDeTccsPorLinhasDePesquisa"
    assert "json" in resultado


def test_tarefa_retorna_dados_de_tccs_por_linhas_de_pesquisa_erro(params_tasks):
    from backend.worker.tasks_ppg.task_bancas import (
        tarefa_retorna_dados_de_tccs_por_linhas_de_pesquisa,
    )

    resultado = tarefa_retorna_dados_de_tccs_por_linhas_de_pesquisa(**params_tasks)

    assert resultado["nome"] == "dadosDeTccsPorLinhasDePesquisa"
    assert "json" in resultado


def test_tarefa_retorna_dados_de_produtos_por_tcc_sucesso(params_tasks):
    from backend.worker.tasks_ppg.task_bancas import (
        tarefa_retorna_dados_de_produtos_por_tcc,
    )

    resultado = tarefa_retorna_dados_de_produtos_por_tcc(**params_tasks)

    assert resultado["nome"] == "dadosDeProdutosPorTcc"
    assert "json" in resultado


def test_tarefa_retorna_levantemento_externos_em_bancas_sucesso(params_tasks):
    from backend.worker.tasks_ppg.task_bancas import (
        tarefa_retorna_levantemento_externos_em_bancas,
    )

    resultado = tarefa_retorna_levantemento_externos_em_bancas(**params_tasks)

    assert resultado["nome"] == "levantamentoExternosEmBancas"
    assert "json" in resultado


def test_agrupar_tarefas_bancas(params_tasks):
    from backend.worker.tasks_ppg.task_bancas import agrupar_tarefas_bancas

    tarefas = agrupar_tarefas_bancas(**params_tasks)

    assert len(tarefas) == 3

    for tarefa in tarefas:
        assert hasattr(tarefa, "task")
