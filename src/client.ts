import {stringify as StringifyQuery} from 'qs';
import axios, {AxiosInstance} from 'axios';
import {
  APIMethods
} from './schema';

export interface ClientOptions {
  token: string;
  kodikApiUrl?: string;
}

const KODIK_API_URL = 'https://kodikapi.com';
const endpoints: Record<string, string> = {
  ...(['countries', 'genres', 'list', 'qualities', 'search', 'translations', 'years'])
    .reduce(
      (p, v) => (p[v] = v, p),
      <Record<string, string>>{}
    ),
  qualitiesV2: 'qualities/v2',
  translationsV2: 'translations/v2',
};

export class ClientError extends Error {
  name: string = 'ClientError';
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class Client {
  private axios: AxiosInstance;
  // private agent: Agent;
  public KODIK_API_URL: string;

  constructor(options: ClientOptions) {
    // this.agent = options.agent || globalAgent;
    this.KODIK_API_URL = options.kodikApiUrl || KODIK_API_URL;
    this.axios = axios.create({
      params: {
        token: options.token,
      },
      validateStatus: null,
      paramsSerializer: (params) => {
        return StringifyQuery(params, {arrayFormat: 'comma'});
      },
    });

    for (const endpointKey of Object.keys(endpoints)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this[endpointKey] = (params: Record<string, string>) =>
        this.axios.post(`${this.KODIK_API_URL}/${endpoints[endpointKey]}`, new URLSearchParams(params))
          .then(
            res => {
              if ('error' in res.data) throw new ClientError(res.data.error);
              return res.data;
            }
          );
    }

  }
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface Client extends APIMethods {
}
