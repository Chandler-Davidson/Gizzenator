# Genius-Library

A wrapper utility for all content from Genius. Utilizes (Genius' API)[https://docs.genius.com/] for metadata and (genius-lyrics-api)[https://www.npmjs.com/package/genius-lyrics-api] for scraping lyrics.

## Example

``` javascript
  const artist = "King Gizzard & The Lizard Wizard";
  const genius = new Genius({ accessToken: "" });
  const songTitle = (await genius.topSongs(artist))[0];

  console.log(songTitle); // Robot Stop

  const lyricSections = await genius.lyricSections(artist, songTitle);

  console.log(lyricSections[0]); // Nonagon infinity opens the door...
```