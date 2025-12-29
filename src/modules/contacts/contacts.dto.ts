import { IsString, IsOptional, IsUrl, MaxLength } from "class-validator";

export class CreateContactInfoDTO {
  @IsString()
  @MaxLength(200)
  title: string; // "Зв'яжіться з нами"

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string; // Description text

  @IsString()
  @MaxLength(20)
  phone: string; // Phone number

  @IsOptional()
  workHours?: {
    weekdays: string; // "Пн-Пт"
    weekdayHours: string; // "08:00 - 20:00"
    weekend: string; // "Сб-Нд"
    weekendHours: string; // "09:00 - 18:00"
  };

  @IsOptional()
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    telegram?: string;
    viber?: string;
  }[];
}

export class UpdateContactInfoDTO {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  workHours?: {
    weekdays: string;
    weekdayHours: string;
    weekend: string;
    weekendHours: string;
  };

  @IsOptional()
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    telegram?: string;
    viber?: string;
  }[];

  // Дозволяємо додаткові поля, які можуть надсилатися з фронтенду
  @IsOptional()
  id?: number;

  @IsOptional()
  createdAt?: string;

  @IsOptional()
  updatedAt?: string;
}

export class CreateLocationInfoDTO {
  @IsString()
  @MaxLength(200)
  title: string; // "Де нас знайти?"

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string; // Description text

  @IsString()
  @MaxLength(300)
  address: string; // Physical address

  @IsString()
  @MaxLength(20)
  phone: string; // Phone number

  @IsOptional()
  @IsString()
  viberLink?: string; // Viber link

  @IsOptional()
  @IsUrl()
  telegramLink?: string; // Telegram link
}

export class UpdateLocationInfoDTO {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsString()
  viberLink?: string;

  @IsOptional()
  @IsUrl()
  telegramLink?: string;

  // Дозволяємо додаткові поля, які можуть надсилатися з фронтенду
  @IsOptional()
  id?: number;

  @IsOptional()
  createdAt?: string;

  @IsOptional()
  updatedAt?: string;
}

