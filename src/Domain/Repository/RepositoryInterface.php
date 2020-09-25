<?php

namespace App\Domain\Repository;

use App\Domain\Entity\Field;

interface RepositoryInterface
{
    public function getAll($order = 'id', $orderType = 'DESC', $limit = 100, $offset = 0): array;

    public function getById(int $id);

    public function insert(array $field);

    public function update(int $id, array $field);

    public function delete(int $id); 
}
