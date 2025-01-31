from unittest.mock import patch
import pytest
import json

@pytest.fixture
def params_tasks():
    return {
        "id_disc": "69177",
        "id_curso": "R005",
        "id_ies": "3727",
        "anoi": 2017,
        "anof": 2022,
        "id_grade": "75",
        "serie": 1
    }

def test_get_disciplinas_sucesso(params_tasks):
    from backend.worker.tasks_grad.tasks_disciplinas import get_disciplinas
    
    mock_data = [
        {'cod_disc': '69177', 'nome': 'ADMINISTRAÇÃO', 'abreviacao': 'SI69177', 'carga_horaria': 72.0, 'departamento': 'CIÊNCIA DA ADMINISTRAÇÃO'}
    ]
    
    with patch('backend.worker.crud.grad.queries_disciplinas.queries_disciplinas.disciplinas_grade') as mock_crud:
        mock_crud.return_value = mock_data
        resultado = get_disciplinas(
            id_grade=params_tasks['id_grade'],
            id_curso=params_tasks['id_curso'],
            id_ies=params_tasks['id_ies']
        )

        assert resultado["nome"] == "disciplinas"
        assert "json" in resultado
        parsed_json = json.loads(resultado["json"])
        assert parsed_json == mock_data

def test_get_disciplinas_erro(params_tasks):
    from backend.worker.tasks_grad.tasks_disciplinas import get_disciplinas
    
    with patch('backend.worker.crud.grad.queries_disciplinas.queries_disciplinas.disciplinas_grade') as mock_crud:
        mock_crud.side_effect = Exception("Erro simulado")
        resultado = get_disciplinas(
            id_grade=params_tasks['id_grade'],
            id_curso=params_tasks['id_curso'],
            id_ies=params_tasks['id_ies']
        )

        assert resultado["nome"] == "disciplinas"
        assert "json" not in resultado

def test_get_disciplina_sucesso(params_tasks):
    from backend.worker.tasks_grad.tasks_disciplinas import get_disciplina
    
    mock_data = {
        'cod_disc': '69177',
        'nome': 'ADMINISTRAÇÃO',
        'abreviacao': 'SI69177',
        'carga_horaria': 72.0,
        'departamento': 'CIÊNCIA DA ADMINISTRAÇÃO'
    }
    
    with patch('backend.worker.crud.grad.queries_disciplinas.queries_disciplinas.retorna_disciplina') as mock_crud:
        mock_crud.return_value = mock_data
        resultado = get_disciplina(id=params_tasks['id_disc'], id_ies=params_tasks['id_ies'])

        assert resultado["nome"] == "disciplinas"
        assert "json" in resultado
        parsed_json = json.loads(resultado["json"])
        assert parsed_json == mock_data

def test_get_disciplina_erro(params_tasks):
    from backend.worker.tasks_grad.tasks_disciplinas import get_disciplina
    
    with patch('backend.worker.crud.grad.queries_disciplinas.queries_disciplinas.retorna_disciplina') as mock_crud:
        mock_crud.side_effect = Exception("Erro simulado")
        resultado = get_disciplina(id=params_tasks['id_disc'], id_ies=params_tasks['id_ies'])

        assert resultado["nome"] == "disciplinas"
        assert "json" not in resultado

def test_get_quantidade_prova_final_sucesso(params_tasks):
    from backend.worker.tasks_grad.tasks_disciplinas import get_quantidade_prova_final
    
    mock_data = [
        {'semestre': '2', 'ano_letivo': '2022', 'quantidade': 10}
    ]
    
    with patch('backend.worker.crud.grad.queries_disciplinas.queries_disciplinas.quantidade_prova_final') as mock_crud:
        mock_crud.return_value = mock_data
        resultado = get_quantidade_prova_final(
            id_disc=params_tasks['id_disc'],
            id_ies=params_tasks['id_ies'],
            anoi=params_tasks['anoi'],
            anof=params_tasks['anof']
        )

        assert resultado["nome"] == "graficoProvaFinal"
        assert "json" in resultado
        parsed_json = json.loads(resultado["json"])
        assert parsed_json == mock_data

