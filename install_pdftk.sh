#!/bin/bash

# Télécharge le binaire pdftk précompilé
wget https://github.com/pdftk-java/pdftk/releases/download/v4.2.0/pdftk-4.2.0-linux-amd64.tar.gz

# Extrait le contenu de l'archive
tar -xzf pdftk-4.2.0-linux-amd64.tar.gz

# Copie le binaire pdftk vers un emplacement accessible
cp pdftk-4.2.0-linux-amd64/bin/pdftk ./bin/

# Nettoyage des fichiers temporaires
rm -rf pdftk-4.2.0-linux-amd64 pdftk-4.2.0-linux-amd64.tar.gz

echo "pdftk a été installé avec succès."
