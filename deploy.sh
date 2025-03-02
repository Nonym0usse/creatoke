#!/bin/bash

# Variables de configuration
SERVER_USER="user"               # Remplace par ton nom d'utilisateur SSH
SERVER_IP="ip_du_serveur"        # Remplace par l'adresse IP de ton serveur
SSH_KEY="~/.ssh/id_rsa"          # Chemin de ta clé privée SSH (modifie si nécessaire)
REMOTE_DIR="/www/creatoke"   # Dossier distant de l'application

# Commande SSH pour se connecter au serveur et exécuter git pull
ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP << EOF
  cd $REMOTE_DIR
  git pull origin master
  npm install
  npm run build
EOF