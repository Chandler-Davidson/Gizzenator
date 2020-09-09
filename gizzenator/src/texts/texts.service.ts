import { Injectable } from '@nestjs/common';
import { TwilioService } from './twilio.service';
import { Cron } from '@nestjs/schedule';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { LyricsService } from 'src/lyrics/lyrics.service';

@Injectable()
export class TextsService {
  constructor(
    private readonly messageService: TwilioService,
    private readonly subscriptionsService: SubscriptionService,
    private readonly lyricsService: LyricsService,

  ) { }

  sendText(phoneNumber: string, contents: string) {
    return this.messageService.sendText(phoneNumber, contents);
  }

  @Cron('0 12 * * *')
  async gizzenateSubscribers() {
    const [
      verse,
      subscriptions
    ] = await Promise.all([
      this.lyricsService.getRandomVerse(),
      this.subscriptionsService.getSubscriptions()
    ]);

    const song = await this.lyricsService.getSong(verse.songId);
    return subscriptions.map(n => this.messageService.sendText(n.phoneNumber, `${verse.lyric}\n\n${song.title}`));
  }
}
