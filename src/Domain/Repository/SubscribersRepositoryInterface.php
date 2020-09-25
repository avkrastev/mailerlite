<?php

namespace App\Domain\Repository;

interface SubscribersRepositoryInterface extends RepositoryInterface
{
    public function getSubscriberByEmail(string $email);
}
