import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  // JoinColumn,
  // OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
// import { Subscription } from './entity.subscription';

@Entity({ name: 'payments' })
export class Payment {
  @PrimaryGeneratedColumn({ type: 'int' })
  id_payment: number;

  // @OneToOne(() => Subscription, (subscription) => subscription.payments)
  // @JoinColumn({ name: 'id_subscription' })
  // id_subscription: Subscription;

  @Column({ type: 'varchar', length: 100, nullable: true })
  mp_payment_id: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  mp_order_id: string | null;

  @Column({ type: 'varchar', length: 100, nullable: false })
  mp_preference_id: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  init_point: string;

  @Column({ type: 'timestamp', nullable: false })
  init_point_expiration_date: Date;

  @Column({ type: 'decimal', nullable: false })
  amount: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  currency: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  status: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  payment_date: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  mp_preference_date: Date;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid', nullable: false })
  userId: string;
}
