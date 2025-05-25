import { setupGracefulShutdown } from 'nestjs-graceful-shutdown';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VersioningType } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from '@/app.module';
import { ExceptionsFilter } from '@/common/filters/exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const config = new DocumentBuilder()
    .setTitle('E-Commerce API')
    .setDescription(
      'This is the API documentation for the E-Commerce application.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  setupGracefulShutdown({ app });
  app.useGlobalFilters(new ExceptionsFilter());
  await app.listen(process.env.API_PORT || 3000);
}
bootstrap();
