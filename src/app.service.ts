import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class AppService {

constructor(@InjectConnection() private connection: Connection){}

async onModuleInit() {
  const isConnected = this.connection.readyState === 1;
  console.log(`Mongo DB connection status: ${isConnected ? 'Connected' : 'Not Connected'}`)

}

  getHello(): string {
    return 'Hello World!';
  }
}
