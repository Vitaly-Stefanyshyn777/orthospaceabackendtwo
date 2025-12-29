import {
  Body,
  Controller,
  Get,
  Put,
  Post,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/auth.jwt.guard";
import { ContactsService } from "./contacts.service";
import {
  CreateContactInfoDTO,
  UpdateContactInfoDTO,
  CreateLocationInfoDTO,
  UpdateLocationInfoDTO
} from "./contacts.dto";

// Admin routes (protected)
@Controller("contacts")
@UseGuards(JwtAuthGuard)
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  // Contact Info
  @Get("contact-info")
  public getContactInfo() {
    return this.contactsService.getContactInfo();
  }

  @Post("contact-info")
  public createContactInfo(@Body() dto: CreateContactInfoDTO) {
    return this.contactsService.createContactInfo(dto);
  }

  @Put("contact-info")
  public updateContactInfo(@Body() dto: UpdateContactInfoDTO) {
    return this.contactsService.updateContactInfo(dto);
  }

  // Location Info
  @Get("location-info")
  public getLocationInfo() {
    return this.contactsService.getLocationInfo();
  }

  @Post("location-info")
  public createLocationInfo(@Body() dto: CreateLocationInfoDTO) {
    return this.contactsService.createLocationInfo(dto);
  }

  @Put("location-info")
  public updateLocationInfo(@Body() dto: UpdateLocationInfoDTO) {
    return this.contactsService.updateLocationInfo(dto);
  }
}

// Public routes (no authentication required)
@Controller("public/contacts")
export class PublicContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  public getPublicContacts() {
    return this.contactsService.getPublicContacts();
  }
}

