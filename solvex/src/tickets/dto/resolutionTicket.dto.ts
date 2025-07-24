import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class resolutionTicketDto {
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
    description: 'estatus del ticket',
    example: 'pending',
  })
  @IsNotEmpty()
  @IsString()
  ticketStatus: string;

  @ApiProperty({
    description: 'id del ticket',
    example: '1',
  })
  @IsNotEmpty()
  @IsString()
  id_ticket: number;

  @ApiProperty({
    description: 'nombre del helper',
    example: 'Robert',
  })
  @IsNotEmpty()
  @IsString()
  helperEmail: string;
}
