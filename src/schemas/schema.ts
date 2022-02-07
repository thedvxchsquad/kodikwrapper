import { CountriesParams, CountriesResponse } from "./countries";
import { GenresParams, GenresResponse } from "./genres";
import { ListParams, ListResponse } from "./list";
import { QualitiesParams, QualitiesResponse } from "./qualities";
import { SearchParams, SearchResponse } from "./search";
import { TranslationsParams, TranslationsResponse } from "./translations";

export interface APIMethods {
    countries(params: CountriesParams): Promise<CountriesResponse>;
    genres(params: GenresParams): Promise<GenresResponse>;
    list(params: ListParams): Promise<ListResponse>;
    qualities(params: QualitiesParams): Promise<QualitiesResponse>;
    search(params: SearchParams): Promise<SearchResponse>;
    translations(params: TranslationsParams): Promise<TranslationsResponse>;
    years(params: ListParams): Promise<ListParams>;
}