export const ordenaTabela = () => { 

    const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;

    const comparer = (idx, asc) => (a, b) => {
        const valA = getCellValue(a, idx);
        const valB = getCellValue(b, idx);
        
        if (!isNaN(valA) && !isNaN(valB)) {
            return asc ? valA - valB : valB - valA;
        } else {
            return asc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
    };

    document.querySelectorAll('th').forEach(th => {
        th.addEventListener('click', () => {
            const table = th.closest('table');
            const tbody = table.querySelector('tbody');
            const headerIndex = Array.from(th.parentNode.children).indexOf(th);
            const rows = Array.from(tbody.querySelectorAll('tr'));

            let asc = true; 
            
            if (th.classList.contains('asc')) {
                asc = false;
                th.classList.remove('asc');
                th.classList.add('desc');
            } else {
                asc = true;
                th.classList.remove('desc');
                th.classList.add('asc');
            }
            
            table.querySelectorAll('th span').forEach(span => {
                span.innerHTML = ''; 
            });
    
            const arrowSpan = th.querySelector('span');
            arrowSpan.innerHTML = asc ? '&#9650;' : '&#9660;';

            rows.sort(comparer(headerIndex, asc)).forEach(row => tbody.appendChild(row));
        });
    })
}