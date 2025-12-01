import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument, UserRole } from '../users/schema/user.schema';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  async createAdminUser() {
    const adminExists = await this.userModel.findOne({ 
      email: 'admin@bouquet.com' 
    });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('Admin123!', 10);
      
      await this.userModel.create({
        name: 'Admin Master',
        email: 'admin@bouquet.com',
        password: hashedPassword,
        role: UserRole.ADMIN
      });
      
      console.log('Admin user created: admin@bouquet.com / Admin123!');
    } else {
      console.log('Admin user already exists');
    }
  }
}