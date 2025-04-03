import pytest
from unittest.mock import patch
import json

@pytest.fixture
def params_tasks():
    return {
        "id_ies": "3727",
        "anoi": 2017,
        "anof": 2022
    }

def test_get_naturalidade_alunos_sucesso(params_tasks):
    from backend.worker.tasks_grad.tasks_grad import get_naturalidade_alunos
    
    mock_data = [
        {'naturalidade': 'Montes Claros', 'quantidade_alunos': 16314, 'latitude': -16.7282, 'longitude': -43.8578, 'estado': 'MG'},
        {'naturalidade': 'São Paulo', 'quantidade_alunos': 534, 'latitude': -16.123, 'longitude': -43.999, 'estado': 'SP'},
    ]
    
    with patch('backend.worker.crud.grad.queries_grad.queries_grad.naturalidade_alunos') as mock_crud:
        mock_crud.return_value = mock_data
    
        resultado = get_naturalidade_alunos(
            id_ies=params_tasks['id_ies'],
            anoi=params_tasks['anoi'],
            anof=params_tasks['anof']
        )
        
        assert resultado["nome"] == "municipios"
        assert "json" in resultado
        parsed_json = json.loads(resultado["json"])
        assert parsed_json == mock_data

def test_get_naturalidade_alunos_erro(params_tasks):
    from backend.worker.tasks_grad.tasks_grad import get_naturalidade_alunos
    
    with patch('backend.worker.crud.grad.queries_grad.queries_grad.naturalidade_alunos') as mock_crud:
        mock_crud.side_effect = Exception("Erro simulado")
    
        resultado = get_naturalidade_alunos(
            id_ies=params_tasks['id_ies'],
            anoi=params_tasks['anoi'],
            anof=params_tasks['anof']
        )
        
        assert resultado["nome"] == "municipios"
        assert "json" not in resultado

def test_get_sexo_alunos_sucesso(params_tasks):
    from backend.worker.tasks_grad.tasks_grad import get_sexo_alunos
    
    mock_data = [
        {'sexo': 'Feminino', 'semestre_letivo': '2017/1', 'quantidade': 100},
        {'sexo': 'Masculino', 'semestre_letivo': '2017/2', 'quantidade': 200}
    ]
    
    with patch('backend.worker.crud.grad.queries_grad.queries_grad.sexo_alunos') as mock_crud:
        mock_crud.return_value = mock_data
    
        resultado = get_sexo_alunos(
            id_ies=params_tasks['id_ies'],
            anoi=params_tasks['anoi'],
            anof=params_tasks['anof']
        )
        
        assert resultado["nome"] == "graficoSexoAlunos"
        assert "json" in resultado
        parsed_json = json.loads(resultado["json"])
        assert parsed_json == mock_data

def test_get_sexo_alunos_erro(params_tasks):
    from backend.worker.tasks_grad.tasks_grad import get_sexo_alunos
    
    with patch('backend.worker.crud.grad.queries_grad.queries_grad.sexo_alunos') as mock_crud:
        mock_crud.side_effect = Exception("Erro simulado")
    
        resultado = get_sexo_alunos(
            id_ies=params_tasks['id_ies'],
            anoi=params_tasks['anoi'],
            anof=params_tasks['anof']
        )
        
        assert resultado["nome"] == "graficoSexoAlunos"
        assert "json" not in resultado

def test_get_egressos_sucesso(params_tasks):
    from backend.worker.tasks_grad.tasks_grad import get_egressos
    
    mock_data = [
        {'sexo': 'Feminino', 'ano_letivo': 2017, 'semestre': 1, 'egressos': 100},
        {'sexo': 'Masculino', 'ano_letivo': 2018, 'semestre': 1, 'egressos': 200}
    ]
    
    with patch('backend.worker.crud.grad.queries_grad.queries_grad.egressos') as mock_crud:
        mock_crud.return_value = mock_data
    
        resultado = get_egressos(
            id_ies=params_tasks['id_ies'],
            anoi=params_tasks['anoi'],
            anof=params_tasks['anof']
        )
        
        assert resultado["nome"] == "graficoEgressos"
        assert "json" in resultado
        parsed_json = json.loads(resultado["json"])
        assert parsed_json == mock_data

def test_get_egressos_erro(params_tasks):
    from backend.worker.tasks_grad.tasks_grad import get_egressos
    
    with patch('backend.worker.crud.grad.queries_grad.queries_grad.egressos') as mock_crud:
        mock_crud.side_effect = Exception("Erro simulado")
    
        resultado = get_egressos(
            id_ies=params_tasks['id_ies'],
            anoi=params_tasks['anoi'],
            anof=params_tasks['anof']
        )
        
        assert resultado["nome"] == "graficoEgressos"
        assert "json" not in resultado

def test_get_egressos_por_cota_sucesso(params_tasks):
    from backend.worker.tasks_grad.tasks_grad import get_egressos_por_cota
    
    mock_data = [
        {'cota': False, 'semestre_letivo': '2017/1', 'egressos': 200},
        {'cota': False, 'semestre_letivo': '2017/2', 'egressos': 100}
    ]
    
    with patch('backend.worker.crud.grad.queries_grad.queries_grad.egressos_por_cota') as mock_crud:
        mock_crud.return_value = mock_data
    
        resultado = get_egressos_por_cota(
            id_ies=params_tasks['id_ies'],
            anoi=params_tasks['anoi'],
            anof=params_tasks['anof']
        )
        
        assert resultado["nome"] == "graficoEgressosCota"
        assert "json" in resultado
        parsed_json = json.loads(resultado["json"])
        assert parsed_json == mock_data

