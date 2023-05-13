#!/bin/bash

# Télécharge le binaire pdftk précompilé
wget https://github.com/sumatrapdfreader/sumatrapdf/releases/download/3.3.3/PDFTK.zip

# Extrait le contenu de l'archive
unzip PDFTK.zip -d pdftk-package

# Copie le binaire pdftk vers un emplacement accessible
cp pdftk-package/pdftk/bin/pdftk ./bin/

# Nettoyage des fichiers temporaires
rm -rf pdftk-package PDFTK.zip

echo "pdftk a été installé avec succès."
