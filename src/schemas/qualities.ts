import {
  FilterByAnotherDatabase
} from "./types";

export interface QualitiesParams extends FilterByAnotherDatabase {}

export interface QualitiesResponseObject {
  title: string;
  count: number;
}

export type QualitiesResponse = QualitiesResponseObject[]