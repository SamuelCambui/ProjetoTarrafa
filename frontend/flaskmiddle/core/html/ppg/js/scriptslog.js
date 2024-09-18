$(document).ready(function () {
    const token = Cookies.get('token');
  
    axios.get('/api/dados/login/test-token', {
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        const avatar = Cookies.get('avatar');//sessionStorage.getItem('avatar');
			  const nome = Cookies.get('nome');//sessionStorage.getItem('nome');
        if (avatar)
          $('#avatar-usuario').attr('src', avatar);
        if (nome === null)
          $('#nome-usuario').text('Usuário');
        $('#nome-usuario').text(nome);

        window.sessionStorage.setItem('type', 'year');
        window.sessionStorage.setItem('year1', '2023');
        window.sessionStorage.setItem('year2', '2023');
        window.sessionStorage.setItem('id_ppg', 'all');

        //fetchListPrograms();
        fetchChartsLogs();
      })
      .catch(error => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          document.location.href = 'login.html';
        }
      });
  });

  $('#diaForm').on('submit', function(event){
    event.preventDefault();

    var ppg = document.getElementById('list-programs').value;

    if(ppg != ''){
      var day1 = document.getElementById('dia1').value;
      var day2 = document.getElementById('dia2').value;

      window.sessionStorage.setItem('type', 'day');
      window.sessionStorage.setItem('year1', day1);
      window.sessionStorage.setItem('year2', day2);
      window.sessionStorage.setItem('id_ppg', ppg);

      // console.log(ppg, day1, day2);
      fetchChartsLogs();
    }
  });

  $('#mesForm').on('submit', function(event){
    event.preventDefault();

    var ppg = document.getElementById('list-programs').value;

    if(ppg != ''){
      var month1 = document.getElementById('mes1').value;
      var month2 = document.getElementById('mes2').value;

      window.sessionStorage.setItem('type', 'month');
      window.sessionStorage.setItem('year1', month1);
      window.sessionStorage.setItem('year2', month2);
      window.sessionStorage.setItem('id_ppg', ppg);

       // console.log(ppg, month1, month2);
      fetchChartsLogs();
    }
  });

  $('#anoForm').on('submit', function(event){
    event.preventDefault();

    var ppg = document.getElementById('list-programs').value;

    if(ppg != ''){
      var year1 = document.getElementById('ano1').value;
      var year2 = document.getElementById('ano2').value;

      window.sessionStorage.setItem('type', 'year');
      window.sessionStorage.setItem('year1', year1);
      window.sessionStorage.setItem('year2', year2);
      window.sessionStorage.setItem('id_ppg', ppg);

      // console.log(ppg, year1, year2);
      fetchChartsLogs();
    }
  });

  $('.clear-inputs').click(function(event){
    event.preventDefault();
  
    document.getElementById('dia1').value = '';
    document.getElementById('dia2').value = '';
    document.getElementById('mes1').value = '';
    document.getElementById('mes2').value = '';
    document.getElementById('ano1').value = '';
    document.getElementById('ano2').value = '';
  })


function fetchChartsLogs(){
    log_fetchLogAcessos('chartlogacessos');
    log_fetchLogGrafos('chartloggrafos');
  }
  
  
  // Fetchers logs
function log_fetchLogAcessos(idCanvas) {
    const token = getTokenFromURL();
    
    const name = 'acessos';
    const type = window.sessionStorage.getItem('type');
    const delimiter1 = window.sessionStorage.getItem('year1');
    const delimiter2 = window.sessionStorage.getItem('year2');
    const id = window.sessionStorage.getItem('id_ppg');
    
    axios.get(`/api/dados/super_user/logs/${name}/${type}/${delimiter1}/${delimiter2}/${id}`, {
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        const listLogAcessos = response.data;
        log_renderChartLogAcessos(idCanvas, listLogAcessos);
      })
      .catch(error => {
        console.error('Error fetching list log_acessos: ', error);
      });
  }
  
function log_fetchLogGrafos(idCanvas) {
    const token = getTokenFromURL();
  
    const name = 'grafos';
    const type = window.sessionStorage.getItem('type');
    const delimiter1 = window.sessionStorage.getItem('year1');
    const delimiter2 = window.sessionStorage.getItem('year2');
    const id = window.sessionStorage.getItem('id_ppg');
  
    axios.get(`/api/dados/super_user/logs/${name}/${type}/${delimiter1}/${delimiter2}/${id}`, {
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        const listLogGrafos = response.data;
        log_renderChartLogGrafos(idCanvas, listLogGrafos);
      })
      .catch(error => {
        console.error('Error fetching list log_grafos: ', error);
      });
  }
  