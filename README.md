<p align="center"><img src="https://raw.githubusercontent.com/thedvxchsquad/kodikwrapper/master/.github/logo.svg"></p>
<p align="center">
    <a href="https://www.npmjs.com/package/kodikwrapper"><img src="https://img.shields.io/npm/v/kodikwrapper.svg?style=flat-square" alt="NPM version"></a>
    <a href="https://www.npmjs.com/package/kodikwrapper"><img src="https://img.shields.io/npm/dt/kodikwrapper.svg?style=flat-square" alt="NPM downloads"></a>
</p>

> kodikwrapper - это реализация API kodikapi.com для Node.js

> [!NOTE]
> Начиная с v3.0.0 поддерживается только Node.js 18.0.0+

| 📖 [TSDocs](https://tsdocs.dev/search/docs/kodikwrapper) | 📖 [Kodik API документация (требуется авторизация)](https://bd.kodik.biz/api/info) |
|-------------------------------------------------------------------------|-----------------------------------------------------------------------------------:|

## Установка
```bash
npm i kodikwrapper
yarn add kodikwrapper
pnpm add kodikwrapper
```

## Использования

### Класс Client
Класс `Client` реализует только публичное API из [документации Kodik API](https://bd.kodik.biz/api/info). Это означает, что методы будут называться одинаково.

Смотрите все доступные методы в [📖 TSDocs](https://tsdocs.dev/search/docs/kodikwrapper), [документации Kodik API](https://bd.kodik.biz/api/info) или с помощью подсказок в IDE.

```javascript
import { Client } from 'kodikwrapper'; // ESM / TypeScript
// или
const { Client } = require('kodikwrapper'); // CommonJS

// Создание клиента 
const client = new Client({
  token: '<public token>',
});
// или
const client = Client.fromToken('<public token>')

client.search({
  limit: 1,
  title: 'судьба ночь схватки прикосновение небес',
})
  .then((response) => response.results.shift())
  .then((material) => console.log(material));

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

### Класс VideoLinks

Класс `VideoLinks` используется для получения прямых ссылок на файлы с Kodik и получения дополнительной информации о материале (тайминги для пропуска опенингов/эндингов, озвучку и др.), как это делает их плеер.

```javascript
import { Client, VideoLinks } from 'kodikwrapper';

const client = Client.fromToken('<public token>')

client.search({
  limit: 1,
  title: 'судьба ночь схватки прикосновение небес',
})
  .then((response) => response.results.shift())
  .then(async (material) => {
    if (!material) throw new Error('не найдено');
    
    const links = await VideoLinks.getLinks({
      link: material.link
    });
    
    console.log(links);
  });

/**
 {
   "360": [
     {
       "src": "//cloud.kodik-storage.com/useruploads/c936a552-2455-43e2-9854-1625aaac9db8/fd762bc53599a4b97c8151a5fc725ddb:2024021820/360.mp4:hls:manifest.m3u8",
       "type": "application/x-mpegURL"
     }
   ],
   "480": [
     {
       "src": "//cloud.kodik-storage.com/useruploads/c936a552-2455-43e2-9854-1625aaac9db8/fd762bc53599a4b97c8151a5fc725ddb:2024021820/480.mp4:hls:manifest.m3u8",
       "type": "application/x-mpegURL"
     }
   ],
   "720": [
     {
       "src": "//cloud.kodik-storage.com/useruploads/c936a552-2455-43e2-9854-1625aaac9db8/fd762bc53599a4b97c8151a5fc725ddb:2024021820/720.mp4:hls:manifest.m3u8",
       "type": "application/x-mpegURL"
     }
   ]
 }
 */
```


#### Актуальный endpoint для получения ссылок

Недавно Kodik начал часто менять endpoint для получения прямых ссылок, поэтому в прошлых обновлениях (до v3.0.0) я добавил поле `videoInfoUrl` (начиная с v3.0.0 - `videoInfoEndpoint`) для его замены.

Так как они могут снова изменить endpoint, начиная с v3.0.0, в класс `VideoLinks` добавлен метод `getActualVideoInfoEndpoint` для получения актуального endpoint, в который необходимо передать ссылку на чанк с плеером. Получить ссылку на чанк можно с помощью метода `parseLink` с переданным параметром `extended: true`

```javascript
const getLinksWithActualEndpoint = async (link) => {
  const parsedLink = await VideoLinks.parseLink({
    link, extended: true
  });

  if (!parsedLink.ex.playerSingleUrl) throw new Error('не могу получить ссылку на чанк с плеером');

  const endpoint = await VideoLinks.getActualVideoInfoEndpoint(parsedLink.ex.playerSingleUrl);

  const links = await VideoLinks.getLinks({
    link, videoInfoEndpoint: endpoint
  });
  
  return links;
};

getLinksWithActualEndpoint('//aniqit.com/video/27068/35bd2611080a6add3e209be3b76cd16d/720p')
  .then(console.log)
```
