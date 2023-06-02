const fs = require('fs');

exports.handler = async function (event, context, callback) {

    const directoryPath = `${__dirname}/../pdf-gen/storage`;
    try {
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                console.error('Erreur lors de la lecture du répertoire :', err);
                return;
            }

            files.forEach(file => {
                const filePath = `${directoryPath}/${file}`;
                fs.unlink(filePath, err => {
                    if (err) {
                        console.error(`Erreur lors de la suppression du fichier ${filePath} :`, err);
                    } else {
                        console.log(`Fichier ${filePath} supprimé avec succès.`);
                    }
                });
            });
        });
        const response = {
            statusCode: 200,
            body: "Suppresion réussie !"
        }
        callback(null, response);
    } catch (err) {
        console.error('Une erreur s\'est produite :', error);
        const responseError = {
            statusCode: 500,
            body: "Erreur lors de la suppression !"
        }
        callback(responseError);
    }
}