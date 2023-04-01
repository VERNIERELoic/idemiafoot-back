import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(3000);
  app.enableCors({origin : ["http://localhost:3000", "http://localhost:4200"], maxAge : 7200});
  console.log(`Application is running on: ${await app.getUrl()}`);
 
}
bootstrap();
