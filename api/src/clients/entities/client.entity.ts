import { Entity, Column, DeleteDateColumn } from 'typeorm';
import { AggregateRoot } from 'src/shared/aggregate-root';

@Entity('clients')
export class Client extends AggregateRoot {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  cpfCnpj: string;

  @DeleteDateColumn()
  deletedAt?: Date;
}
