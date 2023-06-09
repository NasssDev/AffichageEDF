const pdftk = require("node-pdftk");
const {execSync} = require("child_process");
const path = require("path");
const fs = require("fs");

process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'] + '/netlify/functions/pdf-gen/bin';
process.env['LD_LIBRARY_PATH'] = process.env['LAMBDA_TASK_ROOT'] + '/netlify/functions/pdf-gen/bin';

exports.handler = async function (event, context, callback) {

    const allInputsToFill = JSON.parse(event.body);
    let pdfToConcatenate = "";
    const entries = Object.entries(allInputsToFill);

    try {
        for (const [file, inputToFill] of entries) {
            pdfToConcatenate += "/tmp/" + file + "_filled.pdf ";
            await pdftk.input(__dirname + '/template/' + file + '.pdf')
                .fillForm(inputToFill)
                .output("/tmp/"+ file + "_filled.pdf")
                .catch(error => {
                    console.error(error);
                });
        }
        await execSync(`pdftk ${pdfToConcatenate} ${__dirname}/template/G00-096_100.pdf ${__dirname}/template/A00-040.pdf ${__dirname}/template/A00-098.pdf ${__dirname}/template/A00-106.pdf cat output /tmp/Affichage.pdf`, {stdio: 'inherit'});
    } catch (error) {
        console.error('Une erreur s\'est produite :', error);
        const responseError = {
            statusCode: 500,
            body: `Erreur lors de la génération du pdf ! : ${error}`
        }
        callback(responseError);
    }

    const filePath = '/tmp/Affichage.pdf';
    const pdf = fs.readFileSync(filePath, {encoding: 'base64'});
    const response = {
        headers: {
            'Content-Type': 'application/pdf'
        },
        statusCode: 200,
        body: pdf,
        isBase64Encoded: true
    };

    callback(null, response);
}