$(document).ready(function () {
    $('#wrapper').show();
    verificaOcupacao();
});

function verificaOcupacao() {
    // ajustarBarraProgresso("processar_curriculos", "progresso-processar", "pcl")
    acompanharFila("curriculos", "progresso-curriculos", "ccl");
    acompanharFila("cache", "progresso-restaurar-cache", "rcache")

    // ajustarBarraProgresso("processar_indicadores", "progresso-restaurar-cache-indicadores-tab", "rcache-indicadores")
    // ajustarBarraProgresso("processar_docentes", "progresso-restaurar-cache-docentes-tab", "rcache-docentes")
    // ajustarBarraProgresso("processar_bancas", "progresso-restaurar-cache-bancas-tab", "rcache-bancas")
    // ajustarBarraProgresso("processar_projetos", "progresso-restaurar-cache-projetos-tab", "rcache-projetos")
    // ajustarBarraProgresso("processar_correlatos", "progresso-restaurar-cache-correlatos-tab", "rcache-correlatos")
}

async function limparCache(idIes) {
    var idIes;
    if($('#cb_seleciona_todas').is(':checked'))
        idIes = 'em_lote';
    else
        idIes = $('#idIes').find(":selected").val();

    if(idIes !== '000') {
        await axios.get(`/tasks/limpar_cache/${idIes}`);
    }
}

async function acompanharFila(nome_tarefa, elem, tipo) {
    
    var total = 0;

    let intervalId = setInterval(async () => {
        try {
            var idIes;
            if($('#cb_seleciona_todas').is(':checked'))
                idIes = 'em_lote';
            else
                idIes = $('#idIes').find(":selected").val();
            
            if(idIes !== '000') {
                const taskResponses = await axios.get(`/tasks/consultar_progresso/${nome_tarefa}/${idIes}`);
                console.log(taskResponses.data);
                total = parseInt(taskResponses.data.total);

                if (total == -1) {
                    clearInterval(intervalId); // Encerra o intervalo
                    return;
                }

                
                $(`#${tipo}-total`).text(total);
                
                // Verifica se a condição de parada do loop foi atingida
                //if (width >= 100) {
                //    clearInterval(intervalId);
                //}
            }
        } catch (error) {
            console.error('Erro ao acompanhar ocupacao da fila:', error);
        }
    }, 200); // O intervalo de 1000 milissegundos (1 segundo) pode ser ajustado conforme necessário
}

async function ajustarBarraProgresso(nome_tarefa, elem, tipo) {
    
    let width = 0;
    var sucessos = 0;
    var erros = 0;
    var total = 0;

    let intervalId = setInterval(async () => {
        try {
            var idIes;
            if($('#cb_seleciona_todas').is(':checked'))
                idIes = 'em_lote';
            else
                idIes = $('#idIes').find(":selected").val();
            
            if(idIes !== '000') {
                const taskResponses = await axios.get(`/tasks/consultar_progresso/${nome_tarefa}`);
                sucessos = parseInt(taskResponses.data.sucessos);
                erros = parseInt(taskResponses.data.erros);
                total = parseInt(taskResponses.data.total);

                if (sucessos == -1) {
                    clearInterval(intervalId); // Encerra o intervalo
                    return;
                }

                if (total > 0) {
                    width = Math.floor((sucessos + erros) * 100 / total);
                    $('#' + elem).css({ width: `${width.toFixed(2)}%` });
                    $('#' + elem).attr('aria-valuenow', width.toFixed(2));
                    document.getElementById(elem).textContent = `${width.toFixed(2)}%`;
                }
                else {
                    $('#' + elem).css({ width: `0%` });
                    $('#' + elem).attr('aria-valuenow', '0');
                    document.getElementById(elem).textContent = `0%`;
                }

                $(`#${tipo}-total`).text(total);
                $(`#${tipo}-sucessos`).text(sucessos);
                $(`#${tipo}-erros`).text(erros);
                $(`#${tipo}-pendentes`).text(total - (sucessos + erros));

                // Verifica se a condição de parada do loop foi atingida
                //if (width >= 100) {
                //    clearInterval(intervalId);
                //}
            }
        } catch (error) {
            console.error('Erro na requisição para barra de progresso:', error);
        }
    }, 1000); // O intervalo de 1000 milissegundos (1 segundo) pode ser ajustado conforme necessário
}

