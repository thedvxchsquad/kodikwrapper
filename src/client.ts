import { stringify as StringifyQuery } from "qs";
import axios, { AxiosInstance } from "axios";
import {
  APIMethods
} from "./schemas";
// import { Agent, globalAgent } from "https";

export interface ClientOptions {
  token: string;
  // agent?: Agent;
  kodikApiUrl?: string;
}

const KODIK_API_URL = "https://kodikapi.com";
const endpoints = ["countries", "genres", "list", "qualities", "search", "translations", "years"];

export class ClientError extends Error {
  name: string = "ClientError";
}

export class Client {
  private axios: AxiosInstance;
  // private agent: Agent;
  public KODIK_API_URL: string;
  constructor(options: ClientOptions) {
    // this.agent = options.agent || globalAgent;
    this.KODIK_API_URL = options.kodikApiUrl || KODIK_API_URL
    this.axios = axios.create({
      params: {
        token: options.token,
      },
      // httpAgent: this.agent,
      // httpsAgent: this.agent,
      validateStatus: (_) => true,
      paramsSerializer: (params) => {
        return StringifyQuery(params, { arrayFormat: "comma" });
      },
    });

    for (const endpoint of endpoints) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this[endpoint] = (params: any) => {
        return this.axios.get(`${this.KODIK_API_URL}/${endpoint}`, {
          params
        }).then(
          res => {
            if("error" in res.data) throw new ClientError(res.data.error)
            return res.data
          }
        )
      }
    }

  }
}

export interface Client extends APIMethods {}