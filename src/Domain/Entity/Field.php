<?php

namespace App\Domain\Entity;

class Field
{
    public static string $tableName = 'fields';

    protected ?int $id;

    public const TYPE_DATE = 1;
    public const TYPE_BOOLEAN = 2;
    public const TYPE_STRING = 3;
    public const TYPE_NUMBER = 4;

    public const ALLOWED_TYPES = [
        self::TYPE_DATE => 'date',
        self::TYPE_BOOLEAN => 'boolean',
        self::TYPE_STRING => 'string',
        self::TYPE_NUMBER => 'number',
    ];

    public const DEFAULT_ORDER_FIELD = 'id';
    public const DEFAULT_ORDER_TYPE = 'asc';

    public const ALLOWED_ORDER_FIELDS = [
        'id',
        'title',
        'type',
        'description',
        'created_at',
        'updated_at',
    ];
    public const ALLOWED_ORDER_TYPES = ['asc', 'desc'];

    public static array $fillable = ['title', 'type', 'description'];

    public function className()
    {
       return static::class;
    }

    public function getType(): string
    {
        return self::ALLOWED_TYPES[$this->type];
    }

    public function setType(string $value): self
    {
        if (!array_key_exists($value, self::ALLOWED_TYPES)) {
            throw new \Exception("Non existing type: {$value}");
        }

        $this->type = $value;

        return $this;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'type' => $this->getType(),
            'description' => $this->description,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
    }
}
