const colors = {
  blue: {
    default: "rgba(56, 108, 185, 1)",
    half: "rgba(56, 108, 185, 0.5)",
    quarter: "rgba(56, 108, 185, 0.25)",
    zero: "rgba(56, 108, 185, 0)",
  },
  indigo: {
    default: "rgba(163, 185, 221, 1)",
    half: "rgba(163, 185, 221, 0.5)",
    quarter: "rgba(163, 185, 221, 0.25)",
    zero: "rgba(163, 185, 221, 0)",
  },
  orange: {
    default: "rgba(255, 167, 46, 1)",
    half: "rgba(255, 167, 46, 0.5)",
    quarter: "rgba(255, 167, 46, 0.25)",
    zero: "rgba(255, 167, 46, 0)",
  },
  green: {
    default: "rgba(0, 157, 124, 1)",
    half: "rgba(0, 157, 124, 0.5)",
    quarter: "rgba(0, 157, 124, 0.25)",
    zero: "rgba(0, 157, 124, 0)",
  },
  purple: {
    default: "rgba(73, 32, 124, 1)",
    half: "rgba(73, 32, 124, 0.5)",
    quarter: "rgba(73, 32, 124, 0.25)",
    zero: "rgba(73, 32, 124, 0)",
  },
  pink: {
    default: "rgba(203, 61, 171, 1)",
    half: "rgba(203, 61, 171, 0.5)",
    quarter: "rgba(203, 61, 171, 0.25)",
    zero: "rgba(203, 61, 171, 0)",
  },
  gold: {
    default: "rgba(255, 215, 0, 1)",
    half: "rgba(255, 215, 0, 0.5)",
    quarter: "rgba(255, 215, 0, 0.25)",
    zero: "rgba(255, 215, 0, 0)",
  },
  crimson: {
    default: "rgba(220, 20, 60, 1)",
    half: "rgba(220, 20, 60, 0.5)",
    quarter: "rgba(220, 20, 60, 0.25)",
    zero: "rgba(220, 20, 60, 0)",
  },
};

const blackColors = ["#000000", "#3f3f3f", "#595959", "#818181", "#a0a0a0"];

const baseColors = [
  "rgba(0,45,131,0.7)",
  "rgba(23,83,153,0.7)",
  "rgba(99,143,188,0.7)",
  "rgba(181,207,230,0.7)",
  "rgba(73,32,124,0.7)",
  "rgba(101,71,145,0.7)",
  "rgba(157,136,177,0.7)",
  "rgba(215,201,226,0.7)",
  "rgba(203,61,171,0.7)",
  "hsla(270, 70%, 50%, 0.7)",
  "hsla(279, 70%, 50%, 0.7)",
  "hsla(288, 70%, 50%, 0.7)",
  "hsla(297, 70%, 50%, 0.7)",
  "hsla(306, 70%, 50%, 0.7)",
  "hsla(315, 70%, 50%, 0.7)",
  "hsla(324, 70%, 50%, 0.7)",
  "hsla(333, 70%, 50%, 0.7)",
  "hsla(342, 70%, 50%, 0.7)",
  "hsla(351, 70%, 50%, 0.7)",
  "hsla(360, 70%, 50%, 0.7)",
  "hsla(0, 70%, 50%, 0.7)",
  "hsla(6, 70%, 50%, 0.7)",
  "hsla(12, 70%, 50%, 0.7)",
  "hsla(18, 70%, 50%, 0.7)",
  "hsla(24, 70%, 50%, 0.7)",
  "hsla(30, 70%, 50%, 0.7)",
  "hsla(36, 70%, 50%, 0.7)",
  "hsla(42, 70%, 50%, 0.7)",
  "hsla(48, 70%, 50%, 0.7)",
  "hsla(54, 70%, 50%, 0.7)",
  "hsla(60, 70%, 50%, 0.7)",
  "hsla(66, 70%, 50%, 0.7)",
  "hsla(72, 70%, 50%, 0.7)",
  "hsla(78, 70%, 50%, 0.7)",
  "hsla(84, 70%, 50%, 0.7)",
  "hsla(90, 70%, 50%, 0.7)",
  "hsla(96, 70%, 50%, 0.7)",
  "hsla(102, 70%, 50%, 0.7)",
  "hsla(108, 70%, 50%, 0.7)",
  "hsla(114, 70%, 50%, 0.7)",
  "hsla(120, 70%, 50%, 0.7)",
  "hsla(126, 70%, 50%, 0.7)",
  "hsla(132, 70%, 50%, 0.7)",
  "hsla(138, 70%, 50%, 0.7)",
  "hsla(144, 70%, 50%, 0.7)",
  "hsla(150, 70%, 50%, 0.7)",
  "hsla(156, 70%, 50%, 0.7)",
  "hsla(162, 70%, 50%, 0.7)",
  "hsla(168, 70%, 50%, 0.7)",
  "hsla(174, 70%, 50%, 0.7)",
  "hsla(180, 70%, 50%, 0.7)",
];

