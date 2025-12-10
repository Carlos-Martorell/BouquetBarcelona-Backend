// backend/src/stripe/stripe.controller.ts
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Stripe from 'stripe';
import { Request } from 'express';
import { Order } from '../src/orders/schema/order.schema';
import { Controller, Post, Body, Headers, Req, HttpCode, BadRequestException } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';

@Controller('stripe')
export class StripeController {
  private stripe: Stripe;

  constructor(
    @InjectModel('Order') private orderModel: Model<Order>
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-11-17.clover'
    });
  }

  // ==================== CREAR SESIÓN DE PAGO ====================

   @Post('create-checkout-session')
  async createCheckoutSession(@Body() body: { orderId: string }) {
    const { orderId } = body;


    const order = await this.orderModel.findById(orderId);

    if (!order) {
      throw new BadRequestException('Orden no encontrada');
    }

    if (order.status !== 'pending') {
      throw new BadRequestException('Esta orden ya fue procesada');
    }


    const total = order.total;

    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: 'Pedido Bouquet Barcelona',
                description: `Pedido #${orderId.slice(-6).toUpperCase()}`,
                images: ['https://res.cloudinary.com/dppk5xqnv/image/upload/v1733844060/logo_zafiro.png']
              },
              unit_amount: Math.round(total * 100) 
            },
            quantity: 1
          }
        ],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/checkout`,
        customer_email: order.customerEmail,
        metadata: {
          orderId: orderId
        }
      });

      await this.orderModel.findByIdAndUpdate(orderId, {
        stripeSessionId: session.id
      });

      return {
        sessionId: session.id,
        url: session.url
      };
    } catch (error) {
      console.error('Error creating Stripe session:', error);
      throw error;
    }
  }



  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string
  ) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        req.rawBody!,
        signature,
        webhookSecret!
      );
    } catch (err) {
      console.error('⚠️ Webhook signature verification failed:', err.message);
      return { error: 'Webhook signature verification failed' };
    }

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;

        if (orderId) {
          await this.orderModel.findByIdAndUpdate(orderId, {
            status: 'confirmed',
            paymentStatus: 'paid'
          });

          console.log(`✅ Orden ${orderId} marcada como pagada`);
        }
        break;

      case 'payment_intent.payment_failed':
        const failedSession = event.data.object as any;
        const failedOrderId = failedSession.metadata?.orderId;

        if (failedOrderId) {
          await this.orderModel.findByIdAndUpdate(failedOrderId, {
            paymentStatus: 'failed'
          });
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return { received: true };
  }
}