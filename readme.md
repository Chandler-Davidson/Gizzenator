# Gizzenator

## Intro

- **What** - A Discord bot that serves King Gizzard & the Lizard Wizard lyrics

- **Why** - _Eh, why not?_


## Breakdown

_TLDR_: Prefetch top songs, batch them into jobs. Fetch lyrics for each song, parse, and store locally. On command, Discord bot fetches a quote from our service. It was surprisingly cumbersome to fetch lyrics on demand.

- lyrics-service
  - app
    - main api
    - creates jobs in a queue
    - inserts artist/songs into storage
    - fetches lyrics from storage
  - lyrics-runner
    - recieves jobs from queue
    - fetches lyrics from genius
    - stores lyrics in sections
    - short lived
- discord-bot
  - manages itself
- logger
  - default logger for services
- genius-library
  - provides access to Genius API/lyrics

## Roadmap
  - better config/secret management
    - test environment
  - lyrics-service
    - should I increase API security? Users?
    - api should be able to refresh most popular songs
    - prefetch buffer of lyrics, reduce IO from storage
  - discord-bot
    - schedule reocurring lyrics
      - think about channel ID storage
  - website
    - description
    - link to add app/bot to server

## Support Development

- Log a ticket
- Make a PR
- [Buy me a coffee](https://www.buymeacoffee.com/chandlerd)