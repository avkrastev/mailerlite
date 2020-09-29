<?php

namespace App\Domain\Repository;

interface FieldsRepositoryInterface extends RepositoryInterface
{
    public function getAvailableFieldsPerSubscriber(int $subscriber_id);
}
