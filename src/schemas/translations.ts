import {
  AllowArray,
  FilterByAnotherDatabase,
  ReleaseType,
  TranslationType,
} from './types';

export interface TranslationsParams extends FilterByAnotherDatabase {
  /**
   * Фильтрация материалов по их типу. Для удобства доступно большое количество типов фильмов и сериалов. Необходимые типы указываются через запятую
   */
  types?: AllowArray<ReleaseType>;
  /**
   * Фильтрация материалов по году
   */
  year?: number;
  /**
   * 	Фильтрация материалов по типу перевода. Голосовой/Субтитры.
   */
  translation_type?: TranslationType;
  /**
   * Сортировка результатов. По названию жанра либо по количеству материалов с этим жанром.
   */
  sort?: 'title' | 'count';
}

export interface TranslationsResponseObject {
  title: string;
  count: number;
}

export interface TranslationsResponse {
  time: string;
  total: number;
  results: TranslationsResponseObject[];
}
