import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Subscription } from './entity.subscription';

@Entity({ name: 'payments' })
export class Payment {
  @ManyToOne(() => Subscription, (subscription) => subscription.payments)
  @JoinColumn({ name: 'id_subscription' })
  id_subscription: Subscription;

  @Column({ type: 'varchar', length: 100, nullable: false })
  mp_payment_id: string;

  @Column({ type: 'decimal', nullable: false })
  amount: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  currency: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  payment_date: Date;
}
