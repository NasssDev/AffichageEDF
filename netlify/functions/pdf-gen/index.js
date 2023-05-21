const pdftk = require("node-pdftk");
const {exec} = require("child_process");
const res = require("express/lib/response");
//const {deleteFiles} = require("../../../script2");


exports.handler = async function (event, context) {
    /**/
    //console.log(event.body);

    // Code susceptible de générer une erreur
    const allInputsToFill = JSON.parse(event.body);
    console.log(allInputsToFill);
    // Autres opérations qui pourraient générer des erreurs


    let pdfToConcatenate = "";
    const entries = Object.entries(allInputsToFill);
    const totalIterations = entries.length;
    let currentIteration = 0;
    try {
        for (const [file, inputToFill] of entries) {
            pdfToConcatenate += "storage/" + file + "_filled.pdf ";
            currentIteration++;
            await pdftk.input('./template/' + file + '.pdf')
                .fillForm(inputToFill)
                .output("./storage/" + file + "_filled.pdf")
                .catch(error => {
                    console.error(error);
                });

            if (currentIteration === totalIterations) {
                await new Promise((resolve) => {
                    exec("pdftk " + pdfToConcatenate + " template/G00-096_100.pdf cat output storage/Affichage.pdf", {shell: true}, (error, stdout, stderr) => {
                        if (error) {
                            console.error(`Erreur lors de l'exécution de la commande : ${error.message}`);
                            return;
                        }
                        console.log('Commande exécutée avec succès.');
                        resolve();
                    })
                });
            }
        }
    } catch (error) {
        // Gestion de l'erreur
        console.error('Une erreur s\'est produite :', error);
        // Autres actions à prendre en cas d'erreur
    }
    console.log("PASSSSSSSSSSSS");


    const fs = require('fs');
    const path = require('path');
    servePDFFile();

    function servePDFFile() {
        const filePath = path.join(__dirname, 'storage', 'Affichage.pdf');
        const fileContent = fs.readFileSync(filePath);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline; filename=Affichage.pdf'
            },
            body: fileContent.toString('base64'),
            isBase64Encoded: true
        };
    }

}