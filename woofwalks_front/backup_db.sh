
# Charger les variables depuis .env.docker
export $(grep -v '^#' .env.docker | xargs)

# Créer le dossier backups si besoin
mkdir -p backups

# Timestamp pour les fichiers
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# --- Sauvegarde de la base principale ---
BACKUP_FILE_MAIN="backups/backup_$TIMESTAMP.sql"
docker exec -i woofwalks_db mysqldump -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" > "$BACKUP_FILE_MAIN"
echo "Sauvegarde terminée pour $DB_NAME : $BACKUP_FILE_MAIN"

# --- Sauvegarde de la base de test ---
BACKUP_FILE_TEST="backups/backup_test_$TIMESTAMP.sql"
docker exec -i woofwalks_db mysqldump -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME_TEST" > "$BACKUP_FILE_TEST"
echo "Sauvegarde terminée pour $DB_NAME_TEST : $BACKUP_FILE_TEST"