// async function ajustarBarraProgresso(total, nome_tarefa, elem, idIes, tipo) {
//     $(`#${tipo}-total`).text(total);
//     let width = 0;
//     let sucessos;
//     let erros;

//     try {
//         while (width < 100) {
//             const taskResponses = await axios.get(`/tasks/consultar_progresso/${nome_tarefa}/${idIes}`);
//             sucessos = parseInt(taskResponses.data.sucessos)
//             erros = parseInt(taskResponses.data.erros)

//             if (sucessos == -1) return;
//             // debugger        
//             width = Math.floor((sucessos + erros) * 100 / total);
//             $('#' + elem).css({ width: parseFloat(width).toFixed(2) + '%' });
//             $('#' + elem).attr('aria-valuenow', "" + parseFloat(width).toFixed(2));
//             document.getElementById(elem).textContent = parseFloat(width).toFixed(2) + '%';

//             $(`#${tipo}-sucessos`).text(sucessos);
//             $(`#${tipo}-erros`).text(erros);
//             $(`#${tipo}-pendentes`).text(total - (sucessos + erros));
//         }
//     } catch (error) {
//         console.error('Erro na requisição para barra de progresso:', error);
//         // GeraToast('Erro ao tentar carregar rede de colaboração');
//     }


// }


async function processarCurriculos() {
    $(`#bt-processar-curriculos`).attr("disabled", true);
    try {
        // $('#cl-total').text(0);
        // $('#pcl-sucessos').text(0);
        // $('#pcl-erros').text(0);
        // $('#pcl-pendentes').text(0);

        var idIes;

        if($('#cb_seleciona_todas').is(':checked'))
            idIes = 'em_lote';
        else
            idIes = $('#idIes').find(":selected").val();

        const response = await axios.get(`/tasks/processar_curriculos/${idIes}`);
        // let listaIds = response.data;
        //const total = response.data.quantidade

        // var elem = document.getElementById("progresso-processar");
        // await ajustarBarraProgresso(total, "processar_curriculos", "progresso-processar", idIes, "pcl")

    } catch (error) {
        console.error('Erro na requisão de processar curriculos:', error);
        // GeraToast('Erro ao tentar carregar rede de colaboração');
    }
    $(`#bt-processar-curriculos`).attr("disabled", false);
}

async function baixarCurriculos() {
    $(`#bt-baixar-curriculos`).attr("disabled", true);
    try {
        // $('#ccl-total').text(0);
        // $('#ccl-sucessos').text(0);
        // $('#ccl-erros').text(0);
        // $('#ccl-pendentes').text(0);

        var idIes;

        if($('#cb_seleciona_todas').is(':checked'))
            idIes = 'em_lote';
        else
            idIes = $('#idIes').find(":selected").val();

        const response = await axios.get(`/tasks/baixar_curriculos/${idIes}`);
        // const total = response.data.quantidade

        // var elem = document.getElementById("progresso-coletar");
        // await ajustarBarraProgresso(total, "baixar_curriculos", "progresso-coletar", idIes, "ccl")

    } catch (error) {
        console.error('Erro na requisão de baixar curriculos:', error);
        // GeraToast('Erro ao tentar carregar rede de colaboração');
    }
    $(`#bt-baixar-curriculos`).attr("disabled", false);
}

