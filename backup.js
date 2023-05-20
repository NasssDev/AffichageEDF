readXlsxFile(file).then((rows) => {
    console.log(rows)
    exceltable.innerHTML = "";
    rows.forEach((row) => {
        let tr = document.createElement('tr');
        row.forEach((cell) => {

            const td = document.createElement('td');
            if (Object.prototype.toString.call(cell) === '[object Date]') {
                const date = cell;
                //const hours = date.getUTCHours().toString().padStart(2, "0");
                //const minutes = date.getUTCMinutes().toString().padStart(2, "0");
                const offset = date.getTimezoneOffset();
                offset === -60 ? date.setHours(date.getHours() + 11) : date.setHours(date.getHours() + 10);
                const options = {
                    timeZone: "Europe/Paris",
                    hour12: false,
                    hour: "2-digit",
                    minute: "2-digit"
                };
                td.textContent = date.toLocaleString("fr-FR", options);
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