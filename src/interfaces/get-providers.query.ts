import { IsString, IsOptional, IsIn, IsNumberString } from 'class-validator';

export class GetProviders {
  @IsNumberString()
  @IsOptional()
  number: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  @IsIn([ 'NPI-1', 'NPI-2' ])
  enumeration_type: string;

  @IsNumberString()
  @IsOptional()
  limit = '10';

  @IsNumberString()
  @IsOptional()
  offset = '0';
}