def test_get_quantidade_prova_final_erro(params_tasks):
    from backend.worker.tasks_grad.tasks_disciplinas import get_quantidade_prova_final
    
    with patch('backend.worker.crud.grad.queries_disciplinas.queries_disciplinas.quantidade_prova_final') as mock_crud:
        mock_crud.side_effect = Exception("Erro simulado")
        resultado = get_quantidade_prova_final(
            id_disc=params_tasks['id_disc'],
            id_ies=params_tasks['id_ies'],
            anoi=params_tasks['anoi'],
            anof=params_tasks['anof']
        )

        assert resultado["nome"] == "graficoProvaFinal"
        assert "json" not in resultado

def test_get_quantidade_alunos_disciplina_sucesso(params_tasks):
    from backend.worker.tasks_grad.tasks_disciplinas import get_quantidade_alunos_disciplina
    
    mock_data = [
        {'semestre': '2', 'ano_letivo': '2022', 'quantidade': 10}
    ]
    
    with patch('backend.worker.crud.grad.queries_disciplinas.queries_disciplinas.quantidade_alunos_por_semestre') as mock_crud:
        mock_crud.return_value = mock_data
        resultado = get_quantidade_alunos_disciplina(
            id_disc=params_tasks['id_disc'],
            id_ies=params_tasks['id_ies'],
            anoi=params_tasks['anoi'],
            anof=params_tasks['anof']
        )

        assert resultado["nome"] == "graficoQuantidadeAlunosDisciplina"
        assert "json" in resultado
        parsed_json = json.loads(resultado["json"])
        assert parsed_json == mock_data

def test_get_quantidade_alunos_disciplina_erro(params_tasks):
    from backend.worker.tasks_grad.tasks_disciplinas import get_quantidade_alunos_disciplina
    
    with patch('backend.worker.crud.grad.queries_disciplinas.queries_disciplinas.quantidade_alunos_por_semestre') as mock_crud:
        mock_crud.side_effect = Exception("Erro simulado")
        resultado = get_quantidade_alunos_disciplina(
            id_disc=params_tasks['id_disc'],
            id_ies=params_tasks['id_ies'],
            anoi=params_tasks['anoi'],
            anof=params_tasks['anof']
        )

        assert resultado["nome"] == "graficoQuantidadeAlunosDisciplina"
        assert "json" not in resultado

def test_get_boxplot_notas_grade_sucesso(params_tasks):
    from backend.worker.tasks_grad.tasks_disciplinas import get_boxplot_notas_grade
    
    mock_data = [
        {
            'nome': 'ADMINISTRAÇÃO',
            'abreviacao': 'SI69177',
            'primeiro_quartil': 72.0,
            'segundo_quartil': 81.0,
            'terceiro_quartil': 88.0,
            'desvio_padrao': 31.95,
            'media': 68.04,
            'limite_inferior': 48.0,
            'limite_superior': 100.0
        }
    ]
    
    with patch('backend.worker.crud.grad.queries_disciplinas.queries_disciplinas.boxplot_notas_grade') as mock_crud:
        mock_crud.return_value = mock_data
        resultado = get_boxplot_notas_grade(
            id_curso=params_tasks['id_curso'],
            id_grade=params_tasks['id_grade'],
            id_ies=params_tasks['id_ies'],
            serie=params_tasks['serie']
        )

        assert resultado["nome"] == f"boxplotNotasGradeSerie{params_tasks['serie']}"
        assert "json" in resultado
        parsed_json = json.loads(resultado["json"])
        assert parsed_json == mock_data

def test_get_boxplot_notas_grade_erro(params_tasks):
    from backend.worker.tasks_grad.tasks_disciplinas import get_boxplot_notas_grade
    
    with patch('backend.worker.crud.grad.queries_disciplinas.queries_disciplinas.boxplot_notas_grade') as mock_crud:
        mock_crud.side_effect = Exception("Erro simulado")
        resultado = get_boxplot_notas_grade(
            id_curso=params_tasks['id_curso'],
            id_grade=params_tasks['id_grade'],
            id_ies=params_tasks['id_ies'],
            serie=params_tasks['serie']
        )

        assert resultado["nome"] == f"boxplotNotasGradeSerie{params_tasks['serie']}"
        assert "json" not in resultado