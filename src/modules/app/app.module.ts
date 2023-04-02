import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import config from '../../database/config/local';
import { LoggerMiddleware } from '../../middlewares/logger.middleware';
import { SwaggerService } from '../../swagger/swagger.service';
import { TokensModule } from '../tokens/tokens.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(config as TypeOrmModuleOptions),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    TokensModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, SwaggerService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
