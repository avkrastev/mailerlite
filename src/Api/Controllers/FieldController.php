<?php
namespace App\Api\Controllers;

use App\Domain\Repository\FieldsRepositoryInterface;
use App\Domain\Entity\Field;

class FieldController
{
    private $fieldsRepository;

    public function __construct(FieldsRepositoryInterface $fieldsRepository)
    {
        $this->fieldsRepository = $fieldsRepository;
    }

    /**
     * @return string
     * @throws \Pecee\Exceptions\InvalidArgumentException
     */
    public function show(int $id): string
	{
        $field = $this->fieldsRepository->getById($id);
        if ($field !== false) {
            return response()->json($field->toArray());
        }

        // not found
        return response(404)->json([]);
	}

    /**
     * @return string|null
     */
    public function index(): ?string
    {
        // TODO order
        $fields = $this->fieldsRepository->getAll('type');
        
        return response()->json($fields);
    }

    /**
     * @return string|null
     */
    public function store(int $id = null): ?string
    {
        $data = input()->all();

        // Create new record
        if (is_null($id)) {
            $lastInsertedId = $this->fieldsRepository->insert($data);
        
            $field = $this->fieldsRepository->getById($lastInsertedId);
            if ($field !== false) {
                return response(201)->json($field->toArray());
            }
    
            // TODO not found
            return response(404)->json([]);
        }

        // Update existing record
        $updateId = $this->fieldsRepository->update($id, $data);

        $field = $this->fieldsRepository->getById($updateId);
        if ($field !== false) {
            return response()->json($field->toArray());
        }

        // TODO not found
        return response(404)->json([]);

    }

    /**
     * @param mixed $id
     * @return string|null
     */
    public function update(int $id): ?string
    {
        return response(202)->json([
            'info' => 'Please use POST instead of PUT/PATCH!'
        ]);
    }

    /**
     * @param mixed $id
     * @return string|null
     */
    public function destroy(int $id): ?string
    {
        $field = $this->fieldsRepository->getById($id);
        if ($field === false) {
            return response(404)->json([
                'error' => sprintf('The record with ID: %s does not exist!', $id),
            ]);
        }
        
        $response = $this->fieldsRepository->delete($id);
        if ($response instanceof \PDOException) {
            $errorMessage = 'Database error!';
            if ($response->getCode() == '23000') {
                $errorMessage = 'The record can not be deleted because it is in use!';
            }

            return response(500)->json([
                'error' => $errorMessage,
            ]);
        }

        if ($response) {
            return response()->json([
                'info' => sprintf('Succesfully deleted records with ID: %s', $id),
            ]);
        }
    }
}