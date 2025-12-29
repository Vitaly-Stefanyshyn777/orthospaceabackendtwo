import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  MaxLength,
} from "class-validator";

export class CreateContentBlockDTO {
  @IsInt()
  @IsPositive()
  blockNumber: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}

export class UpdateContentBlockDTO {
  @IsOptional()
  @IsInt()
  @IsPositive()
  blockNumber?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}


