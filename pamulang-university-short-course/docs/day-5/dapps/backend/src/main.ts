import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Simple Storage API')
    .setDescription(
      'Project Simple Storage dApp Fullstack Integration\n\n' +
      '**Nama: Dharma Fathahillah**\n' +
      '**NIM: 231011401770**' 
    )
    .setVersion('2.0.77')
    .addTag('simple-storage')
    .build();
    
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((error) => {
  console.error('SYSTEM_FAILURE:', error);
  process.exit(1);
});