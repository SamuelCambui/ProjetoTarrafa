from unittest.mock import patch
import pytest
import json

@pytest.fixture
def params_tasks():
    return {
        "id_curso": "R005",
        "id_ies": "3727",
        "anoi": 2017,
        "anof": 2022
    }

def test_get_cursos_sucesso():
    from backend.worker.tasks_grad.tasks_cursos import get_cursos
    
    mock_data = [
        {'id': 'C001', 'nome': 'Curso 1', 'tipo_curso': 'Bacharelado'}, 
        {'id': 'C002', 'nome': 'Curso 2', 'tipo_curso': 'Bacharelado'}
    ]
    
    with patch('backend.worker.crud.grad.queries_cursos.queries_cursos.lista_cursos') as mock_crud:
        mock_crud.return_value = mock_data
        resultado = get_cursos("3727")
    
        assert resultado["nome"] == "cursos"
        assert "json" in resultado
        parsed_json = json.loads(resultado["json"])
        assert parsed_json == mock_data

def test_get_cursos_erro():
    from backend.worker.tasks_grad.tasks_cursos import get_cursos
    
    with patch('backend.worker.crud.grad.queries_cursos.queries_cursos.lista_cursos') as mock_crud:
        mock_crud.side_effect = Exception("Erro simulado")
        resultado = get_cursos("3727")
    
        assert resultado["nome"] == "cursos" 
        assert "json" not in resultado

def test_get_curso_sucesso(params_tasks):
    from backend.worker.tasks_grad.tasks_cursos import get_curso
    
    mock_data = {
        'id': 'C001',
        'id_ies': '3727',
        'nome': 'Curso 01',
        'grau': 3,
        'serie_inicial': 1,
        'serie_final': 8,
        'nota_min_aprovacao': 70.0,
        'freq_min_aprovacao': 75.0
    }
    
    with patch('backend.worker.crud.grad.queries_cursos.queries_cursos.retorna_curso') as mock_crud:
        mock_crud.return_value = mock_data
        resultado = get_curso(id_curso=params_tasks['id_curso'], id_ies=params_tasks['id_ies'])
    
        assert resultado["nome"] == "dadosCurso"
        assert "json" in resultado
        parsed_json = json.loads(resultado["json"])
        assert parsed_json["nome"] == "Curso 01"

def test_get_curso_erro(params_tasks):
    from backend.worker.tasks_grad.tasks_cursos import get_curso
    
    with patch('backend.worker.crud.grad.queries_cursos.queries_cursos.retorna_curso') as mock_crud:
        mock_crud.side_effect = Exception("Erro simulado")
        resultado = get_curso(id_curso=params_tasks['id_curso'], id_ies=params_tasks['id_ies'])
    
        assert resultado["nome"] == "dadosCurso"
        assert "json" not in resultado

def test_get_egressos_sucesso(params_tasks):
    from backend.worker.tasks_grad.tasks_cursos import get_egressos
    
    mock_data = [
        {'egressos': 1, 'ano_letivo': 2025, 'semestre': 1},
        {'egressos': 3, 'ano_letivo': 2025, 'semestre': 2}
    ]
    
    with patch('backend.worker.crud.grad.queries_cursos.queries_cursos.egressos') as mock_crud:
        mock_crud.return_value = mock_data
        resultado = get_egressos(**params_tasks)
    
        assert resultado["nome"] == "graficoEgressos"
        assert "json" in resultado
        parsed_json = json.loads(resultado["json"])
        assert parsed_json == mock_data

def test_get_egressos_erro(params_tasks):
    from backend.worker.tasks_grad.tasks_cursos import get_egressos
    
    with patch('backend.worker.crud.grad.queries_cursos.queries_cursos.egressos') as mock_crud:
        mock_crud.side_effect = Exception("Erro simulado")
        resultado = get_egressos(**params_tasks)
    
        assert resultado["nome"] == "graficoEgressos"
        assert "json" not in resultado

def test_get_quantidade_alunos_por_sexo_sucesso(params_tasks):
    from backend.worker.tasks_grad.tasks_cursos import get_quantidade_alunos_por_sexo
    
    mock_data = [
        {'sexo': 'F', 'semestre_letivo': '2017/1', 'quantidade': 49},
        {'sexo': 'M', 'semestre_letivo': '2019/1', 'quantidade': 12}
    ]
    
    with patch('backend.worker.crud.grad.queries_cursos.queries_cursos.quantidade_alunos_por_sexo') as mock_crud:
        mock_crud.return_value = mock_data
        resultado = get_quantidade_alunos_por_sexo(**params_tasks)
    
        assert resultado["nome"] == "graficoQuantidadeAlunosSexo"
        assert "json" in resultado
        parsed_json = json.loads(resultado["json"])
        assert parsed_json == mock_data

def test_get_quantidade_alunos_por_sexo_erro(params_tasks):
    from backend.worker.tasks_grad.tasks_cursos import get_quantidade_alunos_por_sexo
    
    with patch('backend.worker.crud.grad.queries_cursos.queries_cursos.quantidade_alunos_por_sexo') as mock_crud:
        mock_crud.side_effect = Exception("Erro simulado")
        resultado = get_quantidade_alunos_por_sexo(**params_tasks)
    
        assert resultado["nome"] == "graficoQuantidadeAlunosSexo"
        assert "json" not in resultado

def test_get_forma_ingresso_sucesso(params_tasks):
    from backend.worker.tasks_grad.tasks_cursos import get_forma_ingresso
    
    mock_data = [
        {'id': '12', 'descricao': 'PROC. SELETIVO- CATEG. EGRESSO ESCOLA PÚB.-CARENTE', 'quantidade': 1, 'cota': True},
        {'id': '15', 'descricao': 'PROC. SELETIVO - CATEGORIA SISTEMA UNIVERSAL', 'quantidade': 1, 'cota': False}
    ]
    
    with patch('backend.worker.crud.grad.queries_cursos.queries_cursos.forma_ingresso') as mock_crud:
        mock_crud.return_value = mock_data
        resultado = get_forma_ingresso(**params_tasks)
    
        assert resultado["nome"] == "graficoFormaIngresso"
        assert "json" in resultado
        parsed_json = json.loads(resultado["json"])
        assert parsed_json == mock_data

def test_get_forma_ingresso_erro(params_tasks):
    from backend.worker.tasks_grad.tasks_cursos import get_forma_ingresso
    
    with patch('backend.worker.crud.grad.queries_cursos.queries_cursos.forma_ingresso') as mock_crud:
        mock_crud.side_effect = Exception("Erro simulado")
        resultado = get_forma_ingresso(**params_tasks)
    
        assert resultado["nome"] == "graficoFormaIngresso"
        assert "json" not in resultado