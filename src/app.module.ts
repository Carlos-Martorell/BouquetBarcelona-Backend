import { forwardRef, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FlowersModule } from './flowers/flowers.module';
import { OrdersModule } from './orders/orders.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';
import { StripeModule } from 'src/stripe/stripe.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://cmartorellotal_db_user:12345@cluster0.6gdkzub.mongodb.net/?appName=Cluster0'), 
    FlowersModule,
    OrdersModule,
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule], 
      useFactory: async (configService: ConfigService) => ({
        
        uri: configService.get<string>('MONGO_URI'), 
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    SeedModule,
    StripeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
