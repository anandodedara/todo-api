import { IsInt, IsOptional, IsPositive, IsString, Matches, Min, min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class GetTodosQueryDto {
  
  @ApiProperty({ required: true })
  @Matches(/^[1-9][0-9]*$/)
  page: number;

  @ApiProperty({ required: true })
  @Matches(/^[1-9][0-9]*$/)
  limit: number;

  @ApiProperty({ required: false })
  @IsOptional()
  search?: string = '';

  @ApiProperty({ required: false })
  @Matches(/^(title|createdAt):(asc|desc)(?:,(title|createdAt):(asc|desc))*$/)
  @IsOptional()
  sort?: string;
}
