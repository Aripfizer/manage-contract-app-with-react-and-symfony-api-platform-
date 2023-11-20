<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Entity\User;
use App\Entity\Category;
use App\Entity\Company;
use App\Entity\Contract;
use App\Entity\Client;
use Faker\Factory;



class AppFixtures extends Fixture
{
    private UserPasswordHasherInterface $hasher;

    public function __construct(UserPasswordHasherInterface $hasher)
    {
        $this->hasher = $hasher;
    }


    public function load(ObjectManager $manager): void
    {
        //USER

        $email = 'admin@contracts.com';

        // Vérifier si l'utilisateur existe déjà
        $existingUser = $manager->getRepository(User::class)->findOneBy(['email' => $email]);

        if (!$existingUser) {
            // L'utilisateur n'existe pas, créer un nouvel utilisateur
            $user = new User();
            $user->setEmail($email);

            $password = $this->hasher->hashPassword($user, 'admin');

            $user->setPassword($password);

            // Persiste et flush
            $manager->persist($user);
            $manager->flush();
        }

        $user = new User();
        $user->setEmail("arieldossou00@gmail.com");

        $password = $this->hasher->hashPassword($user, 'password');

        $user->setPassword($password);

        // Persiste et flush
        $manager->persist($user);
        $manager->flush();

        // CATEGORY
       
        // Créer une nouvelle catégorie
        $category1 = new Category();
        $category1->setName('Automobile');
        $manager->persist($category1);
        $manager->flush();

        $category2 = new Category();
        $category2->setName('Santé');
        $manager->persist($category2);
        $manager->flush();

        // Créer une nouvelle compagnie et associer la catégorie
        $company1 = new Company();
        $company1->setTitle('Nsia');
        $company1->setCategory($category2);

        $manager->persist($company1);
        $manager->flush();

        $company2 = new Company();
        $company2->setTitle('Sanlam');
        $company2->setCategory($category1);

        $manager->persist($company2);
        $manager->flush();

        //FAKER

        $faker = Factory::create();
        $companies = $manager->getRepository(Company::class)->findAll();

        for ($i = 0; $i < 10; $i++) {
            $contractNumber = $faker->regexify('[A-Za-z0-9]{6}');
            
            $contract = new Contract();
            $contract->setContractNumber($contractNumber);
            // $contract->setContractNumber($faker->unique()->uuid);
            $contract->setDateOfIssue($faker->dateTimeBetween('-1 year', 'now'));
            $contract->setEffectiveDate($faker->dateTimeBetween('now', '+1 month'));
            $contract->setDueDate($faker->dateTimeBetween('+1 month', '+1 year'));
            $contract->setNetPrime($faker->randomFloat(2, 1000, 50000));
            $contract->setTtcPrime($faker->randomFloat(2, 1000, 50000));
            $contract->setTax($faker->randomFloat(2, 100, 500));
            $contract->setAccessory($faker->randomFloat(2, 100, 500));
            $contract->setAutomobileGuaranteeFund($faker->randomFloat(2, 50, 200));

            // Associer un client aléatoire et une entreprise aléatoire
            $client = new Client();
            $client->setFirstname($faker->firstName);
            $client->setLastname($faker->lastName);

            // $client->setCreatedAt($faker->dateTimeBetween('-1 year', 'now'));
            // $client->setUpdatedAt($faker->dateTimeBetween($client->getCreatedAt(), 'now'));

            $manager->persist($client);


            $contract->setClient($client);
            $contract->setCompany($faker->randomElement($companies));

            $manager->persist($contract);
        }

        $manager->flush();


    }
}
