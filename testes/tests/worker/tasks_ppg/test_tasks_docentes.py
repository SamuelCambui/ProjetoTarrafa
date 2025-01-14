from unittest.mock import patch

import pytest


@pytest.fixture
def params_tasks():
    return {"anoi": 2017, "anof": 2022, "id": "32014015006P0"}


@pytest.fixture
def params_grafo_programa(params_tasks):
    return {**params_tasks, "id_ies": "3727", "autor": "todos"}


@pytest.fixture
def mock_crud():
    with patch("backend.worker.crud.ppg.queries_ppg") as mock:
        yield mock


def test_tarefa_retorna_professores_por_categoria(params_tasks):
    from backend.worker.tasks_ppg.task_docentes import (
        tarefa_retorna_professores_por_categoria,
    )

    resultado = tarefa_retorna_professores_por_categoria(**params_tasks)

    assert resultado["nome"] == "professorPorCategoria"
    assert "json" in resultado


def test_tarefa_retorna_quantidade_de_discentes_titulados(params_tasks):
    from backend.worker.tasks_ppg.task_docentes import (
        tarefa_retorna_quantidade_de_discentes_titulados,
    )

    resultado = tarefa_retorna_quantidade_de_discentes_titulados(**params_tasks)

    assert resultado["nome"] == "discentesTitulados"
    assert "json" in resultado


def test_tarefa_retorna_tempo_de_atualizacao_do_lattes(params_tasks):
    from backend.worker.tasks_ppg.task_docentes import (
        tarefa_retorna_tempo_de_atualizacao_do_lattes,
    )

    resultado = tarefa_retorna_tempo_de_atualizacao_do_lattes(**params_tasks)

    assert resultado["nome"] == "atualizacaoLattes"
    assert "json" in resultado


def test_tarefa_retorna_lista_de_professores_por_ano(params_tasks):
    from backend.worker.tasks_ppg.task_docentes import (
        tarefa_retorna_lista_de_professores_por_ano,
    )

    resultado = tarefa_retorna_lista_de_professores_por_ano(**params_tasks)

    assert resultado["nome"] == "listaProfessores"
    assert "json" in resultado


def test_tarefa_retorna_grafo_de_coautores_do_ppg(params_tasks):
    from backend.worker.tasks_ppg.task_docentes import (
        tarefa_retorna_grafo_de_coautores_do_ppg,
    )

    resultado = tarefa_retorna_grafo_de_coautores_do_ppg(**params_tasks)

    assert resultado["nome"] == "grafoCoautoresdoPpg"
    assert "json" in resultado


def test_tarefa_retorna_grafo_de_coautores_do_programa(params_grafo_programa):
    from backend.worker.tasks_ppg.task_docentes import (
        tarefa_retorna_grafo_de_coautores_do_programa,
    )

    resultado = tarefa_retorna_grafo_de_coautores_do_programa(**params_grafo_programa)

    assert resultado["nome"] == "grafoCoautoresdoPrograma"
    assert "json" in resultado


def test_agrupar_tarefas_docentes(params_tasks):
    from backend.worker.tasks_ppg.task_docentes import agrupar_tarefas_docentes

    tarefas = agrupar_tarefas_docentes(**params_tasks)

    assert len(tarefas) == 5  # Número de tarefas ativas (excluindo a comentada)

    for tarefa in tarefas:
        assert hasattr(tarefa, "task")


# # Testes para cenários de erro
# def test_tarefa_retorna_professores_por_categoria_erro(params_tasks, mock_crud):
#     from backend.worker.tasks_ppg.task_docentes import tarefa_retorna_professores_por_categoria

#     mock_crud.retorna_professores_por_categoria.side_effect = Exception("Erro simulado")

#     resultado = tarefa_retorna_professores_por_categoria(**params_tasks)

#     assert resultado['nome'] == 'professorPorCategoria'
#     assert resultado['json'] is None
