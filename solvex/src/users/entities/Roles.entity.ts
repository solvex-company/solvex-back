import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'roles' })
export class Roles {
  @PrimaryGeneratedColumn({ type: 'int' })
  id_role: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  role_name: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
