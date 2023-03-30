export type AllowArray<T> = T | T[];

export type ReleaseType =
  | 'foreign-movie'
  | 'soviet-cartoon'
  | 'foreign-cartoon'
  | 'russian-cartoon'
  | 'anime'
  | 'russian-movie'
  | 'cartoon-serial'
  | 'documentary-serial'
  | 'russian-serial'
  | 'foreign-serial'
  | 'anime-serial'
  | 'multi-part-film';

export type TranslationType = 'voice' | 'subtitles';
export type MPPARating =
  | 'G'
  | 'PG'
  | 'PG-13'
  | 'R'
  | 'R+'
  | 'Rx'
  | 'R'
  | 'PG-13';
export type AnimeKind =
  | 'tv'
  | 'movie'
  | 'ova'
  | 'ona'
  | 'special'
  | 'music'
  | 'tv_13'
  | 'tv_24'
  | 'tv_48'
  | 'movie'
  | 'ova';
export type AnimeDramaAllStatus =
  | 'anons'
  | 'ongoing'
  | 'released'
  | 'ongoing'
  | 'released';
export type Translation = {
  id: number;
  title: string;
  type: TranslationType;
};
export interface FilterByAnotherDatabase {
  /**
   * Фильтрация материалов по стране. Можно указать как одно значение, так и несколько значений через запятую (тогда будут выведены материалы, у которых есть хотя бы одна из перечисленных стран). Параметр регистрозависимый.
   */
  countries?: AllowArray<string>;
  /**
   * Фильтрация материалов по жанру. Можно указать как одно значение, так и несколько значений через запятую (тогда будут выведены материалы, у которых есть хотя бы один из указаных жанров). Искать можно по жанрам с КиноПоиск, Shikimori, MyDramaList, либо сразу по всем жанрам. Параметр регистронезависимый.
   */
  genres?: AllowArray<string>;
  /**
   * Фильтрация материалов по жанру. Можно указать как одно значение, так и несколько значений через запятую (тогда будут выведены материалы, у которых есть хотя бы один из указаных жанров). Искать можно по жанрам с КиноПоиск, Shikimori, MyDramaList, либо сразу по всем жанрам. Параметр регистронезависимый.
   */
  anime_genres?: AllowArray<string>;
  /**
   * Фильтрация материалов по жанру. Можно указать как одно значение, так и несколько значений через запятую (тогда будут выведены материалы, у которых есть хотя бы один из указаных жанров). Искать можно по жанрам с КиноПоиск, Shikimori, MyDramaList, либо сразу по всем жанрам. Параметр регистронезависимый.
   */
  drama_genres?: AllowArray<string>;
  /**
   * Фильтрация материалов по жанру. Можно указать как одно значение, так и несколько значений через запятую (тогда будут выведены материалы, у которых есть хотя бы один из указаных жанров). Искать можно по жанрам с КиноПоиск, Shikimori, MyDramaList, либо сразу по всем жанрам. Параметр регистронезависимый.
   */
  all_genres?: AllowArray<string>;
  /**
   * Фильтрация материалов по продолжительности (в минутах). Указать можно как единичное значение для поиска точной продолжительности, так и интервал.
   */
  duration?: string | number;
  /**
   * Фильтрация материалов по рейтингу КиноПоиска, IMDb, Shikimori или MyDramaList. Указать можно как единичное значение для поиска точного рейтинга, так и интервал.
   */
  kinopoisk_rating?: number | string;
  /**
   * Фильтрация материалов по рейтингу КиноПоиска, IMDb, Shikimori или MyDramaList. Указать можно как единичное значение для поиска точного рейтинга, так и интервал.
   */
  imdb_rating?: number | string;
  /**
   * Фильтрация материалов по рейтингу КиноПоиска, IMDb, Shikimori или MyDramaList. Указать можно как единичное значение для поиска точного рейтинга, так и интервал.
   */
  shikimori_rating?: number | string;
  /**
   * Фильтрация материалов по рейтингу КиноПоиска, IMDb, Shikimori или MyDramaList. Указать можно как единичное значение для поиска точного рейтинга, так и интервал.
   */
  mydramalist_rating?: number | string;
  /**
   * Фильтрация материалов по персонам. Можно указать как одно значение, так и несколько значений через запятую (тогда будут выведены материалы, у которых есть хотя бы одна из указанных персон). Параметр регистронезависимый. Можно указывать фильтры сразу по нескольким профессиям.
   */
  actors?: AllowArray<number | string>;
  /**
   * Фильтрация материалов по персонам. Можно указать как одно значение, так и несколько значений через запятую (тогда будут выведены материалы, у которых есть хотя бы одна из указанных персон). Параметр регистронезависимый. Можно указывать фильтры сразу по нескольким профессиям.
   */
  directors?: AllowArray<number | string>;
  /**
   * Фильтрация материалов по персонам. Можно указать как одно значение, так и несколько значений через запятую (тогда будут выведены материалы, у которых есть хотя бы одна из указанных персон). Параметр регистронезависимый. Можно указывать фильтры сразу по нескольким профессиям.
   */
  producers?: AllowArray<number | string>;
  /**
   * Фильтрация материалов по персонам. Можно указать как одно значение, так и несколько значений через запятую (тогда будут выведены материалы, у которых есть хотя бы одна из указанных персон). Параметр регистронезависимый. Можно указывать фильтры сразу по нескольким профессиям.
   */
  writers?: AllowArray<number | string>;
  /**
   * Фильтрация материалов по персонам. Можно указать как одно значение, так и несколько значений через запятую (тогда будут выведены материалы, у которых есть хотя бы одна из указанных персон). Параметр регистронезависимый. Можно указывать фильтры сразу по нескольким профессиям.
   */
  composers?: AllowArray<number | string>;
  /**
   * Фильтрация материалов по персонам. Можно указать как одно значение, так и несколько значений через запятую (тогда будут выведены материалы, у которых есть хотя бы одна из указанных персон). Параметр регистронезависимый. Можно указывать фильтры сразу по нескольким профессиям.
   */
  editors?: AllowArray<number | string>;
  /**
   * Фильтрация материалов по персонам. Можно указать как одно значение, так и несколько значений через запятую (тогда будут выведены материалы, у которых есть хотя бы одна из указанных персон). Параметр регистронезависимый. Можно указывать фильтры сразу по нескольким профессиям.
   */
  designers?: AllowArray<number | string>;
  /**
   * Фильтрация материалов по персонам. Можно указать как одно значение, так и несколько значений через запятую (тогда будут выведены материалы, у которых есть хотя бы одна из указанных персон). Параметр регистронезависимый. Можно указывать фильтры сразу по нескольким профессиям.
   */
  operators?: AllowArray<number | string>;
  /**
   * Фильтрация материалов по возрастному рейтингу. Можно указать как одно значение, так и несколько значений через запятую. Параметр регистронезависимый.
   */
  mpaa_rating?: AllowArray<MPPARating>;
  /**
   * Фильтрация материалов по минимальному возрасту, с которого можно смотреть. Можно указать как одно значение, так и диапазон значений.
   */
  minimal_age?: number | string;
  /**
   * Фильтрация материалов по аниме типу. Можно указать как одно значение, так и несколько значений через запятую (тогда будут выведены материалы, у которых есть хотя бы один из перечисленных типов)
   */
  anime_kind?: AllowArray<AnimeKind>;
  /**
   * Фильтрация материалов по статусу Shikimori, MyDramaList или по всем статусам. Можно указать как одно значение, так и несколько значений через запятую (тогда будут выведены материалы, у которых есть хотя бы один из перечисленных статусов).
   */
  anime_status?: AllowArray<AnimeDramaAllStatus>;
  /**
   * Фильтрация материалов по статусу Shikimori, MyDramaList или по всем статусам. Можно указать как одно значение, так и несколько значений через запятую (тогда будут выведены материалы, у которых есть хотя бы один из перечисленных статусов).
   */
  drama_status?: AllowArray<AnimeDramaAllStatus>;
  /**
   * Фильтрация материалов по статусу Shikimori, MyDramaList или по всем статусам. Можно указать как одно значение, так и несколько значений через запятую (тогда будут выведены материалы, у которых есть хотя бы один из перечисленных статусов).
   */
  all_status?: AllowArray<AnimeDramaAllStatus>;
  /**
   * Фильтрация материалов по аниме студии. Можно указать как одно значение, так и несколько значений через запятую (тогда будут выведены материалы, у которых есть хотя бы одна из перечисленных студий).
   */
  anime_studios?: AllowArray<string>;
  /**
   * Фильтрация материалов по владельцу лицензии. Можно указать как одно значение, так и несколько значений через запятую (тогда будут выведены материалы, у которых есть хотя бы один из перечисленных владельцев).
   */
  anime_licensed_by?: AllowArray<string>;
}
export interface MaterialData {
  /**
   * Название
   * Источник: KinoPoisk, Shikimori
   */
  title?: string;

