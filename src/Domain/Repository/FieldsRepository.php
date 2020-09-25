<?php

namespace App\Domain\Repository;

use App\Storage\Mysql;
use App\Domain\Entity\Field;

class FieldsRepository extends AbstractRepository implements FieldsRepositoryInterface
{
    public function __construct(Mysql $db, Field $model)
    {
        parent::__construct($db, $model);
    }
}
