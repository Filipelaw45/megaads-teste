import { BeforeInsert, BeforeUpdate, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BaseEntity } from './base-entity';
import { getBrasiliaTime } from 'src/utils/date-utils';

export abstract class AggregateRoot extends BaseEntity {
  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedAt: Date;

  @BeforeInsert()
  setCreatedAt() {
    this.createdAt = getBrasiliaTime();
  }

  @BeforeUpdate()
  setUpdatedAt() {
    this.updatedAt = getBrasiliaTime();
  }
}
