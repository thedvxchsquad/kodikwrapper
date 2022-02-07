import axios from "axios";
import { ArrayAsObject } from "./utils";

export const isLink =
  /^(?:https?:)?\/\/(?:[a-z\.]+)\/([a-zA-Z]+)\/(\d+)\/([a-zA-Z0-9]+)\/(\d+)p$/;

interface ParsedLink {
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
interface Source {
  src: string;
  type: string;
}
interface VideoLinks {
  parsed?: ParsedLink;
  links: {
    [quality: string]: Source[]
  }
}

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
  if (!isLink.test(params.link)) throw new Error("link is not allowed");
  const [, type, id, hash, quality] = isLink.exec(params.link)!;
  let _params = {
    type,
    id,
    hash,
    quality,
  };
  if (params.extended == true) {
    const page = await axios.get<string>(
      `${params.host}/${_params.type}/${_params.id}/${_params.hash}/${_params.quality}p`
    );
    const matched = page.data.match(
      /iframe\.src = "\/\/(?:[a-z\.]+)\/go\/([a-zA-Z]+)\/(\d+)\/([a-zA-Z0-9]+)\/(\d+)p\?d=([a-zA-Z0-9\.]+)&d_sign=([a-z0-9]+)&pd=([a-zA-Z0-9\.]+)&pd_sign=([a-z0-9]+)&ref=&ref_sign=([a-z0-9]+).+";/
    );
    if (!matched) throw new ParseError("Не могу распарсить страницу");

    _params = {
      ..._params,
      ...ArrayAsObject({
        type: 1,
        id: 2,
        hash: 3,
        quality: 4,
        d: 5,
        d_sign: 6,
        pd: 7,
        pd_sign: 8,
        ref_sign: 9,
      })(matched),
      ref: "",
    };
  }
  return _params;
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

export async function getLinks(params: GetLinksParams): Promise<VideoLinks> {
  
  params.extended = params.extended || false;
  params.host = "host" in params ? params.host : "https://kodik.cc"
  
  const parsedLink = await parseLink({
    ...params,
    extended: true
  });
  const postresponse = await axios.post(`${params.host}/gvi`, null, {
    params: parsedLink
  });

  for (const key of Object.keys(postresponse.data.links)) {
    postresponse.data.links[key].map(
      (video: { src: string }) => (
        (video.src = Buffer.from(
          video.src.split("").reverse().join(""),
          "base64"
        ).toString("utf-8")),
        video
      )
    );
  }

  return {
    ...(params.extended && {
      params: parsedLink
    }),
    links: postresponse.data.links,
  };
}
