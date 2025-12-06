
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';



export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ 
    type: String, 
    enum: UserRole, 
    default: UserRole.USER 
  })
  role: UserRole;

  @Prop()
  phone?: string;

  @Prop()
  address?: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);


UserSchema.index({ email: 1 }, { unique: true });