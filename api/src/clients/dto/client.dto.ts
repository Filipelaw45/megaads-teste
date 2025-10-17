import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { AggregateRootDto } from 'src/shared/aggregate-root.dto';

@Exclude()
export class ClientDto extends AggregateRootDto {
  @Expose()
  @ApiProperty({ type: String })
  firstName: string;

  @Expose()
  @ApiProperty({ type: String })
  lastName: string;

  @Expose()
  @ApiProperty({ type: String })
  email: string;

  @Expose()
  @ApiProperty({ type: String })
  cpfCnpj: string;
}
