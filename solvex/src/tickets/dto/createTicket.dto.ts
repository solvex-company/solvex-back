import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateTicketDto {
  @ApiProperty({
    description: 'problem title',
    example: 'Impresora no responde',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'description of the problem',
    example: 'La impresora no responde y muestra luz roja intermitente',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'image 1',
    example: 'image 1',
  })
  @IsOptional()
  img_1: string;

  @ApiProperty({
    description: 'image 2',
    example: 'image 2',
  })
  @IsNotEmpty()
  img_2: string;

  @ApiProperty({
    description: 'image 3',
    example: 'image 3',
  })
  @IsNotEmpty()
  img_3: string;

  @ApiProperty({
    description: 'id empleado',
    example: '123',
  })
  @IsNotEmpty()
  @IsString()
  id_empleado: string;
}
