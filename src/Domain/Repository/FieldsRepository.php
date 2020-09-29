<?php

namespace App\Domain\Repository;

use App\Storage\Mysql;
use App\Domain\Entity\Field;
use App\Domain\Entity\SubscriberField;

class FieldsRepository extends AbstractRepository implements FieldsRepositoryInterface
{
    public function __construct(Mysql $db, Field $model)
    {
        parent::__construct($db, $model);
        $this->connection = $db->getConnection();
        $this->model = $model;
    }

    public function getAvailableFieldsPerSubscriber(int $subscriber_id)
    {
        $fieldsTable = Field::$tableName;
        $subscriberFieldsTable = SubscriberField::$tableName;

        $statement = "
                SELECT * 
                FROM 
                    `{$fieldsTable}`
                WHERE id NOT IN 
                    (SELECT field_id 
                        FROM  `{$subscriberFieldsTable}`
                    WHERE subscriber_id = {$subscriber_id});";

        try {
            $statement = $this->connection->query($statement);
            $result = $statement->fetchAll(\PDO::FETCH_ASSOC);

            return $result;
        } catch (\PDOException $e) {
            return $e->getMessage();
        } 
    }
}
