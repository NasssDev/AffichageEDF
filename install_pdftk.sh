#!/bin/bash

# Télécharge le binaire pdftk précompilé
wget https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/pdftk-2.02-1.debian-9.amd64.deb

# Extrait les fichiers du paquet .deb
dpkg-deb -x pdftk-2.02-1.debian-9.amd64.deb pdftk-package

# Copie le binaire pdftk vers un emplacement accessible
cp pdftk-package/usr/bin/pdftk ./bin/

# Nettoyage des fichiers temporaires
rm -rf pdftk-package pdftk-2.02-1.debian-9.amd64.deb

echo "pdftk a été installé avec succès."
