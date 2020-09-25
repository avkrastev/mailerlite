<?php
namespace App\Api\Middlewares;

use Pecee\Http\Middleware\IMiddleware;
use Pecee\Http\Request;
use App\Domain\Entity\Field;
use App\Domain\Entity\Subscriber;
use App\Domain\Repository\SubscribersRepositoryInterface;

class RequestValidation implements IMiddleware
{
    private $subscribersRepository;

    public function __construct(SubscribersRepositoryInterface $subscribersRepository)
    {
        $this->subscribersRepository = $subscribersRepository;
    }

	public function handle(Request $request) : void
	{
        if ($request->getMethod() === 'post') {
            $requestData = $request->getInputHandler()->all();

            if (array_key_exists('email', $requestData)) {
                $this->emailValidation($requestData['email']);
                $this->emailExists($requestData['email']);
            }

            if (array_key_exists('state', $requestData)) {
                $this->subscriberStateValidation($requestData['state']);
            }

            if (array_key_exists('type', $requestData)) {
                $this->fieldTypeValidation($requestData['type']);
            }
        } 
    }
    
    private function emailValidation($email) 
    {
        if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $domain = explode('@', $email)[1];

            if (!checkdnsrr($domain)) {
                response(400)->json([
                    'error' => 'E-mail host domain must be active!',
                ]);
            }
        } else {
            response(400)->json([
                'error' => 'Please enter valid e-mail address!',
            ]);
        }
    }

    private function emailExists($email) 
    {
        $getSubscriberByEmail = $this->subscribersRepository->getSubscriberByEmail($email);

        if ($getSubscriberByEmail !== false) {
            response(400)->json([
                'error' => 'The subsciber\'s e-mail address already exists!',
            ]);
        }        
    }

    private function subscriberStateValidation($state) 
    {
        if (!array_key_exists($state, Subscriber::ALLOWED_STATES)) {
            response(400)->json([
                'error' => 'Please enter a valid subscriber state!',
            ]);
        } 
    }
    
    private function fieldTypeValidation($type) 
    {
        if (!array_key_exists($type, Field::ALLOWED_TYPES)) {
            response(400)->json([
                'error' => 'Please enter a valid field type!',
            ]);
        } 
    }

}