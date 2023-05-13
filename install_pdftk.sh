#!/bin/bash

# Télécharge le binaire pdftk précompilé
wget https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/pdftk-2.02-1.debian-9.amd64.deb

# Extrait les fichiers du paquet .deb
tar -x pdftk-2.02-1.debian-9.amd64.deb

# Extrai le fichier système
tar -xvf data.tar.xz

# Copie le binaire pdftk vers un emplacement accessible
cp usr/bin/pdftk ./bin/

# Nettoyage des fichiers temporaires
rm -rf usr data.tar.xz debian-binary pdftk-2.02-1.debian-9.amd64.deb

echo "pdftk a été installé avec succès."