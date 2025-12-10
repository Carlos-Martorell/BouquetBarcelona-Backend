// backend/src/stripe/stripe.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StripeController } from './stripe.controller';
import { OrderSchema } from '../src/orders/schema/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }])
  ],
  controllers: [StripeController]
})
export class StripeModule {}