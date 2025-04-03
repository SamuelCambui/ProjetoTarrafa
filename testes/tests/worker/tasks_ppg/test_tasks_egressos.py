import json

import pytest


@pytest.fixture
def params_tasks():
    return {"anoi": 2017, "anof": 2022, "id": "32014015006P0"}


def test_tarefa_retorna_dados_egressos(params_tasks):
    from backend.worker.tasks_ppg.task_egressos import tarefa_retorna_dados_egressos

    resultado = tarefa_retorna_dados_egressos(**params_tasks)

    assert resultado["nome"] == "dadosEgressos"
    assert "json" in resultado


def test_tarefa_retorna_tempo_de_atualizacao_do_lattes_egressos(params_tasks):
    from backend.worker.tasks_ppg.task_egressos import (
        tarefa_retorna_tempo_de_atualizacao_do_lattes_egressos,
    )

    resultado = tarefa_retorna_tempo_de_atualizacao_do_lattes_egressos(**params_tasks)

    assert resultado["nome"] == "tempoAtualizacaoLattesEgressos"
    assert "json" in resultado


def test_tarefa_retorna_quantidade_egressos_titulados_por_ano(params_tasks):
    from backend.worker.tasks_ppg.task_egressos import (
        tarefa_retorna_quantidade_egressos_titulados_por_ano,
    )

    resultado = tarefa_retorna_quantidade_egressos_titulados_por_ano(**params_tasks)

    assert resultado["nome"] == "egressosTituladosPorAno"
    assert "json" in resultado


def test_tarefa_retorna_producoes_egresso(params_tasks):
    from backend.worker.tasks_ppg.task_egressos import tarefa_retorna_producoes_egresso

    resultado = tarefa_retorna_producoes_egresso(**params_tasks)

    assert resultado["nome"] == "producoesEgressos"
    assert "json" in resultado


def test_agrupar_tarefas_egressos(params_tasks):
    from backend.worker.tasks_ppg.task_egressos import agrupar_tarefas_egressos

    tarefas = agrupar_tarefas_egressos(**params_tasks)

    assert len(tarefas) == 4

    for tarefa in tarefas:
        assert hasattr(tarefa, "task")
