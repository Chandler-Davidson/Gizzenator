import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LyricsModule } from './lyrics/lyrics.module';
import { TextsModule } from './texts/texts.module';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot(),
    ScheduleModule.forRoot(),
    LyricsModule,
    TextsModule,
    SubscriptionModule,
  ]
})
export class AppModule {}
