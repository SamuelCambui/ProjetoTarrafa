const colors = {
  blue: {
    default: "rgba(56, 108, 185, 1)",
    half: "rgba(56, 108, 185, 0.5)",
    quarter: "rgba(56, 108, 185, 0.25)",
    zero: "rgba(56, 108, 185, 0)"
  },
  indigo: {
    default: "rgba(163, 185, 221, 1)",
    half: "rgba(163, 185, 221, 0.5)",
    quarter: "rgba(163, 185, 221, 0.25)",
    zero: "rgba(163, 185, 221, 0)"
  },
  orange: {
    default: "rgba(255, 167, 46, 1)",
    half: "rgba(255, 167, 46, 0.5)",
    quarter: "rgba(255, 167, 46, 0.25)",
    zero: "rgba(255, 167, 46, 0)"
  },
  green: {
    default: "rgba(0, 157, 124, 1)",
    half: "rgba(0, 157, 124, 0.5)",
    quarter: "rgba(0, 157, 124, 0.25)",
    zero: "rgba(0, 157, 124, 0)"
  },
  purple: {
    default: "rgba(73, 32, 124, 1)",
    half: "rgba(73, 32, 124, 0.5)",
    quarter: "rgba(73, 32, 124, 0.25)",
    zero: "rgba(73, 32, 124, 0)"
  },
  pink: {
    default: "rgba(203, 61, 171, 1)",
    half: "rgba(203, 61, 171, 0.5)",
    quarter: "rgba(203, 61, 171, 0.25)",
    zero: "rgba(203, 61, 171, 0)"
  },
  gold: {
    default: "rgba(255, 215, 0, 1)",
    half: "rgba(255, 215, 0, 0.5)",
    quarter: "rgba(255, 215, 0, 0.25)",
    zero: "rgba(255, 215, 0, 0)"
  },
  crimson: {
    default: "rgba(220, 20, 60, 1)",
    half: "rgba(220, 20, 60, 0.5)",
    quarter: "rgba(220, 20, 60, 0.25)",
    zero: "rgba(220, 20, 60, 0)"
  }
};

const blackColors = [
  "#000000",
	"#3f3f3f",
	"#595959",
	"#818181",
	"#a0a0a0"
];

const baseColors = [
  "rgba(0,45,131,0.7)", "rgba(23,83,153,0.7)", "rgba(99,143,188,0.7)", 
  "rgba(181,207,230,0.7)", "rgba(73,32,124,0.7)", "rgba(101,71,145,0.7)", 
  "rgba(157,136,177,0.7)", "rgba(215,201,226,0.7)", "rgba(203,61,171,0.7)",
  "hsla(270, 70%, 50%, 0.7)", "hsla(279, 70%, 50%, 0.7)", "hsla(288, 70%, 50%, 0.7)", 
  "hsla(297, 70%, 50%, 0.7)", "hsla(306, 70%, 50%, 0.7)", "hsla(315, 70%, 50%, 0.7)", 
  "hsla(324, 70%, 50%, 0.7)", "hsla(333, 70%, 50%, 0.7)", "hsla(342, 70%, 50%, 0.7)", 
  "hsla(351, 70%, 50%, 0.7)", "hsla(360, 70%, 50%, 0.7)", "hsla(0, 70%, 50%, 0.7)", 
  "hsla(6, 70%, 50%, 0.7)", "hsla(12, 70%, 50%, 0.7)", "hsla(18, 70%, 50%, 0.7)", 
  "hsla(24, 70%, 50%, 0.7)", "hsla(30, 70%, 50%, 0.7)", "hsla(36, 70%, 50%, 0.7)", 
  "hsla(42, 70%, 50%, 0.7)", "hsla(48, 70%, 50%, 0.7)", "hsla(54, 70%, 50%, 0.7)", 
  "hsla(60, 70%, 50%, 0.7)", "hsla(66, 70%, 50%, 0.7)", "hsla(72, 70%, 50%, 0.7)", 
  "hsla(78, 70%, 50%, 0.7)", "hsla(84, 70%, 50%, 0.7)", "hsla(90, 70%, 50%, 0.7)", 
  "hsla(96, 70%, 50%, 0.7)", "hsla(102, 70%, 50%, 0.7)", "hsla(108, 70%, 50%, 0.7)", 
  "hsla(114, 70%, 50%, 0.7)", "hsla(120, 70%, 50%, 0.7)", "hsla(126, 70%, 50%, 0.7)", 
  "hsla(132, 70%, 50%, 0.7)", "hsla(138, 70%, 50%, 0.7)", "hsla(144, 70%, 50%, 0.7)", 
  "hsla(150, 70%, 50%, 0.7)", "hsla(156, 70%, 50%, 0.7)", "hsla(162, 70%, 50%, 0.7)", 
  "hsla(168, 70%, 50%, 0.7)", "hsla(174, 70%, 50%, 0.7)", "hsla(180, 70%, 50%, 0.7)"
];


