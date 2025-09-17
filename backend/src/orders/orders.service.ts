import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { Basket } from '../baskets/entities/basket.entity';
import { User } from '../users/entities/user.entity';
import { PickupLocation } from '../pickup/entities/pickup-location.entity';

@Injectable()
export class OrdersService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Order) private readonly ordersRepo: Repository<Order>,
    @InjectRepository(OrderItem) private readonly itemsRepo: Repository<OrderItem>,
    @InjectRepository(Basket) private readonly basketsRepo: Repository<Basket>,
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(PickupLocation) private readonly locationsRepo: Repository<PickupLocation>
  ) {}

  async create(userId: string, dto: CreateOrderDto): Promise<Order> {
    if (!dto.items?.length) {
      throw new BadRequestException('Aucun article');
    }

    const basketIds = dto.items.map((i) => i.basketId);
    const baskets = await this.basketsRepo.find({ where: { id: In(basketIds) } });
    if (baskets.length !== basketIds.length) throw new NotFoundException('Panier introuvable');

    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    const location = dto.locationId
      ? await this.locationsRepo.findOne({ where: { id: dto.locationId } })
      : null;

    try {
      return await this.dataSource.transaction(async (trx) => {
        const order = trx.getRepository(Order).create({
          user,
          location: location ?? null,
          pickupDate: dto.pickupDate,
          totalPrice: 0,
          statut: OrderStatus.ACTIVE,
        });
        const savedOrder = await trx.getRepository(Order).save(order);

        const byId = new Map(baskets.map((b) => [b.id, b]));
        let total = 0;
        const lines: OrderItem[] = [];

        for (const it of dto.items) {
          const b = byId.get(it.basketId)!;

          // Adapter selon le nom exact de la colonne côté entity Basket
          // Ex: price_basket en cents
          const unitPrice: number = (b as any).price_basket ?? (b as any).price ?? 0;
          const lineTotal = unitPrice * it.quantity;
          total += lineTotal;

          lines.push(
            trx.getRepository(OrderItem).create({
              order: savedOrder,
              basket: b,
              quantity: it.quantity,
              unitPrice,
              lineTotal,
            })
          );
        }

        await trx.getRepository(OrderItem).save(lines);

        savedOrder.totalPrice = total; // le trigger DB recalcule aussi, double filet
        await trx.getRepository(Order).save(savedOrder);

        return savedOrder;
      });
    } catch (e) {
      const msg = String((e as Error)?.message ?? '');
      // Messages fonctionnels déjà gérés
      if (msg.includes('Limite atteinte')) {
        throw new BadRequestException(msg);
      }
      if (msg.includes('Lieu indisponible')) {
        throw new BadRequestException(msg);
      }

      // Postgres: convertir codes courants en 400 lisibles
      const code: string | undefined = (e as any)?.code;

      if (code === '23514') {
        // CHECK violation (ex: quantity > 5)
        throw new BadRequestException('Quantité maximale par panier : 5.');
      }
      if (code === '23503') {
        // FK violation
        throw new BadRequestException('Référence invalide (utilisateur, lieu ou panier).');
      }
      if (code === '23505') {
        // unique violation (rare ici)
        throw new BadRequestException('Doublon interdit.');
      }

      // Log utile en dev (peut rester activé en dev uniquement)
      // eslint-disable-next-line no-console
      console.error('[orders.create] Unexpected error:', e);
      throw e;
    }
  }
}
