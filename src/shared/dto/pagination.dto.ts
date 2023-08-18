import { IsNumber } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  page: number = 1;

  @IsNumber()
  limit: number = 10;
}
