import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'credentials' })
export class Credentials {
  @PrimaryGeneratedColumn('uuid')
  id_credentials: number;

  @Column({ type: 'varchar', length: 120, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  password: string;

  @OneToOne(() => User, (user) => user.credentials)
  @JoinColumn({ name: 'id_user' })
  user: User;
}
