const pdftk = require("node-pdftk");
const {execSync, exec} = require("child_process");
const path = require("path");
const fs = require("fs");

process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'] + '/netlify/functions/pdf-gen/bin';
process.env['LD_LIBRARY_PATH'] = process.env['LAMBDA_TASK_ROOT'] + '/netlify/functions/pdf-gen/bin';

exports.handler = async function (event, context, callback) {

    const allInputsToFill = JSON.parse(event.body);
    let pdfToConcatenate = "";
    let objectToCat = {};
    let count = 0;
    const entries = Object.entries(allInputsToFill);

    try {
        for (const [file, inputToFill] of entries) {
            count ++;
            objectToCat[count] = "storage/" + file + "_filled.pdf "
            //pdfToConcatenate += "./storage/" + file + "_filled.pdf ";
            pdfToConcatenate += count+" ";
            await pdftk.input(__dirname + '/template/' + file + '.pdf')
                .fillForm(inputToFill)
                .output("./storage/" + file + "_filled.pdf")
                .catch(error => {
                    console.error(error);
                });
        }
        console.log(objectToCat, pdfToConcatenate)
        await pdftk.input({A : './storage/C02-010_filled.pdf',
        B : './storage/C05-010_filled.pdf'})
            .cat('A B')
            .output('./storage/affiche.pdf')
            .catch(err => {
                console.log('erreur de concatenation',err);
            });

        //await execSync('chmod -R 777 storage',{stdio:'inherit'});
        //await execSync(`pdftk ${pdfToConcatenate} ${__dirname}/template/G00-096_100.pdf cat output ./storage/Affichage.pdf`, {stdio: 'inherit'});
    } catch (error) {
        console.error('Une erreur s\'est produite :', error);
        const responseError = {
            statusCode: 500,
            body: `Erreur lors de la génération du pdf ! : ${error}`
        }
        callback(responseError);
    }

    const filePath = path.join('storage', 'Affichage.pdf');
    const fileContent = fs.readFileSync('./storage/affiche.pdf', {encoding: 'base64'});

    const response = {
        headers: {
            'Content-Type': 'application/pdf'
        },
        statusCode: 200,
        body: fileContent,
        isBase64Encoded: true
    };

    callback(null, response);
}

/*exports.handler = async function (event,context) {
    fs.readdir(__dirname+"/bin", (err, files) => {
        if (err) {
            console.log('Erreur lors de la lecture du répertoire :', err);
            return;
        }
        console.log(files[0],files[1]);
    })
    console.log(process.env['PATH'])
    execSync(__dirname+'/bin/pdftk --version', {stdio: 'inherit'})
    return {
        headers: {
            'Content-Type': 'application/pdf'
        },
        statusCode: 200,
            body: "fileContent",
    }
}*/