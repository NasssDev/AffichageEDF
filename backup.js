const pdftk = require('node-pdftk');
const readXlsxFile = require('read-excel-file/node');
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const app = express();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'excelupload/'); // définit le dossier de destination des fichiers
    },
    filename: function (req, file, cb) {
        cb(null, 'affichage'); // définit le nom du fichier sur le serveur
    },
    overwrite: true // active l'écrasement des fichiers avec le même nom
});

const upload = multer({storage: storage});

// on définit le dossier public pour les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/upload', upload.single('excelfile'), (req, res, next) => {
    // TODO: gérer l'upload du fichier
    // récupérer les données du fichier Excel envoyé dans la requête
    let fileName = "";
    let fileCounters = {};
    let inputToFill = {
        "DATE1": "",
        "DATE2": "",
        "DATE3": "",
        "DATE4": "",
        "HORAIRE1": "",
        "HORAIRE2": "",
        "HORAIRE3": "",
        "HORAIRE4": "",
        "NOM_PRENOM1": "",
        "NOM_PRENOM2": "",
        "NOM_PRENOM3": "",
        "NOM_PRENOM4": "",
        "REUNION1": "",
        "REUNION2": "",
        "REUNION3": "",
        "REUNION4": "",
        "CONTACT1": "",
        "CONTACT2": "",
        "CONTACT3": "",
        "CONTACT4": "",
    };
    fs.readdir("./storage", (err, files) => {
        if (err) throw err;

        if (files.length === 0) {
            console.log('Le répertoire est vide.');
            return;
        }
        for (const file of files) {
            fs.unlink(path.join("./storage", file), (err) => {
                if (err) throw err;
            });
        }
    });
    readXlsxFile('excelupload/affichage').then((rows) => {
        let removedOccurenceUnusefull = rows.shift();
        rows.forEach((row) => {
            let administrator = "";
            row.forEach((cell) => {
                if (cell.includes("CAP AMPERE-MUT-")) {
                    const regex = /CAP AMPERE-MUT-(.{7})/;
                    cell = regex.exec(cell);
                    fileName = cell[1];
                    if (fileCounters[fileName]) {
                        fileCounters[fileName]++;
                    } else {
                        fileCounters[fileName] = 1;
                    }
                }

                row[1].includes(" - externe") ? administrator = row[1].replace(" - externe", "") : administrator = row[1];
                inputToFill["NOM_PRENOM" + fileCounters[fileName]] = administrator;
                inputToFill["CONTACT" + fileCounters[fileName]] = administrator;

                if (Object.prototype.toString.call(cell) === '[object Date]') {

                    const dateOptions = {
                        month: "2-digit",
                        day: "2-digit"
                    };
                    const hoursBegin = row[2].getUTCHours();
                    const minutesBegin = row[2].getUTCMinutes();
                    const hoursEnd = row[3].getUTCHours();
                    const minutesEnd = row[3].getUTCMinutes();

                    inputToFill["DATE" + fileCounters[fileName]] = row[2].toLocaleDateString("fr-FR", dateOptions);
                    inputToFill["HORAIRE" + fileCounters[fileName]] = hoursBegin.toString().padStart(2, "0") + ":" + minutesBegin.toString().padStart(2, "0") + "\n" + hoursEnd.toString().padStart(2, "0") + ":" + minutesEnd.toString().padStart(2, "0");
                }
            })
            if (fileName !== "") {
                console.log(inputToFill)
                pdftk.input('./template/' + fileName + '.pdf')
                    .fillForm(inputToFill)
                    .output("./storage/" + fileName + "_filled.pdf")
                    .then(buf => {
                        let bro = buf;
                        // res.type('application/pdf'); // If you omit this line, file will download
                        // res.send(buf);
                    })
                    .catch(next);
            }
        });
    });

    //res.send(rows);
});

app.listen(3000, () => {
    console.log('Le serveur est démarré sur le port 3000');
});



//////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////
                                    // BACKUP2 //

const pdftk = require('node-pdftk');
const readXlsxFile = require('read-excel-file/node');
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const app = express();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'excelupload/'); // définit le dossier de destination des fichiers
    },
    filename: function (req, file, cb) {
        cb(null, 'affichage'); // définit le nom du fichier sur le serveur
    },
    overwrite: true // active l'écrasement des fichiers avec le même nom
});

const upload = multer({storage: storage});

