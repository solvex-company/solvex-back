import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'Carlos',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The lastname of the user',
    example: 'Fernandez',
  })
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @ApiProperty({
    description: 'The mail of the user want use to register',
    example: 'mailExmaple@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'Password123!',
  })
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(15)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/,
    {
      message:
        'The password must contain a one uppercas letter, one lowercase letter, one number an one special character.',
    },
  )
  password: string;

  @ApiProperty({
    description: 'The password of the user for verification',
    example: 'Password123!',
  })
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(15)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/,
    {
      message:
        'The password must contain a one uppercas letter, one lowercase letter, one number an one special character.',
    },
  )
  password2: string;

  @ApiProperty({
    description: 'identification num of the user',
    example: '456267345',
  })
  @IsNotEmpty()
  identification_number: string;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '1234567890',
  })
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'user identification type',
    example: '1',
  })
  @IsNotEmpty()
  @IsNumberString()
  typeId: string;
}

export class loginDto extends PickType(CreateUserDto, ['email', 'password']) {}
