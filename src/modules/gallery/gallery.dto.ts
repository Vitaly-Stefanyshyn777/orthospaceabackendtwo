import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
} from "class-validator";
import { AlbumType } from "@prisma/client";

export class CreateAlbumDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsEnum(AlbumType)
  type: AlbumType;
}

export class UpdateAlbumDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsEnum(AlbumType)
  type?: AlbumType;
}

export class AddPhotoDTO {
  @IsInt()
  @IsPositive()
  albumId: number;

  @IsUrl()
  url: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  tag?: string;
}

export class UpdatePhotoDTO {
  @IsOptional()
  @IsUrl()
  url?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  tag?: string;
}

export class CreateBeforeAfterPairDTO {
  @IsInt()
  @IsPositive()
  albumId: number;

  @IsInt()
  @IsPositive()
  beforePhotoId: number;

  @IsInt()
  @IsPositive()
  afterPhotoId: number;

  @IsOptional()
  @IsString()
  label?: string;
}
