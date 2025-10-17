import { Exclude, Expose } from 'class-transformer';
import { BaseEntityDto } from './base-entity.dto';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class AggregateRootDto extends BaseEntityDto {
  @ApiProperty({ type: Date, required: false })
  @Expose()
  createdAt: Date;

  @ApiProperty({ type: Date, required: false })
  @Expose()
  updatedAt: Date;
}
