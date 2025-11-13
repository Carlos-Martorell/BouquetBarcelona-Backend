import { Module } from '@nestjs/common';
import { FlowersService } from './flowers.service';
import { FlowersController } from './flowers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Flower, FlowerSchema} from './schema/flowers.shema';

@Module({
  imports: [MongooseModule.forFeature([{name: Flower.name, schema: FlowerSchema}])],
  controllers: [FlowersController],
  providers: [FlowersService],
})
export class FlowersModule {}
