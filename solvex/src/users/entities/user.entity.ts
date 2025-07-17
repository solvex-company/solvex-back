import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Roles } from './Roles.entity';
import { Credentials } from './Credentials.entity';
import { TypeId } from './typeId.entity';
import { Subscription } from 'src/payments/entities/entity.subscription';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id_user: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  lastname: string;

  @Column({ type: 'varchar', length: 30, unique: true, nullable: true })
  identification_number: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @ManyToOne(() => TypeId, (type) => type.users, { nullable: true })
  @JoinColumn({ name: 'id_typeid' })
  typeId: TypeId;

  @OneToOne(() => Credentials, (credentials) => credentials.user)
  credentials: Credentials;

  @ManyToOne(() => Roles, (role) => role.users)
  @JoinColumn({ name: 'id_role' })
  role: Roles;

  @OneToOne(() => Subscription, (subscription) => subscription.id_admin)
  subscriptions: Subscription[];
}
