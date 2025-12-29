import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

class SourceDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  utm_source?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  utm_medium?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  utm_campaign?: string;
}

export class PublicFormDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(150)
  name?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  phone: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  @MaxLength(200)
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  workType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  message?: string;

  @ApiProperty()
  @IsBoolean()
  consent: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(300)
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  contactTime?: string;

  @ApiPropertyOptional({ type: SourceDTO })
  @IsOptional()
  @Type(() => SourceDTO)
  @ValidateNested()
  source?: SourceDTO;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  files?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  locale?: string;
}


