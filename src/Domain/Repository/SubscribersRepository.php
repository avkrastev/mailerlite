<?php

namespace App\Domain\Repository;

use App\Storage\Mysql;
use App\Domain\Entity\Subscriber;

class SubscribersRepository extends AbstractRepository implements SubscribersRepositoryInterface
{
    private $connection;
    private $model;

    public function __construct(Mysql $db, Subscriber $model)
    {
        parent::__construct($db, $model);
        $this->connection = $db->getConnection();
        $this->model = $model;
    }

    public function getSubscriberByEmail(string $email)
    {
        $statement = "
            SELECT *
            FROM
                {$this->model::$tableName}
            WHERE email = '{$email}';";

        try {
            $statement = $this->connection->prepare($statement);
            $statement->setFetchMode(\PDO::FETCH_CLASS, $this->model->className()); 
            $statement->execute();
            
            return $statement->fetch();
        } catch (\PDOException $e) {
            exit($e->getMessage());
        } 
    }
}
