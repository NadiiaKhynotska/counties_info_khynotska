import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CountryService } from './country.service';
import { CountryInfoRequestDto } from './dto/request/country-info.request.dto';
import { CountryResponseDto } from './dto/response/country-response.dto';

@ApiTags('Countries')
@Controller('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get('available')
  @ApiOperation({ summary: 'Get list of available countries' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of countries.',
    type: [CountryResponseDto],
  })
  getAvailableCountries() {
    return this.countryService.getAvailableCountries();
  }

  @Get('info')
  @ApiOperation({
    summary: 'Get detailed information about a specific country',
  })
  @ApiResponse({
    status: 200,
    // type: CountryResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Returns country details including borders, population, and flag.',
  })
  @ApiResponse({ status: 404, description: 'Country not found.' })
  // @ApiBody({ type: CountryInfoRequestDto })
  getCountryInfo(@Query() dto: CountryInfoRequestDto) {
    const { countryCode, name } = dto;
    return this.countryService.getCountryInfo(countryCode, name);
  }
}
