
$(document).ready(function () {
	fetchCharts();
});

function fetchCharts() {
	axios.get(`/ppg/graficos/indicadores-paralelo-tab/32014015010P7/2017/2021`)
		.then(response => {
			fetch_qualis_ppg('chartqualisproductions', response.data.dadosqualis);
			fetch_indprods_ppg('chartindprodsproductions', response.data.dadosindprods);
			
		})
		.catch(error => {
			console.error('Erro ao buscar dados de indicadores-tab: ', error);
		});

}


function fetch_qualis_ppg(idCanvasQualis, dados) {
	try {
		const listQualisProductions = dados.produtos;
		const listArtigos = dados.artigos;
		renderChartQualis_(idCanvasQualis, listQualisProductions, listArtigos);
	}
	catch {
		GeraToast(dados.detail);
	}
}

function fetch_indprods_ppg(idCanvasIndprods, dados) {
	try {
		const listAvgIndProds = dados.indprod;
		const indicadores = dados.indicadores;
		renderChartIndprods_(idCanvasIndprods, listAvgIndProds, indicadores);

		$('#formula_indprod').html(`IndProdArt = (${listAvgIndProds.formula.A1}*A1 + ${listAvgIndProds.formula.A2}*A2 + ${listAvgIndProds.formula.A3}*A3
			+ ${listAvgIndProds.formula.A4}*A4 + ${listAvgIndProds.formula.B1}*B1
			+ ${listAvgIndProds.formula.B2}*B2 + ${listAvgIndProds.formula.B3}*B3 + ${listAvgIndProds.formula.B4}*B4)/DP`);
	}
	catch {
		GeraToast(dados.detail);
	}
}



