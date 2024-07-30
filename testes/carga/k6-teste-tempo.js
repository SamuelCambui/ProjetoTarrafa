import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
    vus: 300,  // Número de usuários virtuais
    duration: '1m',  // Duração total do teste
};

export default function () {
    let response = http.get('http://localhost:8006/ppg/indicadores/32014015010P7/2020/2021');


    // Verificar o tempo de resposta e registrar se ele está dentro de um limite aceitável
    check(response, {
        'response time is less than 2 seconds': (r) => r.timings.duration < 2000
    });

    sleep(1);
}
