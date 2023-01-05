# kodikwrapper
A kodikapi.com wrapper for Node.JS

| 📖 [Documentation](https://thedvxchsquad.github.io/kodikwrapper/index.html) |
| ------------------------------------------------------------------------- |

## Установка
```bash
npm i kodikwrapper
```

## Использования
Смотрите все доступные методы в [📖 Документации](https://thedvxchsquad.github.io/kodikwrapper/index.html).
```typescript
import { Client } from "kodikwrapper"; // ESM / TypeScript
// OR
const { Client } = require("kodikwrapper"); // CommonJS

// Create client 
const client = new Client({
  token: "<public token>",
});

client.search({
  limit: 1,
  title: "судьба ночь схватки прикосновение небес",
})
  .then(response => response.results.shift())
  .then(material => console.log(material));
/**
{
  id: 'movie-27068',
  type: 'anime',
  link: '//aniqit.com/video/27068/35bd2611080a6add3e209be3b76cd16d/720p',
  title: 'Судьба: Ночь схватки. Прикосновение небес',
  title_orig: "Gekijouban Fate/Stay Night: Heaven's Feel - I. Presage Flower",
  other_title: 'Судьба: Ночь схватки. Прикосновение небес (фильм первый) / Судьба. Ночь схватки - Прикосновение небес. 
Предвещающий цветок',
  translation: { id: 767, title: 'SHIZA Project', type: 'voice' },
  year: 2017,
  kinopoisk_id: '895880',
  imdb_id: 'tt4054952',
  worldart_link: 'http://www.world-art.ru/animation/animation.php?id=2588',
  shikimori_id: '25537',
  quality: 'BDRip 720p',
  camrip: false,
  blocked_countries: [],
  created_at: '2018-09-28T13:56:40Z',
  updated_at: '2019-11-16T22:10:16Z',
  screenshots: [
    'https://i.kodik.biz/screenshots/video/27068/1.jpg',
    'https://i.kodik.biz/screenshots/video/27068/2.jpg',
    'https://i.kodik.biz/screenshots/video/27068/3.jpg',
    'https://i.kodik.biz/screenshots/video/27068/4.jpg',
    'https://i.kodik.biz/screenshots/video/27068/5.jpg'
  ]
}
*/
```
