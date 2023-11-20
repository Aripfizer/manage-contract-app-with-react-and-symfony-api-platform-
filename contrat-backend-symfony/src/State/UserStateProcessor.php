<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;


class UserStateProcessor implements ProcessorInterface
{
    private UserPasswordHasherInterface $hasher;

    public function __construct(private ProcessorInterface $persistProcessor, UserPasswordHasherInterface $hasher)
    {
        $this->hasher = $hasher;
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = [])
    {
        $password = $this->hasher->hashPassword($data, $data->getPassword());
        $data->setPassword($password);
        $result = $this->persistProcessor->process($data, $operation, $uriVariables, $context);
        return $result;   
    }
}
