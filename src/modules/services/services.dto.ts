import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  IsBoolean,
} from "class-validator";

export class CreateServiceCategoryDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  categoryId: string; // e.g., "01", "02"

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  mainTitle: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  priceRange?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  order?: number;
}

export class UpdateServiceCategoryDTO {
  @IsOptional()
  @IsString()
  @MaxLength(10)
  categoryId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  mainTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  priceRange?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  order?: number;
}

export class CreateServiceDTO {
  @IsInt()
  @IsPositive()
  categoryId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  type: string; // e.g., "Tooth", "Implant"

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  price?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  @IsPositive()
  order?: number;
}

export class UpdateServiceDTO {
  @IsOptional()
  @IsInt()
  @IsPositive()
  categoryId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  type?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  price?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  @IsPositive()
  order?: number;
}