// Função que exporta tabela HTML para arquivo excel
const ExportTableHTMLToExcel = (type, fileName) => {
  var elt = document.getElementById("chartTable");
  var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });

  return XLSX.writeFile(wb, fileName + "." + type);
}

// Salvar chart como imagem
const SaveChart = (idChart) => {
  const canvas = document.getElementById(idChart);
  const image = canvas.toDataURL("image/png");
  const link = document.createElement("a");

  link.href = image;
  link.download = idChart;
  link.click();
}

// Essa função gera uma tabela html a partir do Array retornado pela requisição e depois a converte para .xlsx (Salva como arquivo excel)
const exportarParaExcel = (url, fileName, dataSeek) => {
  const token = Cookies.get("token");

  if (!dataSeek)
    // Seguir padrão da página ppg (url + /id_ppg + /year1 + /year2)
    url += `/${sessionStorage.getItem("id_ppg")}/${sessionStorage.getItem("year1")}/${sessionStorage.getItem("year2")}`;

  axios
    .get(url, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      var data;

      switch (
        dataSeek // O parâmetro dataSeek foi criado com o intuito de saber onde o Array está localizado no retorno
      ) {
        case "producoes":
          data = response.data.producoes;
          break;

        case "discentes":
          data = response.data.discentes;
          break;

        default:
          data = response.data;
          break;
      }

      var thead = document.getElementById("chartTableHead");
      thead.innerHTML = "";
      // Insere cabeçalho da tabela a partir do atributos presentes em cada elemento do Array
      var headRow = "";
      for (var key in data[0]) {
        headRow += `<th>${key}</th>`;
      }
      headRow = "<tr>" + headRow + "</tr>";
      thead.innerHTML = headRow;

      var tbody = document.getElementById("chartTableBody");
      tbody.innerHTML = "";
      // Insere dados na tabela
      for (var i = 0; i < data.length; i++) {
        var row = "";
        for (var key in data[i]) {
          row += `<td>${data[i][key]}</td>`;
        }
        tbody.innerHTML += row;
      }

      ExportTableHTMLToExcel("xlsx", "table_" + fileName);
    })
    .catch((error) => {
      console.error("Table error: ", error);
    });
}

const selecionaPPG = (sel) => {
  const url = new URL(window.location.href);
  const token = url.searchParams.get("token");
  const urldest = `/ppg.html?id=${sel.options[sel.selectedIndex].value}&nome=${sel.options[sel.selectedIndex].label}&area=${sel.options[sel.selectedIndex].text}`;
  document.location.href = urldest;
}

const selecionaIndex = () => {
  const url = new URL(window.location.href);
  const token = url.searchParams.get("token");
  const urldest = `/home.html`; //?token=${encodeURIComponent(token)}`;
  document.location.href = urldest;
}

const obterCorAleatoria = () => {
  const corHexadecimal = Math.floor(Math.random() * 0xFFFFFF).toString(16);
  return `#${corHexadecimal.padStart(6, '0')}`;
}

const countOccurrences = (arr) => {
  const counts = {};
  arr.forEach((value) => {
    counts[value] = (counts[value] || 0) + 1;
  });
  return counts;
}

const btnSidebar = document.getElementById("btn-sidebar");
const sidebar = document.getElementById("sidebar"); 
const conteudo = document.getElementById("conteudo")
const nav = document.getElementById("nav-container");
const fecharSidebar = document.getElementById("fechar-sidebar");

const alteraVisibilidadeSidebar = () => {
  const estaEscondido = sidebar.classList.toggle("-translate-x-full"); 
  sidebar.classList.toggle("translate-x-0"); 
  nav.classList.toggle("sm:ml-64")
  conteudo.classList.toggle("sm:ml-64")
  btnSidebar.setAttribute("aria-expanded", !estaEscondido);
  sidebar.setAttribute("aria-hidden", estaEscondido);
}

btnSidebar.addEventListener("click", () => {
  alteraVisibilidadeSidebar()
});

fecharSidebar.addEventListener("click", () => {
  console.log("oi")
  alteraVisibilidadeSidebar()
});

