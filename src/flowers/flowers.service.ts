import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFlowerDto } from './dto/create-flower.dto';
import { UpdateFlowerDto } from './dto/update-flower.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Flower } from './schema/flowers.shema';
import { Model } from 'mongoose';

@Injectable()
export class FlowersService {

constructor(
  @InjectModel(Flower.name) private flowerModel: Model<Flower>
){}  

  async create(createFlowerDto: CreateFlowerDto) {
    const createFlower = new this.flowerModel(createFlowerDto);
    return createFlower.save()
  }

  async findAll() {
    return this.flowerModel.find().exec() ;
  }

  async findOne(id: string) {
     const flower = await this.flowerModel.findById(id).exec();
  if (!flower) {
    throw new NotFoundException(`Flower with ID ${id} not found`);
  }
  return flower
}

  async update(id: string, updateFlowerDto: UpdateFlowerDto) {
    return this.flowerModel.findByIdAndUpdate(id, updateFlowerDto, {new:true}).exec();
  }

  async remove(id: string) {
    return this.flowerModel.findByIdAndDelete(id).exec()
  }
}
