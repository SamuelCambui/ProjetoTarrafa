Chart.register(ChartDataLabels);

Chart.defaults.font.size = 10;

/**
 * Renderiza um gráfico na tela
 * @param { string } idChart ID da tag que será montado o gráfico
 * @param { Object } chartData Dados do Gráfico
 * @param { 'line'| 'bar'| 'doughnut'| 'bubble'| 'polarArea'| 'radar'| 'scatter' } chartData.type Tipo do gráfico
 * @param { Object } chartData.data Tipo do gráfico
 * @param { string[] } chartData.data.labels Tipo do gráfico
 * @param { Array.<{
 *  label:string,
 *  data: number[],
 * }> } chartData.data.datasets Dados do Gráfico
 * @param { Array.<{
 *  type?: 'line'| 'bar'| 'doughnut'| 'bubble'| 'polarArea'| 'radar'| 'scatter',
 *  xAxisID?: string,
 *  yAxisID?: string,
 *  backgroundColor?: Color | Color[],
 *  borderColor?: Color | Color[],
 *  borderWidth?: number | number[],
 *  borderDash?: number[],
 *  borderDashOffset?: number,
 *  borderCapStyle?: string,
 *  borderJoinStyle?: string,
 *  cubicInterpolationMode?: string,
 *  fill?: boolean | string,
 *  lineTension?: number,
 *  pointBackgroundColor?: Color | Color[],
 *  pointBorderColor?: Color | Color[],
 *  pointBorderWidth?: number | number[],
 *  pointRadius?: number | number[],
 *  pointStyle?: string | string[] | Image | Image[],
 *  pointHitRadius?: number | number[],
 *  pointHoverBackgroundColor?: Color | Color[],
 *  pointHoverBorderColor?: Color | Color[],
 *  pointHoverBorderWidth?: number | number[],
 *  pointHoverRadius?: number | number[],
 *  showLine?: boolean,
 *  spanGaps?: boolean,
 *  steppedLine?: boolean | string
 * }> } datasetOptions Opções de configuração de cada dataset na ordem passada em charData
 * @param { Object } chartOptions Opções de configuração do Gráfico
 * @param { Object } layout Opções de configuração de layout do Gráfico
 * @returns { Chart }
 */
export function renderChart(idChart, chartData, datasetOptions, chartOptions, layout){
    const { data: { datasets } } = chartData
    let datasetsChart = datasets;
    if(datasetOptions){
        datasetsChart = datasets.map((dataset, index) => {
            return {
                ...dataset,
                ...datasetOptions[index]
            }
        })
    }
    const canvas = document.getElementById(idChart);
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    return new Chart(ctx, {
        ...chartData,
        data: {
            labels: chartData.data.labels,
            datasets: datasetsChart
        },
        options: {
          ...chartOptions,
        },
        layout: { ...layout },
    });
}

export function carregaOpcoesAnos(){
    const elementSelectAnoInicial = document.getElementById("ano-inicio")
    const elementSelectAnoFinal = document.getElementById("ano-fim")
    const anoAtual = new Date().getFullYear()
    for(let ano = anoAtual - 10; ano <= anoAtual; ano++){
        let optionInicial = document.createElement('option');
        if(ano == anoAtual - 10){
            optionInicial.selected = true;
        }
        optionInicial.innerHTML = ano.toString();
        optionInicial.value = ano.toString();
        elementSelectAnoInicial.appendChild(optionInicial);

        let optionFinal = document.createElement('option');
        optionFinal.innerHTML = ano.toString();
        if(ano == anoAtual){
            optionFinal.selected = true;
        }
        optionFinal.value = ano.toString();
        elementSelectAnoFinal.appendChild(optionFinal);
    }
}