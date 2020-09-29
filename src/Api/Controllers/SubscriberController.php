<?php
namespace App\Api\Controllers;

use App\Domain\Repository\FieldsRepositoryInterface;
use App\Domain\Repository\SubscribersRepositoryInterface;
use App\Domain\Repository\SubscriberFieldsRepositoryInterface;
use App\Domain\Entity\Field;
use App\Domain\Entity\Subscriber;
use App\Domain\Entity\SubscriberField;

class SubscriberController
{
    private $fieldsRepository;
    private $subscribersRepository;
    private $subscriberFieldsRepository;

    public function __construct(
        FieldsRepositoryInterface $fieldsRepository,
        SubscribersRepositoryInterface $subscribersRepository, 
        SubscriberFieldsRepositoryInterface $subscriberFieldsRepository
    ) {
        $this->fieldsRepository = $fieldsRepository;
        $this->subscribersRepository = $subscribersRepository;
        $this->subscriberFieldsRepository = $subscriberFieldsRepository;
    }

     /**
     * @return string
     * @throws \Pecee\Exceptions\InvalidArgumentException
     */
    public function show(int $id): string
	{
        $field = $this->subscribersRepository->getById($id);
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
        $data = input()->all();
        
        $defaultOrder = isset($data['order']) && in_array($data['order'], Subscriber::ALLOWED_ORDER_FIELDS) ? $data['order'] : Subscriber::DEFAULT_ORDER_FIELD;
        $defaultOrderType = isset($data['type']) && in_array($data['type'], Subscriber::ALLOWED_ORDER_TYPES) ? $data['type'] : Subscriber::DEFAULT_ORDER_TYPE;
        $recordsPerPage = Subscriber::RECORDS_PER_PAGE;
        $page = isset($data['page']) ? $data['page'] : 1;
        $offset = $page * $recordsPerPage - $recordsPerPage;

        $fields = $this->subscribersRepository->getAll($defaultOrder, $defaultOrderType, $recordsPerPage, $offset);
        
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
            $lastInsertedId = $this->subscribersRepository->insert($data);
        
            $field = $this->subscribersRepository->getById($lastInsertedId);
            if ($field !== false) {
                return response(201)->json($field->toArray());
            }
    
            // TODO not found
            return response(404)->json([]);
        }

        $this->subscribersRepository->beginTransaction();

        try {
            if (isset($data['fields']) && !empty($data['fields'])) {
                foreach ($data['fields'] as $v) {
                    $subscribrFieldData['subscriber_id'] = $id;
                    $subscribrFieldData['field_id'] = $v;

                    $this->subscriberFieldsRepository->insert($subscribrFieldData);
                }
                unset($data['field']);
            }
            
            // Update existing record
            $updateId = $this->subscribersRepository->update($id, $data);

            $field = $this->subscribersRepository->getById($updateId);

            $this->subscribersRepository->commitTransaction();

            if ($field !== false) {
                return response()->json($field->toArray());
            }

            // TODO not found
            return response(404)->json([]); 
        } catch(Exception $e) {
            $this->subscribersRepository->rollbackTransaction();
            return $e->getMessage();
        }
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
        $subscriber = $this->subscribersRepository->getById($id);
        if ($subscriber === false) {
            return response(404)->json([
                'error' => sprintf('The record with ID: %s does not exist!', $id),
            ]);
        }
        
        $response = $this->subscribersRepository->delete($id);
        if ($response) {
            return response()->json([
                'info' => sprintf('Succesfully deleted record with ID: %s', $id),
            ]);
        }
    }

    /**
     * @param mixed $id
     * @return string|null
     */
    public function addField(int $id) 
    {
        $data = input()->all();

        if (!isset($data['field_id'])) {
            return response(400)->json([
                'error' => sprintf('Please provide valid field ID!', $id),
            ]);
        }

        $field = $this->fieldsRepository->getById($data['field_id']);
        
        if ($field === false) {
            return response(404)->json([
                'error' => sprintf('The record with ID: %s does not exist!', $id),
            ]);
        }

        $subscriberFieldData = [
            'subscriber_id' => $id,
            'field_id' => $data['field_id']
        ];

        $subscriberFieldId = $this->subscriberFieldsRepository->insert($subscriberFieldData);

        $subscriberField = $this->subscriberFieldsRepository->getById($subscriberFieldId);
        if ($subscriberField !== false) {
            return response(201)->json($subscriberField->toArray());
        }

        // TODO not found
        return response(404)->json([]);
    }

    /**
     * @param mixed $id
     * @return string|null
     */
    public function getFields(int $id) 
    {
        $subscriberFields = $this->subscriberFieldsRepository->getSubscriberFields($id);
        
        if ($subscriberFields === false) {
            return response(404)->json([
                'error' => sprintf('The record with ID: %s does not exist!', $id),
            ]);
        }

        $subscriber = $this->subscribersRepository->getById($id);
        
        foreach ($subscriberFields as $sField) {
            $subscriber->setField($sField);
        }
        
        return response()->json($subscriber->toArray());
    }
    
    /**
     * @param mixed $id
     * @return string|null
     */
    public function deleteField(int $id, int $field_id) 
    {
        $subscriber = $this->subscribersRepository->getById($id);

        if ($subscriber === false) {
            return response(404)->json([
                'error' => sprintf('Subscriber with ID: %s does not exist!', $id),
            ]);
        }

        $subscriberField = $this->fieldsRepository->getById($field_id);
        if ($subscriberField === false) {
            return response(404)->json([
                'error' => sprintf('Field with ID: %s does not exist!', $field_id),
            ]);
        }
        
        if (!$this->subscriberFieldsRepository->deleteSubscriberField($id, $field_id)) {
            return response(404)->json([
                'error' => 'The records was not deleted!',
            ]);
        }

        return response()->json([
            'info' => 'Succesfully deleted record!',
        ]);
    }

    public function getNumberOfRecords()
    {
        $rowsCount = $this->subscribersRepository->count();

        return response()->json([
            'allRecordsCount' => $rowsCount,
            'recordsPerPage' => Subscriber::RECORDS_PER_PAGE
        ]);
    }

    public function getAvailableFields(int $subscriber_id)
    {
        $availableFields = $this->fieldsRepository->getAvailableFieldsPerSubscriber($subscriber_id);

        return response()->json($availableFields);
    }

}