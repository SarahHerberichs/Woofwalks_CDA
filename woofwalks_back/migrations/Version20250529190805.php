<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250529190805 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE walk ADD location_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE walk ADD CONSTRAINT FK_8D917A5564D218E FOREIGN KEY (location_id) REFERENCES location (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D917A5564D218E ON walk (location_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE walk DROP FOREIGN KEY FK_8D917A5564D218E');
        $this->addSql('DROP INDEX UNIQ_8D917A5564D218E ON walk');
        $this->addSql('ALTER TABLE walk DROP location_id');
    }
}