  /**
   * Название аниме
   * Источник: Shikimori
   */
  anime_title?: string;

  /**
   * Оригинальное название
   * Источник: KinoPoisk, Shikimori, MyDramaList
   */
  title_en?: string;

  /**
   * Другие названия материала (массив)
   * Источник: Shikimori, MyDramaList
   */
  other_titles?: string[];

  /**
   * Другие названия материала на английском (массив)
   * Источник: Shikimori
   */
  other_titles_en?: string[];

  /**
   * Другие названия материала на японском (массив)
   * Источник: Shikimori
   */
  other_titles_jp?: string[];

  /**
   * Название лицензии в России
   * Источник: Shikimori
   */
  anime_license_name?: string;

  /**
   * Владельцы лицензий (массив)
   * Источник: Shikimori
   */
  anime_licensed_by?: string[];

  /**
   * Тип аниме
   * Источник: Shikimori
   */
  anime_kind?: AnimeKind;

  /**
   * Статус материала
   * Источник: Shikimori, MyDramaList
   */
  all_status?: AnimeDramaAllStatus;

  /**
   * Статус аниме
   * Источник: Shikimori
   */
  anime_status?: AnimeDramaAllStatus;

  /**
   * Статус дорамы
   * Источник: MyDramaList
   */
  drama_status?: AnimeDramaAllStatus;

