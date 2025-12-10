"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeController = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const stripe_1 = __importDefault(require("stripe"));
const common_1 = require("@nestjs/common");
let StripeController = class StripeController {
    orderModel;
    stripe;
    constructor(orderModel) {
        this.orderModel = orderModel;
        this.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2025-11-17.clover'
        });
    }
    async createCheckoutSession(body) {
        const { orderId } = body;
        const order = await this.orderModel.findById(orderId);
        if (!order) {
            throw new common_1.BadRequestException('Orden no encontrada');
        }
        if (order.status !== 'pending') {
            throw new common_1.BadRequestException('Esta orden ya fue procesada');
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
        }
        catch (error) {
            console.error('Error creating Stripe session:', error);
            throw error;
        }
    }
    async handleWebhook(req, signature) {
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        let event;
        try {
            event = this.stripe.webhooks.constructEvent(req.rawBody, signature, webhookSecret);
        }
        catch (err) {
            console.error('⚠️ Webhook signature verification failed:', err.message);
            return { error: 'Webhook signature verification failed' };
        }
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;
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
                const failedSession = event.data.object;
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
};
exports.StripeController = StripeController;
__decorate([
    (0, common_1.Post)('create-checkout-session'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StripeController.prototype, "createCheckoutSession", null);
__decorate([
    (0, common_1.Post)('webhook'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Headers)('stripe-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], StripeController.prototype, "handleWebhook", null);
exports.StripeController = StripeController = __decorate([
    (0, common_1.Controller)('stripe'),
    __param(0, (0, mongoose_1.InjectModel)('Order')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], StripeController);
//# sourceMappingURL=stripe.controller.js.map