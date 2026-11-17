import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBusinessDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}