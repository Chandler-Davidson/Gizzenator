import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getLyrics } from 'genius-lyrics-api';
import { StoreSongDto } from './dto/store-song.dto';
import { Song } from './entity/song.entity';
import { Repository } from 'typeorm';
import { Verse } from './entity/verse.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LyricsRunner {
  constructor(
    @InjectRepository(Song)
    private readonly songRepository: Repository<Song>,

    @InjectRepository(Verse)
    private readonly verseRepository: Repository<Verse>,

    private readonly configService: ConfigService
  ) { }

  async fetchAndStoreLyrics(artist: string, songTitles: string[]) {
    const verses = this.parseVerses(await this.fetchLyrics(artist, songTitles), songTitles);
    this.storeLyrics(verses);
  }

  private fetchLyrics(artist: string, songTitles: string[]): Promise<StoreSongDto[]> {
    const requests = songTitles.map(title => ({
      apiKey: this.configService.get('GENIUS_ACCESS_TOKEN'),
      artist,
      title
    }));

    return Promise.all(requests.map(r => getLyrics(r)));
  }

  private async storeLyrics(songs: StoreSongDto[]) {
    const titles = await this.songRepository.save(
      songs.map(s => ({
        title: s.title
      })));
    
    const verseDto = songs.map(s => {
      const songId = titles.find(t => t.title === s.title).id;

      return s.lyrics.map((l, i) => ({
        songId,
        verseNumber: i,
        lyric: l[0]
      }));
    }).flat();

    const verses = await this.verseRepository.save(verseDto);
  }

  private parseVerses(lyrics, titles) {
    return lyrics
    .map(l => l.replace(/\[[\w -]+\]/g, ''))  // Remove [Chorus] identifiers
    .map(l => l.split('\n\n\n')) // Split verses
    .map(l => l.map(f => f.split('\r\n'))) // Remove additional newlines
    .map(l => l.map(f => f.filter(r => r !== ''))) // Remove empty lines
    .map((l, i) => ({ // Map to JSON
      title: titles[i],
      lyrics: l
    }));
  }
}
