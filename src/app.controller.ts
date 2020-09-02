import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { GetProviders, PaginatedResponse, ProviderResponse } from './interfaces';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getProviderByNpi(@Query() query: GetProviders): Promise<PaginatedResponse<ProviderResponse>> {
    return this.appService.getProviders(query);
  }
}
