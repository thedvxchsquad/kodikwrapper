import type {
  FilterByExternalDatabase, KodikResponse, SharedFields,
} from './shared-types';

export type GenresType =
  | 'kinopoisk'
  | 'shikimori'
  | 'mydramalist'
  | 'all';

export interface GenresParams extends FilterByExternalDatabase, SharedFields {
  genres_type?: GenresType;
}

export interface GenresResponseObject {
  title: string;
  count: number;
}

export type GenresResponse = KodikResponse<GenresResponseObject[]>;
