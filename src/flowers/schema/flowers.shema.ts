import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type FlowerSchema = HydratedDocument<Flower>

@Schema()
export class Flower {
    @Prop({ required: true })
    name: string

    @Prop({ required: true })
    price: number

    @Prop({ required: true })
    description: string

    @Prop({ required: true })
    category: string
    
    @Prop({ required: true, type: [String] })
    images: string[]

    @Prop({ default: 0 }) 
    stock: number;
}
export const FlowerSchema = SchemaFactory.createForClass(Flower)