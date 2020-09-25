<?php

namespace App\Domain\Entity;

class SubscriberField
{
    public static string $tableName = 'subscriber_fields';

    protected ?int $id;

    public static array $fillable = ['subscriber_id', 'field_id'];

    public function className()
    {
       return static::class;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'field_id' => $this->field_id,
            'subscriber_id' => $this->subscriber_id,
        ];
    }
}
