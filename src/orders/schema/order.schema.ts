import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  customerName: string;

  @Prop({ required: true })
  customerPhone: string;

  @Prop({ required: true })
  customerEmail: string;

  @Prop({ required: true })
  deliveryAddress: string;
  
  @Prop()
  deliveryDetails?: string;
  
  @Prop({ type: Object })
  coordinates: {
    lat: number;
    lng: number;
  };

  @Prop({ required: true, type: [Object] })
  items: Array<{
    flowerId: string;
    flowerName: string;
    quantity: number;
    price: number;
  }>;

  @Prop({ required: true })
  total: number;

  @Prop({ 
    required: true, 
    enum: ['pending', 'confirmed', 'delivered', 'cancelled'],
    default: 'pending'
  })
  status: string;

  @Prop({ required: true, type: Date })
  deliveryDate: Date;

  @Prop({ required: true })
  deliveryTime: string; // "10:00-12:00"

  @Prop()
  notes?: string;

}

export const OrderSchema = SchemaFactory.createForClass(Order);