import { Controller, HttpStatus } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core';
import {
  Body,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common/decorators/http';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/roles/roles.guard';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { NullableType } from 'src/utils/types/nullable.type';
import { CreateTodoDto } from './dto/create-todo.dto';
import { GetTodosQueryDto } from './dto/get-todos-query.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { TodosService } from './todos.service';

@ApiTags('Todos')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({
  path: 'todos',
  version: '1',
})
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Request() request,
    @Body() createTodoDto: CreateTodoDto,
  ): Promise<Todo> {
    createTodoDto.user = request.user;
    return this.todosService.create(createTodoDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Request() request,
    @Query() query: GetTodosQueryDto,
  ): Promise<InfinityPaginationResultType<Todo>> {
    if (query.limit > 50) {
      query.limit = 50;
    }

    return infinityPagination(
      await this.todosService.findManyWithPagination(
        {
          user: request.user,
          page: query.page,
          limit: query.limit,
        },
        query.search ? query.search : '',
        query.sort ? query.sort : '',
      ),
      { user: request.user, limit: query.limit, page: query.page },
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(
    @Param('id') id: string,
  ): Promise<NullableType<Todo>> {
    return this.todosService.findOne({ id: +id });
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Request() request,
    @Param('id') id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<Todo> {
    return this.todosService.update(id, updateTodoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Request() request, @Param('id') id: number): Promise<void> {
    return this.todosService.softDelete(id);
  }
}
