import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsNotEmpty, IsOptional } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class CreateTodoDto {
  @ApiProperty({ example: 'Call the client.' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Discuss the project details and gather requirements.',
  })
  @IsOptional()
  description?: string | '';

  @ApiProperty({ example: false })
  @IsNotEmpty()
  status: boolean;

  user: User;
}
