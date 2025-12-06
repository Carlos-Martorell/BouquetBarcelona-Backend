
import { IsString, IsNumber, IsNotEmpty, IsArray, IsInt, ArrayNotEmpty, IsEnum, Min, IsOptional } from 'class-validator';
import { FlowerCategory, FlowerOccasion, FlowerSize } from '../enums/flower.enums';
export class CreateFlowerDto {

    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsNumber()
    @IsNotEmpty()
    readonly price: number;

    @IsString()
    @IsNotEmpty()
    readonly description: string;
    
    @IsEnum(FlowerCategory)
    readonly category: FlowerCategory;

    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true }) 
    readonly images: string[];

    @IsNumber()
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    readonly stock: number;

    @IsEnum(FlowerSize)
    readonly size: FlowerSize;

    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    readonly colors: string[];

    @IsEnum(FlowerOccasion)
    readonly occasion: FlowerOccasion;

    @IsString()
    @IsOptional()
    readonly careInstructions?: string;
}
