import { Module, HttpModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import * as entities from './entities';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      envFilePath: `./config/${process.env.NODE_ENV}.env`
    }),
    HttpModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          url: configService.get('DATABASE_URL'),
          entities: [
            ...Object.values(entities)
          ],
          synchronize: true,
          ssl: true,
          logging: ['error'],
        }
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      ...Object.values(entities)
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