// Função que exporta tabela HTML para arquivo excel
function ExportTableHTMLToExcel(type, fileName) {
  var elt = document.getElementById('chartTable');
  var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });

  return XLSX.writeFile(wb, fileName + "." + type);
}

// Salvar chart como imagem
function SaveChart(idChart) {
  const canvas = document.getElementById(idChart);
  const image = canvas.toDataURL('image/png');
  const link = document.createElement('a');

  link.href = image;
  link.download = idChart;
  link.click();
}

// Essa função gera uma tabela html a partir do Array retornado pela requisição e depois a converte para .xlsx (Salva como arquivo excel)
function ExportToExcel(url, fileName, dataSeek, headRows, tipo = 'programa') {
  const anos = (document.getElementById('slider-ppg-geral').value).split(',').map(Number);

	year1 = anos[0];
	year2 = anos[1];

	if (year1 > year2) year1 = year2;
  // //debugger
  if(tipo === 'programa'){
    url += `/id_ppg/${year1}/${year2}`;
  }
  else{
    url += `/${year1}/${year2}`;
  }

  axios.get("ppg/exportar_grafico", {
    headers: {
      'accept': 'application/json',
    },
    params : {
      'url': url
    }
  })
    .then(response => {
      var data;
      data = response.data
      dataSeek.forEach(
        elemento => {
          data = data[elemento]
        }
      )

      var thead = document.getElementById('chartTableHead');
      thead.innerHTML = '';
      // Insere cabeçalho da tabela a partir do atributos presentes em cada elemento do Array
      var headRow = '';
      headRows.forEach(
        h => {
          headRow += `<th>${h}</th>`;
        }
      )

      thead.innerHTML = headRow;

      var tbody = document.getElementById('chartTableBody');
      tbody.innerHTML = '';

      if(typeof data === "object"){
        for (let key in data) {
            var row = '';
            if(typeof data[key] != "object"){
              row += `<td>${key}</td>`
              row += `<td>${data[key]}</td>`
            }
            else if(typeof data[key] === "object" && !Array.isArray(data[key]) == true){
              if(parseInt(key, 10) >= year1){
                row += `<td>${key}</td>`
              }
              for (v in data[key]){
                row += `<td>${data[key][v]}</td>`
              }
            }
            else{
              for (v in data[key]){
                row += `<td>${v}</td>`
              }
            }
            tbody.innerHTML += "<tr>" + row + "</tr>";
          }
      }

      ExportTableHTMLToExcel('xlsx', 'dados_' + fileName);
    })
    .catch(error => {
      console.error('Table error: ', error);
    });
}

function selectPPG(sel) {
  const url = new URL(window.location.href);
  const token = url.searchParams.get('token');
  //const urldest = `/ppg.html?token=${encodeURIComponent(token)}&id=${sel.options[sel.selectedIndex].value}&nome=${sel.options[sel.selectedIndex].label}`;
  const urldest = `/ppg.html?id=${sel.options[sel.selectedIndex].value}&nome=${sel.options[sel.selectedIndex].label}&area=${sel.options[sel.selectedIndex].text}`;
  document.location.href = urldest;
}

