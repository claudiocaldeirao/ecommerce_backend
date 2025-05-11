// create-product.dto.ts
import { IsString, IsNumber, IsInt, Min, MaxLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsInt()
  @Min(0)
  stock: number;

  @IsString()
  @MaxLength(50)
  category: string;
}
