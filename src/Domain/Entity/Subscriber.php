<?php

namespace App\Domain\Entity;

class Subscriber
{
    public static string $tableName = 'subscribers';

    protected ?int $id = null;
    protected array $fields = [];

    public const STATE_UNCONFIRMED = 1;
    public const STATE_ACTIVE = 2;
    public const STATE_UNSUBSCRIBED = 3;
    public const STATE_JUNK = 4;

    public const ALLOWED_STATES = [
        self::STATE_UNCONFIRMED => 'unconfirmed',
        self::STATE_ACTIVE => 'active',
        self::STATE_UNSUBSCRIBED => 'unsubscribed',
        self::STATE_JUNK => 'junk',
    ];

    public const DEFAULT_ORDER_FIELD = 'id';
    public const DEFAULT_ORDER_TYPE = 'asc';

    public const ALLOWED_ORDER_FIELDS = [
        'id',
        'email',
        'name',
        'state',
        'created_at',
        'updated_at',
    ];
    public const ALLOWED_ORDER_TYPES = ['asc', 'desc'];

    public static array $fillable = ['email', 'name', 'state'];

    public function className()
    {
       return static::class;
    }

    public function getState(): string
    {
        return self::ALLOWED_STATES[$this->state];
    }

    public function setState(string $value): self
    {
        if (!array_key_exists($value, self::ALLOWED_STATES)) {
            throw new \Exception("Non existing state: {$value}");
        }

        $this->state = $value;

        return $this;
    }

    public function getFields(): array
    {
        return $this->fields;
    }

    public function setField(array $field): self
    {
        $this->fields[] = $field;

        return $this;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'email' => $this->email,
            'name' => $this->name,
            'state' => $this->getState(),
            'fields' => $this->getFields()
        ];
    }
}
