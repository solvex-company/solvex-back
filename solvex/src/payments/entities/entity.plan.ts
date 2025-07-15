import { User } from 'src/users/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Subscription } from './entity.subscription';

@Entity({ name: 'planes' })
export class Plan {
  @PrimaryGeneratedColumn({ type: 'int' })
  id_plan: number;

  @Column({ type: 'varchar', length: 100 })
  plan_name: string;

  @Column({ type: 'int', nullable: false })
  duration_plan_years: number;

  @Column({ type: 'decimal', nullable: false })
  total_price: number;

  @Column({ type: 'int', nullable: false })
  percentage_discount: number;

  @Column({ type: 'decimal', nullable: false })
  annual_price: number;

  @OneToMany(() => User, (user) => user.plan)
  users: User[];

  @OneToMany(() => Subscription, (subscription) => subscription.plan)
  subscriptions: Subscription[];
}
