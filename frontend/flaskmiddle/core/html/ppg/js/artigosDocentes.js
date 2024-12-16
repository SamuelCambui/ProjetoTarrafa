function listar_artigos(ano) {
  fetch(`/ppg/listarartigos/${ano}`)
    .then(response => response.json())
    .then(data => {
      let html = '';
      let lista_artigos = data;

      lista_artigos.forEach(artigo => {
        html += `<tr class="border-b border-b-gray-300">
          <td class="py-3.5 px-3">${artigo['id_dupl'] + 1}</td>
          <td class="py-3.5 px-3">${artigo['nome_producao']}</td>
          <td class="py-3.5 px-3">${artigo['duplicado'] > 0 ? 'Sim' : ''}</td>
          <td class="py-3.5 px-3">
            <ul>`
              artigo['programas'].forEach(ppg => {
                html += `<li>${ppg.toLowerCase()}</li>`;
              });

        html += `</ul>          
          </td>
        </tr>`;
      });
      document.getElementById('tbody-lista-artigos').innerHTML = html;
    })
    .catch(error => {
      console.error('Error fetching articles:', error);
      document.getElementById('tbody-lista-artigos').innerHTML = "Nenhum artigo foi encontrado";
    });
}

document.getElementById('btn-listar-artigos').addEventListener('click', () => {
  let ano = document.getElementById('inputAno').value;
  listar_artigos(ano);
});
