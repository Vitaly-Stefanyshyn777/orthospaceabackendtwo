import { Controller, Get } from "@nestjs/common";
import { ServicesService } from "../services/services.service";

@Controller("public/services")
export class PublicServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  public getPublicServices() {
    return this.servicesService.getPublicServices();
  }
}
