import json
from unittest.mock import patch

import pytest


@pytest.fixture
def params_tasks():
    return {"anoi": 2017, "anof": 2022, "id": "32014015006P0"}


@pytest.fixture
def params_tasks_lista_negra(params_tasks):
    return {**params_tasks, "lista_negra": []}


@pytest.fixture
def params_tasks_nota(params_tasks):
    return {**params_tasks, "nota": "5"}


@pytest.fixture
def mock_crud():
    with patch("backend.worker.crud.ppg.queries_ppg") as mock:
        yield mock


# @pytest.fixture
# def mock_crud_2():
#     with patch('crud.queries_ppg') as mock:
#         yield mock


# Testes para tarefas com lista negra
def test_tarefa_retorna_contagem_de_indprodart_com_listanegra(params_tasks_lista_negra):
    from backend.worker.tasks_ppg.task_indicadores import (
        tarefa_retorna_contagem_de_indprodart_com_listanegra,
    )

    resultado = tarefa_retorna_contagem_de_indprodart_com_listanegra(
        **params_tasks_lista_negra
    )

    assert resultado["nome"] == "dadosIndprods"
    assert "json" in resultado


def test_tarefa_retorna_contagem_de_qualis_com_listanegra(params_tasks_lista_negra):
    from backend.worker.tasks_ppg.task_indicadores import (
        tarefa_retorna_contagem_de_qualis_com_listanegra,
    )

    resultado = tarefa_retorna_contagem_de_qualis_com_listanegra(
        **params_tasks_lista_negra
    )

    assert resultado["nome"] == "dadosQualis"
    assert "json" in resultado


# Testes para tarefas padrão
def test_tarefa_retorna_contagem_de_qualis_do_lattes(params_tasks):
    from backend.worker.tasks_ppg.task_indicadores import (
        tarefa_retorna_contagem_de_qualis_do_lattes,
    )

    resultado = tarefa_retorna_contagem_de_qualis_do_lattes(**params_tasks)

    assert resultado["nome"] == "contagemQualisLattes"
    assert "json" in resultado


def test_tarefa_retorna_contagem_de_qualis_discentes(params_tasks):
    from backend.worker.tasks_ppg.task_indicadores import (
        tarefa_retorna_contagem_de_qualis_discentes,
    )

    resultado = tarefa_retorna_contagem_de_qualis_discentes(**params_tasks)

    assert resultado["nome"] == "contagemQualisDiscentes"
    assert "json" in resultado


def test_tarefa_retorna_estatisticas_de_artigos(params_tasks):
    from backend.worker.tasks_ppg.task_indicadores import (
        tarefa_retorna_estatisticas_de_artigos,
    )

    resultado = tarefa_retorna_estatisticas_de_artigos(**params_tasks)

    assert resultado["nome"] == "estatisticaArtigos"
    assert "json" in resultado


def test_tarefa_retorna_estatisticas_de_artigos_ppgs_correlatos(params_tasks):
    from backend.worker.tasks_ppg.task_indicadores import (
        tarefa_retorna_estatisticas_de_artigos_ppgs_correlatos,
    )

    resultado = tarefa_retorna_estatisticas_de_artigos_ppgs_correlatos(**params_tasks)

    assert resultado["nome"] == "estatisticaArtigosCorrelatos"
    assert "json" in resultado


def test_tarefa_retorna_contagem_de_indprodart_absoluto(params_tasks):
    from backend.worker.tasks_ppg.task_indicadores import (
        tarefa_retorna_contagem_de_indprodart_absoluto,
    )

    resultado = tarefa_retorna_contagem_de_indprodart_absoluto(**params_tasks)

    assert resultado["nome"] == "inprodartAbsoluto"
    assert "json" in resultado


def test_tarefa_retorna_contagem_de_indprodart_extrato_superior_com_listanegra(
    params_tasks,
):
    from backend.worker.tasks_ppg.task_indicadores import (
        tarefa_retorna_contagem_de_indprodart_extrato_superior_com_listanegra,
    )

    resultado = tarefa_retorna_contagem_de_indprodart_extrato_superior_com_listanegra(
        **params_tasks
    )

    assert resultado["nome"] == "indprodartExtratoSuperior"
    assert "json" in resultado


