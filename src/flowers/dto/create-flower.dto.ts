
import { IsString, IsNumber, IsNotEmpty, IsArray, IsInt, ArrayNotEmpty } from 'class-validator';
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
    
    @IsString()
    @IsNotEmpty()
    readonly category: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true }) 
    readonly images: string[];

    @IsNumber()
    @IsNotEmpty()
    @IsInt()
    readonly stock: number;

}
