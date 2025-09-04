CREATE USER 'woofwalksadmin'@'%' IDENTIFIED BY 'JLeLeSALF33!';
GRANT ALL PRIVILEGES ON woofwalks_docker.* TO 'woofwalksadmin'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;

CREATE USER 'woofwalkstest'@'%' IDENTIFIED BY 'JLeLeSALF33!';
GRANT ALL PRIVILEGES ON woofwalks_docker.* TO 'woofwalkstest'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;