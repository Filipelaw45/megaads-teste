import { Exclude, Expose } from 'class-transformer';
import { AggregateRootDto } from '../../shared/aggregate-root.dto';

@Exclude()
export class User extends AggregateRootDto {

  @Expose()
  email: string;

  @Expose()
  username: string;

  @Expose()
  roles: 'ADMIN' | 'USER';
}