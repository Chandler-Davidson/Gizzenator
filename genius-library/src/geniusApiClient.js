import axios from 'axios';
// import { logger } from "logger";

export class GeniusApiClient {
  constructor(accessToken) {
    this.httpClient = axios.create({
      baseURL: "https://api.genius.com/",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }

  async getArtistId(artistName) {
    try {
      if (!artistName) {
        throw "No artist name given";
      }

      const response = await this.httpClient.get(
        `search?q=${encodeURIComponent(artistName)}`,
      );
      return response.data.response.hits[0].result.primary_artist.id;
    } catch (ex) {
      console.error(ex);
    }
  }

  async getSongs(artistId, sortByPopularity = true) {
    try {
      if (!artistId) {
        throw "No artist ID given";
      }

      const response = await this.httpClient.get(`artists/${artistId}/songs`, {
        params: {
          sort: sortByPopularity ? "popularity" : "default",
          per_page: 50,
        },
      });

      return response.data.response.songs.map(({ title }) => title);
    } catch (ex) {
      console.error(ex);
    }
  }
}