function selectIndex(sel) {
  const url = new URL(window.location.href);
  const token = url.searchParams.get('token');
  const urldest = `/home.html`;//?token=${encodeURIComponent(token)}`;
  document.location.href = urldest;
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function countOccurrences(arr) {
  const counts = {};
  arr.forEach(value => {
    counts[value] = (counts[value] || 0) + 1;
  });
  return counts;
}

function GeraToast(msg, complemento = 'danger'){
	document.getElementById('toasts').innerHTML += 
	`
		<div class="toast fase show" role="alert" aria-live="assertive" aria-atomic="true">
			<div class="toast-header">
			<strong class="me-auto">Notificação</strong>
			<small>Agora mesmo</small>
			<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
			</div>
			<div class="toast-body">
				<p class="text-${complemento}">${msg}</p>
			</div>
		</div>
	`;
}

// function testToken() {
//   const url = new URL(window.location.href);
//   const token = Cookies.get('token');
//   //const token = decodeURIComponent(url.searchParams.get('token'));

//   axios.get('http://localhost:8000/api/v1/login/test-token', {
//     headers: {
//       'accept': 'application/json',
//       'Authorization': `Bearer ${token}`
//     }
//   })
//   .then(response => {
//     const avatar = sessionStorage.getItem('avatar');
//     const nome = sessionStorage.getItem('nome');
//     if (avatar)
//       $('#avatar-usuario').attr('src', avatar);
//     if (nome === null)
//       $('#nome-usuario').text('Usuário');
//     $('#nome-usuario').text(nome);

//     const user = response.data;
//     if(user.is_superuser === true)
//       $('#link-usuarios').show()
//     else $('#link-usuarios').hide()

//   })
// 	.catch(error => {
//     if (error.response) {
//       // The request was made and the server responded with a status code
//       // that falls out of the range of 2xx
//       console.log(error.response.data);
//       console.log(error.response.status);
//       console.log(error.response.headers);
//       document.location.href = 'login.html';
//     } 
// 		console.error('Error fetching test token: ', error);
// 	});

// }

// function logout(event) {
//   event.preventDefault();
//   const url = new URL(window.location.href);
//   const token = decodeURIComponent(url.searchParams.get('token'));

//   axios.get('http://localhost:8000/api/v1/logout/access-token', {
//     headers: {
//       'accept': 'application/json',
//       'Authorization': `Bearer ${token}`
//     }
//   })
//     .then(response => {
//       const url = response.data.redirect;
//       // Redirect the user to the destination page
//       document.location.href = url;
//     })
//     .catch(error => {
//       console.error('Logout error:', error);
//     });
// }

// $(document).ready(function(){
//   const token = Cookies.get('token');

//   axios.get('/api/v1/users/me', {
//     headers: {
//       'accept': 'application/json',
//       'Authorization': `Bearer ${token}`
//     }
//   })
//     .then(response => {
//       const user = response.data;

//       var menu = document.getElementById('menu');
//       menu.innerHTML = '';

//       // Insere opções globais
//       var opcoes = `
//         <a class="dropdown-item" href="#" onclick="selectIndex(this)"><i class="fa fa-home fa-sm fa-fw me-2 text-gray-400"></i> Início</a>
//       `;
      
//       // Insere opções de nível admin
//       //if(user.is_admin === true){
//         opcoes += `
//           <div class="dropdown-divider"></div>
//           <a class="dropdown-item" href="usuarios.html"><i class="fas fa-users-cog fa-sm fa-fw me-2 text-gray-400"></i>Usuários</a>
//         `;
//       //}

//       // Insere opções de nível superuser
//       if(user.is_superuser === true){
//         opcoes += `
//           <a class="dropdown-item" href="logs.html"><i class="fas fa-clock fa-sm fa-fw me-2 text-gray-400"></i>Logs</a>
//           <a class="dropdown-item" href="popups.html"><i class="fas fa-window-restore fa-sm fa-fw me-2 text-gray-400"></i>Pop-Ups</a>
//         `;
//       }

//       menu.innerHTML += opcoes;
//     })
//     .catch(error => {
//       console.error('Link menu error:', error);
//     });

// })

// $('#logout').click(
//   function (event) {
//     event.preventDefault();
//     const url = new URL(window.location.href);
//     const token = Cookies.get('token');//decodeURIComponent(url.searchParams.get('token'));

//     axios.get('/api/v1/logout/access-token', {
//       headers: {
//         'accept': 'application/json',
//         'Authorization': `Bearer ${token}`
//       }
//     })
//       .then(response => {
//         const url = response.data.redirect;
//         // Redirect the user to the destination page
//         document.location.href = url;
//       })
//       .catch(error => {
//         console.error('Logout error:', error);
//       });
//   }
// );

// document.getElementById('logout').addEventListener('click', logout);

/*$('#link-usuarios').click(function (event) {
  event.preventDefault();
  const url = new URL(window.location.href);
  const token = Cookies.get('token');//decodeURIComponent(url.searchParams.get('token'));

  axios.get('/api/v1/users/me', {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      const user = response.data;
      if (user.is_superuser === true)
        document.location.href = '/usuarios.html';
    })
    .catch(error => {
      console.error('Logout error:', error);
    });

});*/


