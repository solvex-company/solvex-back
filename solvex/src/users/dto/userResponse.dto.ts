import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty()
  id_user: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  lastname: string;

  @ApiProperty()
  identification_number: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  typeId: {
    id_typeid: number;
    name: string;
  };

  @ApiProperty()
  role: {
    id_role: number;
    role_name: string;
  };
}
