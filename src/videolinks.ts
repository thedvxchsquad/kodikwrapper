import axios from "axios";

export const linkPlayerRegex = /^(?<protocol>http[s]?:|)\/\/(?<host>[a-z0-9]+\.[a-z]+)\/(?<type>video|seria|season)\/(?<id>\d+)\/(?<hash>[0-9a-z]+)\/(?<quality>\d+p)$/;

export interface ParsedLink {
  type: string;
  id: string;
  hash: string;
  quality: string;
  d?: string;
  d_sign?: string;
  pd?: string;
  pd_sign?: string;
  ref?: string;
  ref_sign?: string;
}
export interface Source {
  src: string;
  type: string;
}
export type VideoLinksTypes = Record<
  "links",
  Record<
    "720" | "480" | "360" | "240" | string,
    Source[]
  >
>
export type VideoLinksParsed = {
  parsed?: ParsedLink;
} & VideoLinksTypes;

export class ParseError extends Error {
  name: string = "ParseError";
}

export interface ParseLinkParams {
  /**
   * Ссылка на плеер
   */
  link: string;
  /**
   * Отправляет запрос на ссылку и получает дополнительную информацию
   */
  extended?: boolean;
  /**
   * Иной хост от kodik(на случай если что-то не так с kodik.cc)
   */
  host?: string;
}

export async function parseLink(
  params: ParseLinkParams
): Promise<ParsedLink> {

  params.extended = params.extended || false;
  params.host = "host" in params ? params.host : "https://kodik.cc"

  if (!params.link) throw new ParseError("link is undefined");
  if (!linkPlayerRegex.test(params.link)) throw new Error("link is not allowed");
  const data: ParsedLink = {
    hash: "",
    id: "",
    quality: "",
    type: ""
  };
  const linkParams = linkPlayerRegex.exec(params.link)!;
  if (!linkParams.groups) throw new Error(`cannot get "groups" from "linkParams"`);
  Object.assign(data, linkParams.groups);
  if (params.extended) {
    try {
      const page = await axios.get<string>(`${linkParams.groups.protocol.length === 0 ? "https:" : ""}${params.link}`);
      const pageMatch = page.data.match(/iframe\.src\s*=\s*"(?<url>[^"]+)";/);
      if (!pageMatch?.groups?.url) throw "ывзаыхвахывха че за";
      const extFields = new URL("https:" + pageMatch.groups.url);
      const obj = Array.from(extFields.searchParams).reduce((p, [k, v]) => (p[k] = v, p), {} as Record<string, string>);
      return { ...data, ...obj };
    } catch (error) {
      throw new ParseError("cannot get extended fields")
    };
  };
  return data;
}

export interface GetLinksParams {
  /**
   * Ссылка на плеер
   */
  link: string;
  /**
   * Добавляет поле params
   */
  extended?: boolean;
  /**
   * Иной хост от kodik(на случай если что-то не так с kodik.cc)
   */
  host?: string;
}

export async function getLinks(params: GetLinksParams): Promise<VideoLinksParsed> {

  params.extended = params.extended || false;
  params.host = "host" in params ? params.host : "https://kodik.cc"

  const parsedLink = await parseLink({
    ...params,
    extended: true
  });
  const rawVideoLinksResponse = await axios.post<VideoLinksTypes>("https://aniqit.com/gvi", null, {
    params: parsedLink
  });
  const videoLinks = Object
    .entries(rawVideoLinksResponse.data.links)
    .reduce(
      (response, qualityVariant) => (
        response[qualityVariant[0]] = qualityVariant[1]
          .map(
            sourceVariant => (
              {
                ...sourceVariant,
                src: Buffer.from(sourceVariant.src.split("").reverse().join(""), "base64").toString()
              }
            )
          ),
        response), {} as VideoLinksTypes["links"]);
  return {
    links: videoLinks,
    ...(params.extended ? { params } : {})
  }
}
