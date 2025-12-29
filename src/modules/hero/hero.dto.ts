import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateHeroDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  subtitle: string;

  @IsOptional()
  @IsString()
  backgroundImage?: string;
}

export class UpdateHeroDTO {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsOptional()
  @IsString()
  backgroundImage?: string;
}