// on définit le dossier public pour les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/upload', upload.single('excelfile'), (req, res, next) => {
    // TODO: gérer l'upload du fichier
    // récupérer les données du fichier Excel envoyé dans la requête
    let fileName = "";
    let fileCounters = {};
    let fileCountersBase = {};
    let keepInputToFill = {};
    let inputToFill = {
        "DATE1": "",
        "DATE2": "",
        "DATE3": "",
        "DATE4": "",
        "HORAIRE1": "",
        "HORAIRE2": "",
        "HORAIRE3": "",
        "HORAIRE4": "",
        "NOM_PRENOM1": "",
        "NOM_PRENOM2": "",
        "NOM_PRENOM3": "",
        "NOM_PRENOM4": "",
        "REUNION1": "",
        "REUNION2": "",
        "REUNION3": "",
        "REUNION4": "",
        "CONTACT1": "",
        "CONTACT2": "",
        "CONTACT3": "",
        "CONTACT4": "",
    };
    fs.readdir("./storage", (err, files) => {
        if (err) throw err;

        if (files.length === 0) {
            console.log('Le répertoire est vide.');
            return;
        }
        for (const file of files) {
            fs.unlink(path.join("./storage", file), (err) => {
                if (err) throw err;
            });
        }
    });
    readXlsxFile('excelupload/affichage').then((rows) => {
        let removedFirstOccurenceUnusefull = rows.shift();
        rows.forEach((line) => {
            const regex = /CAP AMPERE-MUT-(.{7})/;
            let cell = regex.exec(line[0]);
            fileName = cell[1];
            if (fileCountersBase[fileName]) {
                fileCountersBase[fileName]++;
            } else {
                fileCountersBase[fileName] = 1;
            }
        })
        rows.forEach((row) => {
            let administrator = "";
            // row.forEach((cell) => {})
            // if (row[0].includes("CAP AMPERE-MUT-")) {}
            const regex = /CAP AMPERE-MUT-(.{7})/;
            let cell = regex.exec(row[0]);
            fileName = cell[1];
            if (fileCounters[fileName]) {
                fileCounters[fileName]++;
            } else {
                fileCounters[fileName] = 1;
            }


            row[1].includes(" - externe") ? administrator = row[1].replace(" - externe", "") : administrator = row[1];
            inputToFill["NOM_PRENOM" + fileCounters[fileName]] = administrator;
            inputToFill["CONTACT" + fileCounters[fileName]] = administrator;

            //if (Object.prototype.toString.call(row[2]) === '[object Date]') {}

            const dateOptions = {
                month: "2-digit",
                day: "2-digit"
            };
            const hoursBegin = row[2].getUTCHours();
            const minutesBegin = row[2].getUTCMinutes();
            const hoursEnd = row[3].getUTCHours();
            const minutesEnd = row[3].getUTCMinutes();

            inputToFill["DATE" + fileCounters[fileName]] = row[2].toLocaleDateString("fr-FR", dateOptions);
            inputToFill["HORAIRE" + fileCounters[fileName]] = hoursBegin.toString().padStart(2, "0") + ":" + minutesBegin.toString().padStart(2, "0") + "\n" + hoursEnd.toString().padStart(2, "0") + ":" + minutesEnd.toString().padStart(2, "0");
            console.log(fileCounters)
            console.log(fileCountersBase)
            if (fileCounters[fileName] !== fileCountersBase[fileName]) {
                keepInputToFill[fileName] = inputToFill;
                // console.log(keepInputToFill);
            } else if (fileCountersBase[fileName] === 1) {
                pdftk.input('./template/' + fileName + '.pdf')
                    .fillForm(inputToFill)
                    .output("./storage/" + fileName + "_filled.pdf")
                    .then(buf => {
                        let bro = buf;
                        // res.type('application/pdf'); // If you omit this line, file will download
                        // res.send(buf);
                    })
                    .catch(next);
            } else if (fileCounters[fileName] === fileCountersBase[fileName]){
                console.log(keepInputToFill[fileName]);
                pdftk.input('./template/' + fileName + '.pdf')
                    .fillForm(keepInputToFill[fileName])
                    .output("./storage/" + fileName + "_filled.pdf")
                    .then(buf => {
                        let bro = buf;
                        // res.type('application/pdf'); // If you omit this line, file will download
                        // res.send(buf);
                    })
                    .catch(next);
            }
        });
    });

    //res.send(rows);
});

app.listen(3000, () => {
    console.log('Le serveur est démarré sur le port 3000');
});


////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////


//BACKUP3

const pdftk = require('node-pdftk');
const readXlsxFile = require('read-excel-file/node');
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const app = express();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'excelupload/'); // définit le dossier de destination des fichiers
    },
    filename: function (req, file, cb) {
        cb(null, 'affichage'); // définit le nom du fichier sur le serveur
    },
    overwrite: true // active l'écrasement des fichiers avec le même nom
});

const upload = multer({storage: storage});