def test_tarefa_popsitions_avg_ppg(params_tasks):
    from backend.worker.tasks_ppg.task_indicadores import tarefa_popsitions_avg_ppg

    resultado = tarefa_popsitions_avg_ppg(**params_tasks)

    assert resultado["nome"] == "popsitionsAvgPpg"
    assert "json" in resultado


def test_tarefa_retorna_tempos_de_conclusao(params_tasks):
    from backend.worker.tasks_ppg.task_indicadores import (
        tarefa_retorna_tempos_de_conclusao,
    )

    resultado = tarefa_retorna_tempos_de_conclusao(**params_tasks)

    assert resultado["nome"] == "tempoConclusao"
    assert "json" in resultado


# Testes para indicadores médios
def test_tarefa_retorna_indori_medio(params_tasks):
    from backend.worker.tasks_ppg.task_indicadores import tarefa_retorna_indori_medio

    resultado = tarefa_retorna_indori_medio(**params_tasks)

    assert resultado is not None


def test_tarefa_retorna_inddistori_medio(params_tasks):
    from backend.worker.tasks_ppg.task_indicadores import (
        tarefa_retorna_inddistori_medio,
    )

    resultado = tarefa_retorna_inddistori_medio(**params_tasks)

    assert resultado is not None


def test_tarefa_retorna_indaut_medio(params_tasks):
    from backend.worker.tasks_ppg.task_indicadores import tarefa_retorna_indaut_medio

    resultado = tarefa_retorna_indaut_medio(**params_tasks)

    assert resultado is not None


def test_tarefa_retorna_inddis_medio(params_tasks):
    from backend.worker.tasks_ppg.task_indicadores import tarefa_retorna_inddis_medio

    resultado = tarefa_retorna_inddis_medio(**params_tasks)

    assert resultado is not None


def test_tarefa_retorna_partdis_medio(params_tasks):
    from backend.worker.tasks_ppg.task_indicadores import tarefa_retorna_partdis_medio

    resultado = tarefa_retorna_partdis_medio(**params_tasks)

    assert resultado is not None


def test_tarefa_retorna_indcoautoria_medio(params_tasks):
    from backend.worker.tasks_ppg.task_indicadores import (
        tarefa_retorna_indcoautoria_medio,
    )

    resultado = tarefa_retorna_indcoautoria_medio(**params_tasks)

    assert resultado is not None


# def test_tarefa_retorna_inddistori(params_tasks_nota):
#     from backend.worker.tasks_ppg.task_indicadores import tarefa_retorna_inddistori

#     resultado = tarefa_retorna_inddistori(**params_tasks_nota)

#     assert resultado['nome'] == 'inddistori'
#     assert "json" in resultado


# Teste do agrupador
def test_agrupar_tarefas_indicadores(params_tasks_nota):
    from backend.worker.tasks_ppg.task_indicadores import agrupar_tarefas_indicadores

    tarefas = agrupar_tarefas_indicadores(**params_tasks_nota)

    assert len(tarefas) == 17  # Número total de tarefas no agrupador

    for tarefa in tarefas:
        assert hasattr(tarefa, "task")


# Teste da função auxiliar
def test_padronizar_grafico_indicador():
    from backend.worker.tasks_ppg.task_indicadores import padronizar_grafico_indicador

    respostaDict = {
        "indori": [{"ano": 2020, "indori": 0.5}, {"ano": 2021, "indori": 0.7}]
    }
    data_avg = [{"indori": 0.4, "ano": 2020}, {"indori": 0.7, "ano": 2021}]

    resultado = padronizar_grafico_indicador(
        respostaDict=respostaDict,
        data_avg=data_avg,
        label="IndOri",
        indicador="indori",
        nota="5",
    )

    assert resultado.nome == "indori"
    assert json.loads(resultado.json) is not None
