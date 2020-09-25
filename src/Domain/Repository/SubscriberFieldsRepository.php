<?php

namespace App\Domain\Repository;

use App\Storage\Mysql;
use App\Domain\Entity\SubscriberField;
use App\Domain\Entity\Field;

class SubscriberFieldsRepository extends AbstractRepository implements SubscriberFieldsRepositoryInterface
{
    private $connection;
    private $model;

    public function __construct(Mysql $db, SubscriberField $model)
    {
        parent::__construct($db, $model);
        $this->connection = $db->getConnection();
        $this->model = $model;
    }

    public function getSubscriberFields(int $id) 
    {
        $fieldsTable = Field::$tableName;

        $statement = "
            SELECT `{$fieldsTable}`.*
            FROM
                `{$this->model::$tableName}`
            LEFT JOIN `{$fieldsTable}` ON `{$this->model::$tableName}`.field_id = `{$fieldsTable}`.id
            WHERE subscriber_id = {$id}
            ORDER BY `{$fieldsTable}`.TITLE;";

        try {
            $statement = $this->connection->query($statement);
            $result = $statement->fetchAll(\PDO::FETCH_ASSOC);

            return $result;
        } catch (\PDOException $e) {
            exit($e->getMessage());
        } 
    }
}
