<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250308130823 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE walk ADD main_photo_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE walk ADD CONSTRAINT FK_8D917A55A7BC5DF9 FOREIGN KEY (main_photo_id) REFERENCES main_photo (id)');
        $this->addSql('CREATE INDEX IDX_8D917A55A7BC5DF9 ON walk (main_photo_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE user');
        $this->addSql('ALTER TABLE walk DROP FOREIGN KEY FK_8D917A55A7BC5DF9');
        $this->addSql('DROP INDEX IDX_8D917A55A7BC5DF9 ON walk');
        $this->addSql('ALTER TABLE walk DROP main_photo_id');
    }
}
