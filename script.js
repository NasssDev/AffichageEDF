const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
    const formData = new FormData(form);
    fetch('/upload', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error(error);
        });
});
let inputexcelfile = document.getElementById("excelfile");
let exceltable = document.getElementById("exceltable");
inputexcelfile.addEventListener('change', (event) => {

    const file = event.target.files[0];
    console.log(file)
    readXlsxFile(file).then((rows) => {
        exceltable.innerHTML = "";
        rows.forEach((row) => {
            let tr = document.createElement('tr');
            row.forEach((cell) => {

                const td = document.createElement('td');
                if (Object.prototype.toString.call(cell) === '[object Date]') {
                    const date = cell;
                    const offset = date.getTimezoneOffset();
                    offset === -60 ? date.setHours(date.getHours() + 11) : date.setHours(date.getHours() + 10);
                    const options = {
                        timeZone: "Europe/Paris",
                        hour12: false,
                        hour: "2-digit",
                        minute: "2-digit"
                    };
                    td.textContent = date.toLocaleTimeString("fr-FR", options);
                }else{
                    const regex = /CAP AMPERE-MUT-(.{7})/;
                    const result = regex.exec(cell);

                    if (cell.includes(" - externe")) {
                        cell = cell.replace(" - externe", "");
                    }
                    result ? td.textContent = result[1] : td.textContent = cell
                }
                tr.appendChild(td);
            })
            exceltable.appendChild(tr);
        })
    })
})