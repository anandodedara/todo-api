import { PartialType } from '@nestjs/swagger';
import { CreateTodoDto } from './create-todo.dto';

import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateTodoDto extends PartialType(CreateTodoDto) {
  @ApiProperty({ example: 'Call the client.' })
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'Discuss the project details and gather requirements.' })
  @IsOptional()
  description?: string;

  @ApiProperty({ example: false })
  @IsOptional()
  @IsBoolean()
  status: boolean;
}
