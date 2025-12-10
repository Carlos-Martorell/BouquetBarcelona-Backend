import { Model } from 'mongoose';
import { Request } from 'express';
import { Order } from '../orders/schema/order.schema';
import type { RawBodyRequest } from '@nestjs/common';
export declare class StripeController {
    private orderModel;
    private stripe;
    constructor(orderModel: Model<Order>);
    createCheckoutSession(body: {
        orderId: string;
    }): Promise<{
        sessionId: string;
        url: string | null;
    }>;
    handleWebhook(req: RawBodyRequest<Request>, signature: string): Promise<{
        error: string;
        received?: undefined;
    } | {
        received: boolean;
        error?: undefined;
    }>;
}
