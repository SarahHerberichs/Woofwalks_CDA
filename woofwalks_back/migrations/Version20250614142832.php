<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250614142832 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE walk_alert_request (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, walk_id INT DEFAULT NULL, requested_at DATETIME NOT NULL, notified TINYINT(1) NOT NULL, INDEX IDX_629861CAA76ED395 (user_id), INDEX IDX_629861CA5EEE1B48 (walk_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE walk_alert_request ADD CONSTRAINT FK_629861CAA76ED395 FOREIGN KEY (user_id) REFERENCES `user` (id)');
        $this->addSql('ALTER TABLE walk_alert_request ADD CONSTRAINT FK_629861CA5EEE1B48 FOREIGN KEY (walk_id) REFERENCES walk (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE walk_alert_request DROP FOREIGN KEY FK_629861CAA76ED395');
        $this->addSql('ALTER TABLE walk_alert_request DROP FOREIGN KEY FK_629861CA5EEE1B48');
        $this->addSql('DROP TABLE walk_alert_request');
    }
}
