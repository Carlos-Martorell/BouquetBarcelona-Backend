import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderDocument } from './schema/order.schema';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OrdersService {
  

  private readonly mapboxToken: string | undefined;
  
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private readonly configService: ConfigService
  ) {
    this.mapboxToken = this.configService.get<string>('MAPBOX_TOKEN');
  }
  
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
      const coordinates = await this.geocodeAddress(createOrderDto.deliveryAddress);
    
    const newOrder = new this.orderModel({
      ...createOrderDto,
      coordinates 
    });
    
    return newOrder.save();
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().exec();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return order;
  }


  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
     if (updateOrderDto.deliveryAddress) {
      const coordinates = await this.geocodeAddress(updateOrderDto.deliveryAddress);
      updateOrderDto['coordinates'] = coordinates;  
    }
    
    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, { new: true })
      .exec();
    
    if (!updatedOrder) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return updatedOrder;
  }

  async remove(id: string): Promise<void> {
    const result = await this.orderModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Order #${id} not found`);
    }
  }

////////EXTRAS

  async findByStatus(status: string): Promise<Order[]> {
    return this.orderModel.find({ status }).exec();
  }

  async findByDeliveryDate(date: Date): Promise<Order[]> {
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    
    return this.orderModel.find({
      deliveryDate: { $gte: startOfDay, $lte: endOfDay }
    }).exec();
  }

  async updateStatus(id: string, status: string): Promise<Order> {
    const order = await this.orderModel.findById(id);
    
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    
    order.status = status;
    return order.save();
  }


  private async geocodeAddress(address: string): Promise<{ lat: number; lng: number }> {
   
    
    if (!this.mapboxToken) {
      console.log('MAPBOX_TOKEN no configurado, usando coordenadas del taller');
      return this.getFallbackCoordinates();
    }

    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${this.mapboxToken}&limit=1`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        console.log(`Geocoded: ${address} → [${lat}, ${lng}]`);
        return { lat, lng };
      }
      
      console.log(`No se encontraron coordenadas para: ${address}`);
      return this.getFallbackCoordinates();
      
    } catch (error) {
      console.log('Error en geocoding:', error);
      return this.getFallbackCoordinates();
    }
  }


///Coordenadas del taller como fallback

  private getFallbackCoordinates(): { lat: number; lng: number } {
    return {
      lat: 41.37804698233292,
      lng: 2.1282850355819614
    };
  }
}
