import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class resolutionTicketDto {
  @ApiProperty({
    description: 'description of the problem',
    example: 'La impresora no responde y muestra luz roja intermitente',
  })
  @IsNotEmpty()
  @IsString()
  response: string;

  @ApiProperty({
    description: 'estatus del ticket',
    example: 'pending',
  })
  @IsNotEmpty()
  @IsString()
  ticketStatus: string;

  @ApiProperty({
    description: 'id del ticket',
    example: '"1"',
  })
  @IsNotEmpty()
  @IsString()
  id_ticket: number;

  @ApiProperty({
    description: 'email del helper',
    example: 'soporte@solvex.com',
  })
  @IsNotEmpty()
  @IsString()
  helperEmail: string;
}
