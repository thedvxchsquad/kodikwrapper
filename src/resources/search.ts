import type {AllowArray} from '../types';
import type {
  BlockedSeasonsObject,
  FilterByExternalDatabase, MaterialData, MaterialType, SeasonsObject, TranslationType,
} from './shared-types';
import {KodikResponseWithPagination} from './shared-types';
import {TranslationV1Object} from './translations';

export interface SearchParams extends FilterByExternalDatabase {
  title?: string;
  title_orig?: string;
  strict?: boolean;
  full_match?: boolean;
  id?: string;
  player_link?: string;
  kinopoisk_id?: number;
  imdb_id?: string;
  mdl_id?: string;
  worldart_animation_id?: number;
  worldart_cinema_id?: number;
  worldart_link?: string;
  shikimori_id?: number;
  prioritize_translations?: AllowArray<TranslationType | string | number>;
  unprioritize_translations?: AllowArray<TranslationType | string | number>;
  prioritize_translation_type?: TranslationType;
  camrip?: boolean;
  with_seasons?: boolean;
  season?: number;
  with_episodes?: boolean;
  with_episodes_data?: boolean;
  episode?: number;
  with_page_links?: boolean;
  not_blocked_in?: AllowArray<string>;
  not_blocked_for_me?: boolean;
  with_material_data?: boolean;
}

export interface SearchResultObject {
  id: number;
  title: string;
  title_orig: string;
  other_title: string;
  link: string;
  year: number;
  kinopoisk_id: string | number;
  imdb_id: string | number;
  mdl_id: string | number;
  worldart_link: string;
  shikimori_id: number;
  type: MaterialType;
  quality: string;
  caprip: boolean;
  lgbt: boolean;
  translation: TranslationV1Object;
  created_at: string;
  updated_at: string;
  blocked_countries: string[];
  seasons?: SeasonsObject;
  last_season?: number;
  last_episode?: number;
  episodes_count?: number;
  blocked_seasons: BlockedSeasonsObject | 'all';
  screenshots: string[];
  material_data: MaterialData;
}

export type SearchResponse = KodikResponseWithPagination<SearchResultObject[]>;
