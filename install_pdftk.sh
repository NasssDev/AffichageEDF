#!/bin/bash

# Télécharge le binaire pdftk précompilé
wget https://github.com/sidorares/pdftk/releases/download/v2.2.1/pdftk-2.2.1-linux-x86_64.tar.gz

# Extrait le contenu de l'archive
tar -xzf pdftk-2.2.1-linux-x86_64.tar.gz

# Copie le binaire pdftk vers un emplacement accessible
cp pdftk-2.2.1-linux-x86_64/bin/pdftk ./bin/

# Nettoyage des fichiers temporaires
rm -rf pdftk-2.2.1-linux-x86_64 pdftk-2.2.1-linux-x86_64.tar.gz

echo "pdftk a été installé avec succès."
