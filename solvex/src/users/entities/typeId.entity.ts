import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'type_id' })
export class TypeId {
  @PrimaryGeneratedColumn({ type: 'int' })
  id_typeid: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @OneToMany(() => User, (user) => user.typeId)
  users: User[];
}
