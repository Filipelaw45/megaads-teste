import { AggregateRoot } from 'src/shared/aggregate-root';
import { hashPassword } from 'src/utils/hash-password';
import { BeforeInsert, BeforeUpdate, Column, Entity, Index } from 'typeorm';

@Entity('users')
@Index(['email', 'username', 'roles'])
export class User extends AggregateRoot {
  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  roles: 'ADMIN' | 'USER';

  @Column()
  password: string;

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken?: string;

  @BeforeInsert()
  @BeforeUpdate()
  protected async hashPasswordBeforeSave() {
    if (this.password) {
      this.password = await hashPassword(this.password);
    }
  }
}
