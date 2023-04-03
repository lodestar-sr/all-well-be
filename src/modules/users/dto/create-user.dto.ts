import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class EmailDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class CreateUserDto extends EmailDto {
  @ApiProperty()
  @IsOptional()
  password: string;
}
