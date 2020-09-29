<?php

namespace App\Domain\Repository;

interface SubscriberFieldsRepositoryInterface extends RepositoryInterface
{
    public function getSubscriberFields(int $id); 

    public function deleteSubscriberField(int $subsciber_id, int $field_id);
}
