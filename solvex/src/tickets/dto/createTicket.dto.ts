import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTicketDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  img_1: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  img_2: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  img_3: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id_status: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id_empleado: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  id_helper: string;
}
