<?php

namespace App\Domain\Repository;

interface SubscriberFieldsRepositoryInterface extends RepositoryInterface
{
    public function getSubscriberFields(int $id); 
}
