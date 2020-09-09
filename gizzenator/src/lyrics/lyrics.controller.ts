import { Controller, Get, Post, Delete } from '@nestjs/common';
import { LyricsService } from './lyrics.service';
import { artists } from './config/songs.config';
import { LyricsRunner } from './lyrics.runner';

@Controller('lyrics')
export class LyricsController {
  constructor(
    private readonly lyricsService: LyricsService,
    private readonly lyricsRunner: LyricsRunner,
  ) { }

  // Temporary Endpoint to manually trigger db update
  @Post()
  async post() {
    await this.lyricsService.deleteAll();

    const promises = artists.map(a => this.lyricsRunner.fetchAndStoreLyrics(a.artist, a.songs));
    return await Promise.all(promises);
  }
}
