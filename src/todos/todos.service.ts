import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { DeepPartial, Repository } from 'typeorm';
import { NullableType } from '../utils/types/nullable.type';
import { CreateTodoDto } from './dto/create-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private todosRepository: Repository<Todo>,
  ) {}

  create(CreateTodoDto: CreateTodoDto): Promise<Todo> {
    return this.todosRepository.save(
      this.todosRepository.create(CreateTodoDto),
    );
  }

  findManyWithPagination(
    paginationOptions: IPaginationOptions,
    search: string,
    sort: string,
  ): Promise<Todo[]> {
    const query = this.todosRepository
      .createQueryBuilder('todo')
      .where({ user: paginationOptions.user })
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .take(paginationOptions.limit);

    if (search) {
      query
        .where('todo.title ILIKE :search', { search: `%${search}%` })
        .orWhere('todo.description ILIKE :search', { search: `%${search}%` });
    }

    if (sort) {
      const sortColumns = sort.split(',');
      sortColumns.forEach((sortColumn) => {
        const [column, order] = sortColumn.split(':');

        query.addOrderBy(
          `todo.${column}`,
          order.toUpperCase() as 'ASC' | 'DESC',
        );
      });
    }

    return query.getMany();
  }

  findOne(fields: EntityCondition<Todo>): Promise<NullableType<Todo>> {
    return this.todosRepository.findOne({
      where: fields,
    });
  }

  update(id: number, payload: DeepPartial<Todo>): Promise<Todo> {
    return this.todosRepository.save(
      this.todosRepository.create({
        id,
        ...payload,
      }),
    );
  }

  async softDelete(id: number): Promise<void> {
    await this.todosRepository.softDelete(id);
  }
}
