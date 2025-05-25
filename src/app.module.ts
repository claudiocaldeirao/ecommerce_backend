import { Logger, Module } from '@nestjs/common';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { typeOrmConfig } from './config/typeorm.config';
import { validationSchema } from './config/validation.schema';
import { HealthModule } from './health/health.module';
import { ProductModule } from './product/product.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ShoppingCartModule } from './shopping-cart/shopping-cart.module';
import { GracefulShutdownModule } from 'nestjs-graceful-shutdown';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
    }),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    GracefulShutdownModule.forRoot({
      cleanup: async (app, signal) => {
        Logger.warn(`[Graceful Shutdown] signal: ${signal}`);

        const dataSource = app.get<DataSource>(getDataSourceToken());

        if (dataSource.isInitialized) {
          Logger.warn('[Graceful Shutdown] Closing DB connection...');
          await dataSource.destroy();
          Logger.warn('[Graceful Shutdown] DB connection closed.');
        }
        process.exit(0);
      },
    }),
    AuthModule,
    HealthModule,
    ProductModule,
    UserModule,
    ShoppingCartModule,
  ],
})
export class AppModule {}
