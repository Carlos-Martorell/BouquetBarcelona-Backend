import { 
  IsString, 
  IsNumber, 
  IsEmail, 
  IsNotEmpty, 
  IsArray, 
  ValidateNested, 
  IsOptional,
  IsDateString,
  IsEnum,
  Min,
  ArrayMinSize
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  flowerId: string;

  @IsString()
  @IsNotEmpty()
  flowerName: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0.01)
  price: number;
}


class CoordinatesDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}


export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @IsEmail()
  @IsNotEmpty()
  customerEmail: string;

  @IsString()
  @IsNotEmpty()
  deliveryAddress: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  coordinates?: CoordinatesDto;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsNumber()
  @Min(0.01)
  total: number;

  @IsEnum(['pending', 'confirmed', 'delivered', 'cancelled'])
  @IsOptional()
  status?: string;

  @IsDateString()
  @IsNotEmpty()
  deliveryDate: string;

  @IsString()
  @IsNotEmpty()
  deliveryTime: string;

  @IsString()
  @IsOptional()
  notes?: string;
}