import { forwardRef, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FlowersModule } from './flowers/flowers.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://cmartorellotal_db_user:12345@cluster0.6gdkzub.mongodb.net/?appName=Cluster0'), 
    FlowersModule,
    OrdersModule 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
