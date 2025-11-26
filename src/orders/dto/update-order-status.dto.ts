import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsEnum(['pending', 'confirmed', 'delivered', 'cancelled'], {
    message: 'El estado debe ser uno de: pending, confirmed, delivered, o cancelled.',
  })
  @IsNotEmpty()
  status: string;
}