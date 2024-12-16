function run_waitMe(element, tipo, text, transparencia) {
	$(element).waitMe({
		//none, rotateplane, stretch, orbit, roundBounce, win8,
		//win8_linear, ios, facebook, rotation, timer, pulse,
		//progressBar, bouncePulse or img
		effect: tipo === 'progress' ? 'progressBar' : 'bouncePulse',
		//place text under the effect (string).
		text: text,
		//background for container (string).
		bg: transparencia === true ? 'rgba(255,255,255,0.7)' : '#f8f9fc',
		//color for background animation and text (string).
		color: transparencia === true ? '#93a3d2' : '#4e73df',
		//max size
		maxSize: '50',
		//wait time im ms to close
		waitTime: -1,
		//url to image
		source: '',
		//or 'horizontal'
		textPos: 'vertical',
		//font size
		fontSize: '',
		// callback
		onClose: function () { }
	});
}


$(document).ready(function () {
	fetchCharts();
});

function fetchCharts() {
	const element_indicadores = `#status-carregamento-indicadores-tab`;
	run_waitMe(element_indicadores, 'outro', '', true);
	axios.get(`/ppg/graficos/indicadores-paralelo-tab/32014015010P7/2017/2021`)
		.then(response => {
			fetch_qualis_ppg('chartqualisproductions', response.data.dadosqualis);
			fetch_indprods_ppg('chartindprodsproductions', response.data.dadosindprods);
			
		})
		.catch(error => {
			console.error('Erro ao buscar dados de indicadores-tab: ', error);
		})
		.finally(() => {
			$(element_indicadores).waitMe('hide');
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



