import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-02-25.clover' as Stripe.LatestApiVersion,
    });
  }

  async createPaymentIntent(amount: number): Promise<{ clientSecret: string }> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe trabaja en céntimos
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
    });
    return { clientSecret: paymentIntent.client_secret! };
  }
}
