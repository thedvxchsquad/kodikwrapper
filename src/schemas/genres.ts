import {
  AllowArray,
  FilterByAnotherDatabase,
  ReleaseType,
  TranslationType,
} from './types';

export interface GenresParams extends FilterByAnotherDatabase {
  /**
   * Какие жанры выводить. Изначально выводятся только жанры с КиноПоиска. Можно также выбрать вывод жанров с Shikimori, MyDramaList, либо сразу всех жанров с обоих ресурсов.
   */
  genres_type?: 'kinopoisk' | 'shikimori' | 'mydramalist' | 'all';
  /**
   * Фильтрация материалов по их типу. Для удобства доступно большое количество типов фильмов и сериалов. Необходимые типы указываются через запятую
   */
  types?: AllowArray<ReleaseType>;
  /**
   * Фильтрация материалов по году
   */
  year?: number;
  /**
   * 	Фильтрация материалов по ID озвучки. ID всех озвучек можно получить через API ресурс /translations либо на странице списка озвучек.
   */
  translation_id?: number;
  /**
   * 	Фильтрация материалов по типу перевода. Голосовой/Субтитры.
   */
  translation_type?: TranslationType;
  /**
   * Сортировка результатов. По названию жанра либо по количеству материалов с этим жанром.
   */
  sort?: 'title' | 'count';
}

export interface GenresResponseObject {
  title: string;
  count: number;
}

export interface GenresResponse {
  time: string;
  total: number;
  results: GenresResponseObject[];
}