  /**
   * Год
   * Источник: KinoPoisk
   */
  year?: number;

  /**
   * Слоган
   * Источник: KinoPoisk
   */
  tagline?: string;

  /**
   * Описание
   * Источник: KinoPoisk, Shikimori
   */
  description?: string;

  /**
   * Описание аниме
   * Источник: Shikimori
   */
  anime_description?: string;

  /**
   * Ссылка на постер
   * Источник: KinoPoisk, Shikimori, MyDramaList
   */
  poster_url?: string;

  /**
   * Ссылки на кадры (массив)
   * Источник: Shikimori
   */
  screenshots?: string[];

  /**
   * Продолжительность (в минутах)
   * Источник: KinoPoisk, Shikimori, MyDramaList
   */
  duration?: number;

  /**
   * Страны (массив)
   * Источник: KinoPoisk, MyDramaList
   */
  countries?: string[];

  /**
   * Все жанры (массив)
   * Источник: KinoPoisk, Shikimori, MyDramaList
   */
  all_genres?: string[];

  /**
   * Жанры (массив)
   * Источник: KinoPoisk
   */
  genres?: string[];

  /**
   * Аниме жанры (массив)
   * Источник: Shikimori
   */
  anime_genres?: string[];

  /**
   * Дорама жанры (массив)
   * Источник: MyDramaList
   */
  drama_genres?: string[];

