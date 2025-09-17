import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { Basket } from '../../baskets/entities/basket.entity';

@Entity({ name: 'order_items' })
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Order, (o) => o.items, { onDelete: 'CASCADE', nullable: false })
  order!: Order;

  @ManyToOne(() => Basket, { nullable: false })
  basket!: Basket;

  @Column({ type: 'smallint' })
  quantity!: number;

  @Column({ name: 'unit_price', type: 'int' })
  unitPrice!: number; // en cents

  @Column({ name: 'line_total', type: 'int' })
  lineTotal!: number; // en cents
}
