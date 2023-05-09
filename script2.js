const pdftk = require('node-pdftk');
const readXlsxFile = require('read-excel-file/node');
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {exec} = require('child_process');


const app = express();


const excelupload = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'excelupload/'); // définit le dossier de destination des fichiers
    },
    filename: function (req, file, cb) {
        cb(null, 'affichage'); // définit le nom du fichier sur le serveur
    },
    overwrite: true // active l'écrasement des fichiers avec le même nom
});

const upload = multer({storage: excelupload});

// je défini le dossier public pour les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/upload', upload.single('excelfile'), (req, res, next) => {

    let allInputsToFill = {};

    deleteFiles();

    readXlsxFile('excelupload/affichage').then((rows) => {

        // Objet pour stocker les occurrences de fichiers PDF
        const fileOccurrences = {};

        // je retire la première occurence qui ne sont que les en-têtes du excel
        rows.shift();

        rows.forEach(([fileName, adminName, timeToStart, timeToFinish]) => {
            //console.log(fileName+" "+adminName+" "+timeToStart+" "+timeToFinish)
            let DATE;
            let ADMINAME;
            let CONTACT;

            let HORAIRE;
            // je retire tout ce qui ne m'intéresse pas dans la string fileName
            const regex = /CAP AMPERE-MUT-(.{7})/;
            let goodName = regex.exec(fileName);

            fileName = goodName[1];

            // je retire ce qui n'est pas utile dans la string adminName
            if (adminName.includes(" - externe")) adminName = adminName.replace(" - externe", "");
            // je fais un saut de ligne entre le nom et le prenom
            if (adminName.includes(" ")) adminName = adminName.replace(" ", "\n");

            // je formatte l'heure comme il faut
            const hoursBegin = timeToStart.getUTCHours().toString().padStart(2, "0");
            const minutesBegin = timeToStart.getUTCMinutes().toString().padStart(2, "0");
            const hoursEnd = timeToFinish.getUTCHours().toString().padStart(2, "0");
            const minutesEnd = timeToFinish.getUTCMinutes().toString().padStart(2, "0");
            // je récupère simplement le jour et le mois dans le format FR
            const dateOfMeeting = timeToStart.toLocaleDateString("fr-FR", {month: "2-digit", day: "2-digit"})
            // je vérifie si le fichier PDF existe déjà dans les occurrences
            if (fileOccurrences[fileName]) {
                // Le fichier existe déjà, j'utilise le compteur actuel pour incrémenter les champs
                ADMINAME = `NOM_PRENOM${fileOccurrences[fileName]}`;
                CONTACT = `CONTACT${fileOccurrences[fileName]}`;
                HORAIRE = `HORAIRE${fileOccurrences[fileName]}`;

                allInputsToFill[fileName][ADMINAME] = adminName;
                allInputsToFill[fileName][CONTACT] = adminName;
                allInputsToFill[fileName][HORAIRE] = hoursBegin + ":" + minutesBegin + "\n" + hoursEnd + ":" + minutesEnd;
                fileOccurrences[fileName]++; // j'incrémente le compteur pour la prochaine occurrence
            } else {
                allInputsToFill[fileName] = {};
                allInputsToFill[fileName]["DATE1"] = dateOfMeeting;
                allInputsToFill[fileName]["NOM_PRENOM1"] = adminName;
                allInputsToFill[fileName]["CONTACT1"] = adminName;
                allInputsToFill[fileName]["HORAIRE1"] = hoursBegin + ":" + minutesBegin + "\n" + hoursEnd + ":" + minutesEnd;

                // Définit le compteur à 2 pour la prochaine occurrence
                fileOccurrences[fileName] = 2;
            }
        });

        async function handlePDF() {
            let pdfToConcatenate = "";
            const entries = Object.entries(allInputsToFill);
            const totalIterations = entries.length;
            let currentIteration = 0;
            for (const [file, inputToFill] of entries) {
                pdfToConcatenate += "storage/" + file + "_filled.pdf ";
                currentIteration++;
                await pdftk.input('./template/' + file + '.pdf')
                    .fillForm(inputToFill)
                    .output("./storage/" + file + "_filled.pdf")
                    .catch(next);

                if (currentIteration === totalIterations) {
                    await new Promise((resolve, reject) => {
                        exec("pdftk " + pdfToConcatenate + " template/G00-096_100.pdf cat output storage/Affichage.pdf", {shell: true}, (error, stdout, stderr) => {
                            if (error) {
                                console.error(`Erreur lors de l'exécution de la commande : ${error.message}`);
                                return;
                            }
                            console.log('Commande exécutée avec succès.');
                            resolve();
                        })
                    });
                    res.setHeader('Content-Type', 'application/pdf');
                    res.setHeader('Content-Disposition', 'inline; filename=Affichage.pdf');
                    res.sendFile('storage/Affichage.pdf', { root: __dirname });
                    deleteFiles("filled");
                }
            }
            console.log("PASSSSSSSSSSSS");
        }
        handlePDF()


    });
});
const deleteFiles = (includedStr = "") => {
    fs.readdir("./storage", (err, files) => {
        if (err) throw err;

        if (files.length === 0) {
            console.log('Le répertoire est vide.');
        } else {
            for (const file of files) {
                if (file.includes(includedStr)) {
                    fs.unlink(path.join("./storage", file), (err) => {
                        if (err) throw err;
                    });
                }
            }
        }
    });
}
app.listen(3000, () => {
    console.log('Le serveur est démarré sur le port 3000');
});