// on définit le dossier public pour les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/upload', upload.single('excelfile'), (req, res, next) => {
    // TODO: gérer l'upload du fichier
    // récupérer les données du fichier Excel envoyé dans la requête
    let fileName = "";
    let fileCounters = {};
    let fileCountersBase = {};
    let allInputsToFill = {};
    let inputToFill = {
        "DATE1": "",
        "DATE2": "",
        "DATE3": "",
        "DATE4": "",
        "HORAIRE1": "",
        "HORAIRE2": "",
        "HORAIRE3": "",
        "HORAIRE4": "",
        "NOM_PRENOM1": "",
        "NOM_PRENOM2": "",
        "NOM_PRENOM3": "",
        "NOM_PRENOM4": "",
        "REUNION1": "",
        "REUNION2": "",
        "REUNION3": "",
        "REUNION4": "",
        "CONTACT1": "",
        "CONTACT2": "",
        "CONTACT3": "",
        "CONTACT4": "",
    };
    fs.readdir("./storage", (err, files) => {
        if (err) throw err;

        if (files.length === 0) {
            console.log('Le répertoire est vide.');
            return;
        }
        for (const file of files) {
            fs.unlink(path.join("./storage", file), (err) => {
                if (err) throw err;
            });
        }
    });
    readXlsxFile('excelupload/affichage').then((rows) => {
        let removedFirstOccurenceUnusefull = rows.shift();
        rows.forEach((line) => {
            const regex = /CAP AMPERE-MUT-(.{7})/;
            let cell = regex.exec(line[0]);
            fileName = cell[1];
            if (fileCountersBase[fileName]) {
                fileCountersBase[fileName]++;
            } else {
                fileCountersBase[fileName] = 1;
            }
        })
        rows.forEach((row) => {
            let administrator = "";
            // row.forEach((cell) => {})
            // if (row[0].includes("CAP AMPERE-MUT-")) {}
            const regex = /CAP AMPERE-MUT-(.{7})/;
            let cell = regex.exec(row[0]);
            fileName = cell[1];
            if (fileCounters[fileName]) {
                fileCounters[fileName]++;
            } else {
                fileCounters[fileName] = 1;
            }


            row[1].includes(" - externe") ? administrator = row[1].replace(" - externe", "") : administrator = row[1];
            inputToFill["NOM_PRENOM" + fileCounters[fileName]] = administrator;
            inputToFill["CONTACT" + fileCounters[fileName]] = administrator;

            //if (Object.prototype.toString.call(row[2]) === '[object Date]') {}

            const dateOptions = {
                month: "2-digit",
                day: "2-digit"
            };
            const hoursBegin = row[2].getUTCHours();
            const minutesBegin = row[2].getUTCMinutes();
            const hoursEnd = row[3].getUTCHours();
            const minutesEnd = row[3].getUTCMinutes();

            inputToFill["DATE" + fileCounters[fileName]] = row[2].toLocaleDateString("fr-FR", dateOptions);
            inputToFill["HORAIRE" + fileCounters[fileName]] = hoursBegin.toString().padStart(2, "0") + ":" + minutesBegin.toString().padStart(2, "0") + "\n" + hoursEnd.toString().padStart(2, "0") + ":" + minutesEnd.toString().padStart(2, "0");
            //console.log(fileCounters)
            console.log(inputToFill)

            allInputsToFill[fileName] = inputToFill;

            // if (fileCounters[fileName] !== fileCountersBase[fileName]) {
            //     keepInputToFill[fileName] = inputToFill;
            //     // console.log(keepInputToFill);
            // } else if (fileCountersBase[fileName] === 1) {
            //     pdftk.input('./template/' + fileName + '.pdf')
            //         .fillForm(inputToFill)
            //         .output("./storage/" + fileName + "_filled.pdf")
            //         .then(buf => {
            //             let bro = buf;
            //             // res.type('application/pdf'); // If you omit this line, file will download
            //             // res.send(buf);
            //         })
            //         .catch(next);
            // } else if (fileCounters[fileName] === fileCountersBase[fileName]){}
            //     console.log(keepInputToFill[fileName]);
            //     pdftk.input('./template/' + fileName + '.pdf')
            //         .fillForm(keepInputToFill[fileName])
            //         .output("./storage/" + fileName + "_filled.pdf")
            //         .then(buf => {
            //             let bro = buf;
            //             // res.type('application/pdf'); // If you omit this line, file will download
            //             // res.send(buf);
            //         })
            //         .catch(next);

        });
        console.log(allInputsToFill)
    });

    //res.send(rows);
});

app.listen(3000, () => {
    console.log('Le serveur est démarré sur le port 3000');
});
