import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);
  
  app.enableCors({origin : [configService.get<string>('BACK'), configService.get<string>('FRONT')], maxAge : 7200});
  app.useWebSocketAdapter(new IoAdapter(app));
  await app.listen(3000);

  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log("Socket server ... OK");
}

bootstrap();
