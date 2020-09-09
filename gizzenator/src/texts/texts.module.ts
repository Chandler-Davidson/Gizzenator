import { Module } from '@nestjs/common';
import { TextsService } from './texts.service';
import { TwilioService } from './twilio.service';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { LyricsService } from 'src/lyrics/lyrics.service';
import { LyricsModule } from 'src/lyrics/lyrics.module';
import { SubscriptionModule } from 'src/subscription/subscription.module';

@Module({
  imports: [
    LyricsModule,
    SubscriptionModule
  ],
  providers: [
    TextsService,
    TwilioService,
    SubscriptionService,
    LyricsService
  ],
})
export class TextsModule {}
