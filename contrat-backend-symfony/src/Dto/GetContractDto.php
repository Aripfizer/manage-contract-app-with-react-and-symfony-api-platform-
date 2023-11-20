<?php

namespace App\Dto;

final class GetContractDto

{
    private ?int $id = null;

    private ?string $tax = null;

    public function __construct($tax)
    {
        $this->id = $id;
        $this->tax = $tax;
    }


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTax(): ?string
    {
        return $this->tax;
    }
}
