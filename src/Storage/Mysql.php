<?php
namespace App\Storage;

class Mysql 
{
    private $dbConnection = null;

    public function __construct()
    {
        $host = $_ENV['DB_HOST'];
        $port = $_ENV['DB_PORT'];
        $db = $_ENV['DB_DATABASE'];
        $user = $_ENV['DB_USERNAME'];
        $pass = $_ENV['DB_PASSWORD'];

        $charset = isset($_ENV['DB_CHARSET']) ? $_ENV['DB_CHARSET'] : 'UTF8';
        $persistent = isset($_ENV['DB_PERSISTENT']) ? $_ENV['DB_PERSISTENT'] : false;

        $options = [
            \PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES '{$charset}'",
            \PDO::ATTR_TIMEOUT            => 20,
            \PDO::ATTR_PERSISTENT         => $persistent,
            \PDO::ATTR_ERRMODE            => \PDO::ERRMODE_EXCEPTION,
        ];

        try {
            $this->dbConnection = new \PDO(
                "mysql:host=$host;port=$port;charset=utf8mb4;dbname=$db",
                $user,
                $pass, 
                $options
            );
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }
    }

    public function getConnection()
    {
        return $this->dbConnection;
    }
}