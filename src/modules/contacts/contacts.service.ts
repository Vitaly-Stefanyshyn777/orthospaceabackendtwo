import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ContactInfo, LocationInfo } from "@prisma/client";
import {
  CreateContactInfoDTO,
  UpdateContactInfoDTO,
  CreateLocationInfoDTO,
  UpdateLocationInfoDTO
} from "./contacts.dto";

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  // Contact Info CRUD
  public async getContactInfo(): Promise<ContactInfo | null> {
    return this.prisma.contactInfo.findFirst({
      orderBy: { createdAt: 'desc' }
    });
  }

  public async createContactInfo(dto: CreateContactInfoDTO): Promise<ContactInfo> {
    return this.prisma.contactInfo.create({
      data: {
        title: dto.title,
        description: dto.description,
        phone: dto.phone,
        workHours: dto.workHours || null,
        socialLinks: dto.socialLinks || null,
      },
    });
  }

  public async updateContactInfo(dto: UpdateContactInfoDTO): Promise<ContactInfo> {
    const existingContact = await this.prisma.contactInfo.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    if (!existingContact) {
      throw new NotFoundException("Contact info not found");
    }

    return this.prisma.contactInfo.update({
      where: { id: existingContact.id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.phone && { phone: dto.phone }),
        ...(dto.workHours && { workHours: dto.workHours }),
        ...(dto.socialLinks && { socialLinks: dto.socialLinks }),
      },
    });
  }

  // Location Info CRUD
  public async getLocationInfo(): Promise<LocationInfo | null> {
    return this.prisma.locationInfo.findFirst({
      orderBy: { createdAt: 'desc' }
    });
  }

  public async createLocationInfo(dto: CreateLocationInfoDTO): Promise<LocationInfo> {
    return this.prisma.locationInfo.create({
      data: {
        title: dto.title,
        description: dto.description,
        address: dto.address,
        phone: dto.phone,
        viberLink: dto.viberLink,
        telegramLink: dto.telegramLink,
      },
    });
  }

  public async updateLocationInfo(dto: UpdateLocationInfoDTO): Promise<LocationInfo> {
    const existingLocation = await this.prisma.locationInfo.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    if (!existingLocation) {
      throw new NotFoundException("Location info not found");
    }

    return this.prisma.locationInfo.update({
      where: { id: existingLocation.id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.address && { address: dto.address }),
        ...(dto.phone && { phone: dto.phone }),
        ...(dto.viberLink !== undefined && { viberLink: dto.viberLink }),
        ...(dto.telegramLink !== undefined && { telegramLink: dto.telegramLink }),
      },
    });
  }

  // Public API methods
  public async getPublicContacts(): Promise<{
    contactInfo: ContactInfo | null;
    locationInfo: LocationInfo | null;
  }> {
    const [contactInfo, locationInfo] = await Promise.all([
      this.getContactInfo(),
      this.getLocationInfo(),
    ]);

    return {
      contactInfo,
      locationInfo,
    };
  }
}

