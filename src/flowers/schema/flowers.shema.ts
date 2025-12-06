import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { FlowerCategory, FlowerSize, FlowerOccasion } from '../enums/flower.enums';

export type FlowerSchema = HydratedDocument<Flower>

@Schema()
export class Flower {
    @Prop({ required: true })
    name: string

    @Prop({ required: true })
    price: number

    @Prop({ required: true })
    description: string

    @Prop({ required: true, enum: FlowerCategory })
    category: FlowerCategory;
    
    @Prop({ required: true, type: [String] })
    images: string[]

    @Prop({ default: 0 }) 
    stock: number;

    @Prop({ required: true, enum: FlowerSize })
    size: FlowerSize;

    @Prop({ type: [String], required: true })
    colors: string[];

    @Prop({ required: true, enum: FlowerOccasion })
    occasion: FlowerOccasion;

    @Prop()
    careInstructions?: string;
}
export const FlowerSchema = SchemaFactory.createForClass(Flower)