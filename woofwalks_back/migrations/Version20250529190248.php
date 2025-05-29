<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250529190248 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE walk DROP FOREIGN KEY FK_8D917A5530719444');
        $this->addSql('ALTER TABLE walk DROP FOREIGN KEY FK_8D917A5544990C25');
        $this->addSql('DROP INDEX IDX_8D917A5544990C25 ON walk');
        $this->addSql('DROP INDEX UNIQ_8D917A5530719444 ON walk');
        $this->addSql('ALTER TABLE walk DROP park_id, DROP custom_location_id');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE walk ADD park_id INT DEFAULT NULL, ADD custom_location_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE walk ADD CONSTRAINT FK_8D917A5530719444 FOREIGN KEY (custom_location_id) REFERENCES location (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE walk ADD CONSTRAINT FK_8D917A5544990C25 FOREIGN KEY (park_id) REFERENCES park (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('CREATE INDEX IDX_8D917A5544990C25 ON walk (park_id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D917A5530719444 ON walk (custom_location_id)');
    }
}
