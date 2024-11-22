import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsString } from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';

export class CountryInfoRequestDto {
  @ApiProperty()
  @IsString()
  @Transform(TransformHelper.toUpperCase)
  @Type(() => String)
  countryCode: string;

  @ApiProperty()
  @IsString()
  @Transform(TransformHelper.toCapitalize)
  @Type(() => String)
  name: string;
}
