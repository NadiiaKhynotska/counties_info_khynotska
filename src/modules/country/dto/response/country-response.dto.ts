import { ApiProperty } from '@nestjs/swagger';

export class CountryResponseDto {
  @ApiProperty()
  countryCode: string;
  @ApiProperty()
  name: string;
}
