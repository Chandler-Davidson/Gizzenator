import { Module } from '@nestjs/common';
import { LyricsService } from './lyrics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LyricsController } from './lyrics.controller';
import { Song } from './entity/song.entity';
import { Verse } from './entity/verse.entity';
import { LyricsRunner } from './lyrics.runner';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Song,
      Verse
    ])
  ],
  providers: [LyricsService, LyricsRunner],
  controllers: [LyricsController],
  exports: [TypeOrmModule]
})
export class LyricsModule {}