async function processarAba(aba) {
    $(`#bt-processar-curriculos`).attr("disabled", true);
    try {
        // $(`#rcache-${aba}-total`).text(0);
        // $(`#rcache-${aba}-sucessos`).text(0);
        // $(`#rcache-${aba}-erros`).text(0);
        // $(`#rcache-${aba}-pendentes`).text(0);

        var idIes;

        if($('#cb_seleciona_todas').is(':checked'))
            idIes = 'em_lote';
        else
            idIes = $('#idIes').find(":selected").val();

        const response = await axios.get(`/tasks/restaurar_cache/${aba}/${idIes}`);
        // let listaIds = response.data;
        //const total = response.data.quantidade

        // var elem = document.getElementById("progresso-processar");
        // await ajustarBarraProgresso(total, "processar_curriculos", "progresso-processar", idIes, "pcl")

    } catch (error) {
        console.error('Erro na requisão de processar curriculos:', error);
        // GeraToast('Erro ao tentar carregar rede de colaboração');
    }
    $(`#bt-processar-curriculos`).attr("disabled", false);
}

function geraCombinacoesAnos(inicial, final) {
    let combinacoes = [];
    for (let ano1 = inicial; ano1 <= final; ano1++) {
        for (let ano2 = ano1 + 1; ano2 <= final; ano2++) {
            combinacoes.push([ano1, ano2]);
        }
    }
    return combinacoes;
}

