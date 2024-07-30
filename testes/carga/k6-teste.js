import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
    stages: [
        // Rampa de subida: começa com 1 usuário e dobra a cada 30 segundos
        { duration: '30s', target: 1 },   // 1 usuário
        { duration: '30s', target: 2 },   // 2 usuários
        { duration: '30s', target: 4 },   // 4 usuários
        { duration: '30s', target: 8 },   // 8 usuários
        { duration: '30s', target: 16 },  // 16 usuários
        { duration: '30s', target: 32 },  // 32 usuários pico momentâneo

        // Manter 30 usuários por 1 minuto
        { duration: '1m', target: 30 },

        // Rampa de descida
        { duration: '30s', target: 16 },  // Reduz para 16 usuários
        { duration: '30s', target: 8 },   // Reduz para 8 usuários
        { duration: '30s', target: 4 },   // Reduz para 4 usuários
        { duration: '30s', target: 2 },   // Reduz para 2 usuários
        { duration: '30s', target: 0 }    // Reduz para 0 usuários
    ]
};

export default function () {
  http.get('http://localhost:8006/ppg/indicadores/32014015010P7/2020/2021');
  sleep(1);  // Pausa de 1 segundo entre as requisições
}