  /**
   * Аниме студии (массив)
   * Источник: Shikimori
   */
  anime_studios?: string[];

  /**
   * Рейтинг на КиноПоиске
   * Источник: KinoPoisk
   */
  kinopoisk_rating?: number;

  /**
   * Количество голосов рейтинга на КиноПоиске
   * Источник: KinoPoisk
   */
  kinopoisk_votes?: number;

  /**
   * Рейтинг на IMDb
   * Источник: KinoPoisk
   */
  imdb_rating?: number;

  /**
   * Количество голосов рейтинга на IMDb
   * Источник: KinoPoisk
   */
  imdb_votes?: number;

  /**
   * Рейтинг на Shikimori
   * Источник: Shikimori
   */
  shikimori_rating?: number;

  /**
   * Количество голосов рейтинга на Shikimori
   * Источник: Shikimori
   */
  shikimori_votes?: number;

  /**
   * Рейтинг на MyDramaList
   * Источник: MyDramaList
   */
  mydramalist_rating?: number;

  /**
   * Количество голосов рейтинга на MyDramaList
   * Источник: MyDramaList
   */
  mydramalist_votes?: number;

  /**
   * Дата премьеры в России
   * Источник: KinoPoisk
   */
  premiere_ru?: string;

  /**
   * Дата премьеры в мире
   * Источник: KinoPoisk
   */
  premiere_world?: string;

  /**
   * Дата начала показа
   * Источник: Shikimori, MyDramaList
   */
  aired_at?: string;

  /**
   * Дата конца показа
   * Источник: Shikimori, MyDramaList
   */
  released_at?: string;

  /**
   * Время выхода следующего эпизода
   * Источник: Shikimori, MyDramaList
   */
  next_episode_at?: string;

  /**
   * Рейтинг MPAA
   * Источник: KinoPoisk, Shikimori
   */
  rating_mpaa?: MPPARating;

  /**
   * Минимально возможный возраст для просмотра
   * Источник: KinoPoisk, MyDramaList
   */
  minimal_age?: number;

  /**
   * Количество эпизодов
   * Источник: Shikimori, MyDramaList
   */
  episodes_total?: number;

  /**
   * Количество уже вышедших эпизодов
   * Источник: Shikimori, MyDramaList
   */
  episodes_aired?: number;

  /**
   * Актеры (массив)
   * Источник: KinoPoisk, MyDramaList
   */
  actors?: string[];

  /**
   * Режиссеры (массив)
   * Источник: KinoPoisk, MyDramaList
   */
  directors?: string[];

  /**
   * Продюссеры (массив)
   * Источник: KinoPoisk, MyDramaList
   */
  producers?: string[];

  /**
   * Сценаристы (массив)
   * Источник: KinoPoisk, MyDramaList
   */
  writers?: string[];

  /**
   * Композиторы (массив)
   * Источник: KinoPoisk, MyDramaList
   */
  composers?: string[];

  /**
   * Монтажеры (массив)
   * Источник: KinoPoisk, MyDramaList
   */
  editors?: string[];

  /**
   * Художники (массив)
   * Источник: KinoPoisk, MyDramaList
   */
  designers?: string[];

  /**
   * Операторы (массив)
   * Источник: KinoPoisk, MyDramaList
   */
  operators?: string[];
}

export interface EpisodeDataObject {
  title?: string;
  link: string;
  screenshots: string[];
}

export interface EpisodesObject {
  [episode: string | number]: string | EpisodeDataObject;
}

export interface SeasonObject {
  link: string;
  episodes?: EpisodesObject;
}

export interface SeasonsObject {
  [season: string | number]: SeasonObject;
}
export interface BlockedSeasonsObject {
  [season: string | number]: 'all' | string[];
}
// export type
