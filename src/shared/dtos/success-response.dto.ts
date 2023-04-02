import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class StatusResponseDto {
  @ApiProperty()
  status: 'SUCCESS' | 'ERROR';
}

export class BasicResponseDto extends StatusResponseDto {
  @ApiProperty()
  @IsOptional()
  message: string;
}

export class SuccessResponseDto<T> {
  @ApiProperty()
  message: string;

  @ApiProperty()
  data?: T;
}
