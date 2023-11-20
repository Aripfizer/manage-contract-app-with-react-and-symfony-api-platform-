<?php

namespace App\Repository;

use App\Entity\Fertil;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Fertil>
 *
 * @method Fertil|null find($id, $lockMode = null, $lockVersion = null)
 * @method Fertil|null findOneBy(array $criteria, array $orderBy = null)
 * @method Fertil[]    findAll()
 * @method Fertil[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class FertilRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Fertil::class);
    }

//    /**
//     * @return Fertil[] Returns an array of Fertil objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('f')
//            ->andWhere('f.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('f.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Fertil
//    {
//        return $this->createQueryBuilder('f')
//            ->andWhere('f.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
