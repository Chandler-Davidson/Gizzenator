import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Verse } from './entity/verse.entity';
import { Song } from './entity/song.entity';

@Injectable()
export class LyricsService {
  constructor(
    @InjectRepository(Verse)
    private readonly verseRepository: Repository<Verse>,
    @InjectRepository(Song)
    private readonly songRepository: Repository<Song>,
  ) { }

  async getRandomVerse(): Promise<Verse> {
    return (await this.verseRepository.createQueryBuilder()
      .select('*')
      .from(Verse, 'alias')
      .orderBy('random()')
      .take(1)
      .execute())[0];
  }

  async getSong(songId: string): Promise<Song> {
    return this.songRepository.findOne({
      where: { id: songId }
    });
  }

  deleteAll() {
    this.verseRepository.delete({});
  }
}
