import geniusLyrics from "genius-lyrics-api";
import { GeniusApiClient } from "./geniusApiClient.js";

export class Genius {
  constructor({ accessToken }) {
    this.accessToken = accessToken;
    this.apiClient = new GeniusApiClient(this.accessToken);
  }

  async lyricSections(artist, songTitle) {
    try {
    const lyrics = await geniusLyrics.getLyrics({
      artist: artist,
      title: songTitle,
      apiKey: this.accessToken,
      optimizeQuery: true,
    });

    const sections = lyrics
      .split(/\[.*\]\n/)
      .map((l) => l.replace("\n\n", ""))
      .filter((l) => l !== "\n" && l !== "")
      .filter(l => l.length < 1000); // arbitrary limit

      return { artist, title: songTitle, sections: removeDuplicates(sections) };
    } catch(err) {
      logger.error(err);
    }

    return [];
  }

  async topSongs(artist) {
    const id = await this.apiClient.getArtistId(artist);
    return this.apiClient.getSongs(id);
  }
}

function removeDuplicates(arr) {
  return [...new Set(arr)];
}