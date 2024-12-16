import { carregaOpcoesAnos, renderChart } from './scripts-grad.js'

const charts = {
    'graficoSexoAlunos': undefined,
    'graficoEgressos': undefined,
    'graficoMapaAlunos': undefined
}

document.addEventListener('DOMContentLoaded', () => {
    carregaOpcoesAnos()
})

async function fetchChartSexo(){
    let chartData = await axios.get(`/indicadores-gerais/{}/{}/{}`)
    charts.graficoSexoAlunos = renderChart()
}