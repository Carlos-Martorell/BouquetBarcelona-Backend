import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SeedService } from './seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true 
  });


  app.enableCors({
    origin: [
      'http://localhost:4200',           
      'https://bouquet-barcelona-frontend.vercel.app',
      'https://bouquet-barcelona-shop-frontend.vercel.app'
      ], 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  app.setGlobalPrefix('api')

  ////habilitar validaciones
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true
  }))

  const seedService = app.get(SeedService);
  await seedService.createAdminUser();


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