async function restaurarCache(tag, endpoint) {
    $(`#bt-restaurar-cache-${tag}`).attr("disabled", true);
    try {
        $(`#rcache-${tag}`).text(0);

        var idIes;

        if($('#cb_seleciona_todas').is(':checked'))
            idIes = 'em_lote';
        else
            idIes = $('#idIes').find(":selected").val();

        var response = await axios.get(`/tasks/limpar_cache/${idIes}`);
        // let listaIds = response.data;
        const total = response.data.quantidade;
        if(total === 0)
            console.log('Cache da IES nao apagado.');

        if(total !== -1) {
            $(`#rcache-${tag}`).text(`Aguardando...`);
            

            const paresAnos = geraCombinacoesAnos(2017,2022);
            const fracaoProcessada = 100 / paresAnos.length;
            var progresso = 0;

            response = await axios.get(`/tasks/lista_programas/${idIes}`);

            const lista_ppgs = response.data.programas;

            $('#titulo-card-restaurar-cache').text(`Restaurando cache de ${lista_ppgs.length} PPGs`)
            debugger;
            for (let i = 0; i < paresAnos.length; i++) {
                const [ano1, ano2] = paresAnos[i];
                $(`#rcache-${tag}`).text(`Carregado ${ano1}-${ano2}`);
                try{
                    for(let p=0; p < lista_ppgs.length; p++){
                        $(`#id-ppg-${tag}`).text(lista_ppgs[p].id);
                        await axios.get(`/ppg/graficos/${endpoint}/${ano1}/${ano2}/${lista_ppgs[p].id}`)
                        progresso += fracaoProcessada/lista_ppgs.length;
                        $(`#progresso-restaurar-cache-${tag}`).css({ width: parseFloat(progresso).toFixed(2) + '%' });
                        $(`#progresso-restaurar-cache-${tag}`).attr('aria-valuenow', "" + parseFloat(progresso).toFixed(2));
                        document.getElementById(`progresso-restaurar-cache-${tag}`).textContent = parseFloat(progresso).toFixed(2) + '%';
                    }
                }
                catch(error){
                    console.log(error);
                }
            }
            $(`#rcache-${tag}`).text(`Carregado`);
            $('#titulo-card-restaurar-cache').text(`Restaurar cache`)

        }

        

        // for (let i = 0; i < paresAnos.length; i++) {
        //     const [ano1, ano2] = paresAnos[i];
        //     $(`#rcache-docentes`).text(`Carregado ${ano1}-${ano2}`);
        //     try{
        //         for(let p=0; p < lista_ppgs.length; p++){
        //             $(`#id-ppg`).text(lista_ppgs[p].id);
        //             await axios.get(`/ppg/graficos/docentes-tab/${ano1}/${ano2}/${lista_ppgs[p].id}`)
        //             progresso += fracaoProcessada/lista_ppgs.length;
        //             $('#progresso-apagar-cache-ies').css({ width: parseFloat(progresso).toFixed(2) + '%' });
        //             $('#progresso-apagar-cache-ies').attr('aria-valuenow', "" + parseFloat(progresso).toFixed(2));
        //             document.getElementById('progresso-apagar-cache-ies').textContent = parseFloat(progresso).toFixed(2) + '%';
        //         }
        //     }
        //     catch(error){
        //         console.log(error);
        //     }
        // }
        // $(`#rcache-docentes`).text(`Carregado`);

        // for (let i = 0; i < paresAnos.length; i++) {
        //     const [ano1, ano2] = paresAnos[i];
        //     $(`#rcache-projetos`).text(`Carregado ${ano1}-${ano2}`);
        //     try{
        //         for(let p=0; p < lista_ppgs.length; p++){
        //             $(`#id-ppg`).text(lista_ppgs[p].id);
        //             await axios.get(`/ppg/graficos/projetos-tab/${ano1}/${ano2}/${lista_ppgs[p].id}`)
        //             progresso += fracaoProcessada/lista_ppgs.length;
        //             $('#progresso-apagar-cache-ies').css({ width: parseFloat(progresso).toFixed(2) + '%' });
        //             $('#progresso-apagar-cache-ies').attr('aria-valuenow', "" + parseFloat(progresso).toFixed(2));
        //             document.getElementById('progresso-apagar-cache-ies').textContent = parseFloat(progresso).toFixed(2) + '%';
        //         }
        //     }
        //     catch(error){
        //         console.log(error);
        //     }
        // }
        // $(`#rcache-projetos`).text(`Carregado`);

        // for (let i = 0; i < paresAnos.length; i++) {
        //     const [ano1, ano2] = paresAnos[i];
        //     $(`#rcache-bancas`).text(`Carregado ${ano1}-${ano2}`);
        //     try{
        //         for(let p=0; p < lista_ppgs.length; p++){
        //             $(`#id-ppg`).text(lista_ppgs[p].id);
        //             await axios.get(`/ppg/graficos/bancas-tab/${ano1}/${ano2}/${lista_ppgs[p].id}`)
        //             progresso += fracaoProcessada/lista_ppgs.length;
        //             $('#progresso-apagar-cache-ies').css({ width: parseFloat(progresso).toFixed(2) + '%' });
        //             $('#progresso-apagar-cache-ies').attr('aria-valuenow', "" + parseFloat(progresso).toFixed(2));
        //             document.getElementById('progresso-apagar-cache-ies').textContent = parseFloat(progresso).toFixed(2) + '%';
        //         }
        //     }
        //     catch(error){
        //         console.log(error);
        //     }
        // }
        // $(`#rcache-bancas`).text(`Carregado`);

        // for (let i = 0; i < paresAnos.length; i++) {
        //     const [ano1, ano2] = paresAnos[i];
        //     $(`#rcache-correlatos`).text(`Carregado ${ano1}-${ano2}`);
        //     try{
        //         for(let p=0; p < lista_ppgs.length; p++){
        //             $(`#id-ppg`).text(lista_ppgs[p].id);
        //             await axios.get(`/ppg/graficos/indicadores-tab-correlatos/${ano1}/${ano2}/${lista_ppgs[p].id}`)
        //             progresso += fracaoProcessada/lista_ppgs.length;
        //             $('#progresso-apagar-cache-ies').css({ width: parseFloat(progresso).toFixed(2) + '%' });
        //             $('#progresso-apagar-cache-ies').attr('aria-valuenow', "" + parseFloat(progresso).toFixed(2));
        //             document.getElementById('progresso-apagar-cache-ies').textContent = parseFloat(progresso).toFixed(2) + '%';
        //         }
        //     }
        //     catch(error){
        //         console.log(error);
        //     }
        // }
        // $(`#rcache-correlatos`).text(`Carregado`);

    } catch (error) {
        console.error('Erro na requisão de restaurar cache:', error);
        $(`#rcache-${tag}`).text(`Erro`);
        // GeraToast('Erro ao tentar carregar rede de colaboração');
    }

    $(`#bt-restaurar-cache-${tag}`).attr("disabled", false);
}

