// import { User } from 'src/users/entities/user.entity';
// import {
//   Column,
//   Entity,
//   JoinColumn,
//   ManyToOne,
//   OneToMany,
//   OneToOne,
//   PrimaryGeneratedColumn,
// } from 'typeorm';
// import { Plan } from './entity.plan';
// import { Payment } from './entity.payment';

// @Entity({ name: 'subscription' })
// export class Subscription {
//   @PrimaryGeneratedColumn({ type: 'int' })
//   id_subscription: number;

//   @OneToOne(() => User, (user) => user.subscriptions)
//   @JoinColumn({ name: 'id_admin' })
//   id_admin: User;

//   @ManyToOne(() => Plan, (plan) => plan.subscriptions)
//   @JoinColumn({ name: 'id_plan' })
//   plan: Plan;

//   @OneToMany(() => Payment, (payment) => payment.id_subscription)
//   payments: Payment[];

//   @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//   start_date: Date;

//   @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//   end_date: Date;

//   @Column({ type: 'boolean', default: false })
//   is_active: boolean;
// }