def test_get_egressos_por_cota_erro(params_tasks):
    from backend.worker.tasks_grad.tasks_grad import get_egressos_por_cota
    
    with patch('backend.worker.crud.grad.queries_grad.queries_grad.egressos_por_cota') as mock_crud:
        mock_crud.side_effect = Exception("Erro simulado")
    
        resultado = get_egressos_por_cota(
            id_ies=params_tasks['id_ies'],
            anoi=params_tasks['anoi'],
            anof=params_tasks['anof']
        )
        
        assert resultado["nome"] == "graficoEgressosCota"
        assert "json" not in resultado

def test_get_boxplot_idade_sucesso(params_tasks):
    from backend.worker.tasks_grad.tasks_grad import get_boxplot_idade
    
    mock_data = [
        {'ano_ingresso': 2017.0, 'primeiro_quartil': 18.0, 'segundo_quartil': 19.0, 'terceiro_quartil': 24.0, 'desvio_padrao': 7.11, 'media': 22.41, 'limite_inferior': 17.0, 'limite_superior': 33.0},
        {'ano_ingresso': 2020.0, 'primeiro_quartil': 18.0, 'segundo_quartil': 19.0, 'terceiro_quartil': 24.0, 'desvio_padrao': 7.11, 'media': 22.41, 'limite_inferior': 17.0, 'limite_superior': 33.0}
    ]
    
    with patch('backend.worker.crud.grad.queries_grad.queries_grad.boxplot_idade') as mock_crud:
        mock_crud.return_value = mock_data
    
        resultado = get_boxplot_idade(
            id_ies=params_tasks['id_ies'],
            anoi=params_tasks['anoi'],
            anof=params_tasks['anof']
        )
        
        assert resultado["nome"] == "boxplotIdade"
        assert "json" in resultado
        parsed_json = json.loads(resultado["json"])
        assert parsed_json == mock_data

def test_get_boxplot_idade_erro(params_tasks):
    from backend.worker.tasks_grad.tasks_grad import get_boxplot_idade
    
    with patch('backend.worker.crud.grad.queries_grad.queries_grad.boxplot_idade') as mock_crud:
        mock_crud.side_effect = Exception("Erro simulado")
    
        resultado = get_boxplot_idade(
            id_ies=params_tasks['id_ies'],
            anoi=params_tasks['anoi'],
            anof=params_tasks['anof']
        )
        
        assert resultado["nome"] == "boxplotIdade"
        assert "json" not in resultado

def test_get_taxa_matriculas_sucesso(params_tasks):
    from backend.worker.tasks_grad.tasks_grad import get_taxa_matriculas
    
    mock_data = [
        {'sexo': 'Feminino', 'semestre_letivo': '2017/1', 'quantidade': 100},
        {'sexo': 'Masculino', 'semestre_letivo': '2018/1', 'quantidade': 200}
    ]
    
    with patch('backend.worker.crud.grad.queries_grad.queries_grad.taxa_matriculas') as mock_crud:
        mock_crud.return_value = mock_data
    
        resultado = get_taxa_matriculas(
            id_ies=params_tasks['id_ies'],
            anoi=params_tasks['anoi'],
            anof=params_tasks['anof']
        )
        
        assert resultado["nome"] == "taxaMatriculas"
        assert "json" in resultado
        parsed_json = json.loads(resultado["json"])
        assert parsed_json == mock_data

def test_get_taxa_matriculas_erro(params_tasks):
    from backend.worker.tasks_grad.tasks_grad import get_taxa_matriculas
    
    with patch('backend.worker.crud.grad.queries_grad.queries_grad.taxa_matriculas') as mock_crud:
        mock_crud.side_effect = Exception("Erro simulado")
    
        resultado = get_taxa_matriculas(
            id_ies=params_tasks['id_ies'],
            anoi=params_tasks['anoi'],
            anof=params_tasks['anof']
        )
        
        assert resultado["nome"] == "taxaMatriculas"
        assert "json" not in resultado

def test_get_taxa_matriculas_por_cota_sucesso(params_tasks):
    from backend.worker.tasks_grad.tasks_grad import get_taxa_matriculas_por_cota
    
    mock_data = [
        {'cota': False, 'semestre_letivo': '2017/1', 'quantidade': 100},
        {'cota': False, 'semestre_letivo': '2018/1', 'quantidade': 200}
    ]
    
    with patch('backend.worker.crud.grad.queries_grad.queries_grad.taxa_matriculas_por_cota') as mock_crud:
        mock_crud.return_value = mock_data
    
        resultado = get_taxa_matriculas_por_cota(
            id_ies=params_tasks['id_ies'],
            anoi=params_tasks['anoi'],
            anof=params_tasks['anof']
        )
        
        assert resultado["nome"] == "taxaMatriculasCota"
        assert "json" in resultado
        parsed_json = json.loads(resultado["json"])
        assert parsed_json == mock_data

def test_get_taxa_matriculas_por_cota_erro(params_tasks):
    from backend.worker.tasks_grad.tasks_grad import get_taxa_matriculas_por_cota
    
    with patch('backend.worker.crud.grad.queries_grad.queries_grad.taxa_matriculas_por_cota') as mock_crud:
        mock_crud.side_effect = Exception("Erro simulado")
    
        resultado = get_taxa_matriculas_por_cota(
            id_ies=params_tasks['id_ies'],
            anoi=params_tasks['anoi'],
            anof=params_tasks['anof']
        )
        
        assert resultado["nome"] == "taxaMatriculasCota"
        assert "json" not in resultado