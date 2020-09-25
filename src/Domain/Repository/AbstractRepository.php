<?php
namespace App\Domain\Repository;

use App\Storage\Mysql;

abstract class AbstractRepository 
{
    private $connection;
    private $model;

    public function __construct(Mysql $db, $model) {
        $this->connection = $db->getConnection();
        $this->model = $model;
    }

    public function getAll($order = 'id', $orderType = 'DESC', $limit = 100, $offset = 0): array
    {
        $statement = "
            SELECT *
            FROM
                {$this->model::$tableName}
            ORDER BY {$order} {$orderType}
            LIMIT {$limit} OFFSET {$offset};";

        try {
            $statement = $this->connection->query($statement);
            $result = $statement->fetchAll(\PDO::FETCH_ASSOC);

            return $result;
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }
    }

    public function getById(int $id) 
    {
        $statement = "
            SELECT *
            FROM
                {$this->model::$tableName}
            WHERE id = {$id};";

        try {
            $statement = $this->connection->prepare($statement);
            $statement->setFetchMode(\PDO::FETCH_CLASS, $this->model->className()); 
            $statement->execute();
            
            return $statement->fetch();
        } catch (\PDOException $e) {
            exit($e->getMessage());
        } 
    }

    public function insert(array $data) {
       
        $columns = implode(', ',
            array_map(
                function ($c) {
                    return "`{$c}`";
                },
                $this->model::$fillable
            )
        );

        $values = implode(', ',
            array_map(
                function ($v) {
                    return ":{$v}";
                },
                $this->model::$fillable
            )
        );

        $statement = "INSERT INTO `{$this->model::$tableName}` ({$columns}) VALUES ({$values});";

        try {
            $statement = $this->connection->prepare($statement);
            $bindedColumns = [];
            foreach ($this->model::$fillable as $v) {
                $bindedColumns[$v] = $data[$v];
            }
    
            $statement->execute($bindedColumns);
    
            return $this->connection->lastInsertId(); 
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }
    }

    public function update(int $id, array $data) 
    {
        $values = [];

        foreach ($this->model::$fillable as $v) {
            if (isset($data[$v])) {
                $values[$v] = $data[$v];
            }
        }

        $values['updated_at'] = date('Y-m-d H:i:s');

        $bindedColumns = implode(', ',
            array_map(
                function ($v) {
                    return "{$v}=:{$v}";
                },
                array_keys($values)
            )
        );

        $values['id'] = $id;

        $statement = "UPDATE `{$this->model::$tableName}` SET {$bindedColumns} WHERE `id`=:id;";
        
        try {
            $statement = $this->connection->prepare($statement);    
            $statement->execute($values);
            return $id; 
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }
    }

    public function delete(int $id) {
        $statement = "DELETE FROM `{$this->model::$tableName}` WHERE `id`=:id;";

        try {
            $statement = $this->connection->prepare($statement);
            $statement->bindValue(':id', $id, \PDO::PARAM_INT);

            return $statement->execute();
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }
    }
}