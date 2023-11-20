<?php
namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Company;
use Faker\Factory;

class ContractStateProcessor implements ProcessorInterface
{
    public function __construct(private ProcessorInterface $persistProcessor, private EntityManagerInterface $entityManager)
    {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = [])
    {
        $ttc_prime = $data->getNetPrime() + $data->getTax() + $data->getAccessory();

        $company = $this->entityManager->getRepository(Company::class)->find($data->getCompany());

        if ($company->getCategory()->getName() == "Automobile") {
            $ttc_prime += $data->getAutomobileGuaranteeFund();
        } else {
            $data->setAutomobileGuaranteeFund(null);
        }

        $data->setTtcPrime($ttc_prime);

        $faker = Factory::create();
        $contractNumber = $faker->regexify('[A-Za-z0-9]{6}');
        $data->setContractNumber($contractNumber);

        $result = $this->persistProcessor->process($data, $operation, $uriVariables, $context);
        return $result;
    }
}
