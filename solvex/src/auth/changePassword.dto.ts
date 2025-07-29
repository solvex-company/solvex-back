import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'constraseña antigua',
    example: 'User123!',
  })
  oldPassword: string | null;

  @ApiProperty({
    description: 'constraseña nueva',
    example: 'Usernew123!',
  })
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(15)
  @IsStrongPassword({
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  newPassword: string;

  @ApiProperty({
    description: 'constraseña nueva',
    example: 'Usernew123!',
  })
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(15)
  @IsStrongPassword({
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  newPassword2: string;
}
