import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'first name example',
  })
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ApiProperty({
    required: false,
    default: '',
    description: 'The name of the user',
    example: 'second name example',
  })
  @IsString()
  second_name?: string;

  @ApiProperty({
    description: 'The name of the user',
    example: 'first surname example',
  })
  @IsNotEmpty()
  @IsString()
  first_surname: string;

  @ApiProperty({
    description: 'The name of the user',
    example: 'first surname example',
  })
  @IsNotEmpty()
  @IsString()
  second_surname: string;

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
    description: 'identification num of the user',
    example: '123456789',
  })
  identification_number: string;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '1234567890',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9]+$/)
  phone: string;

  @ApiProperty({
    description: 'user identification type',
    example: '1',
  })
  @IsNotEmpty()
  @IsNumber()
  typeId: number;

  @ApiProperty({
    description: 'user id credentials',
    example: '1',
  })
  @IsNotEmpty()
  @IsNumber()
  credentials: number;

  @ApiProperty({
    description: 'user id role',
    example: '1',
  })
  @IsNotEmpty()
  @IsNumber()
  role: number;
}
