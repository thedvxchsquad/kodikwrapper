import axios from 'axios';

export interface KodikParsedLink {
  type: string;
  id: string;
  hash: string;
  quality: string;
  ex?: KodikParsedLinkEx;
}

export interface KodikParsedLinkEx {
  urlParams: KodikParsedLinkExUrlParams;
  translation: KodikParsedLinkExTranslation;
  skipButtons?: KodikParsedLinkExSkipButtons;
}

export interface KodikParsedLinkExUrlParams {
  d: string;
  d_sign: string;
  pd: string;
  pd_sign: string;
  ref: string;
  ref_sign: string;
  translations: boolean;
  advert_debug: boolean;
  min_age: number;
  first_url: boolean;
}

export interface KodikParsedLinkExTranslation {
  id: number;
  title: string;
}

export interface KodikParsedLinkExSkipButtons {
  type: string;
  data: string;
}

export interface KodikVideos {
  parsed?: KodikParsedLink;
  links: KodikVideoLinks;
}
export type KodikVideoLinks = Record<KodikVideoSourceQuality, KodikVideoSource[]>;
export type KodikVideoSourceQuality = '1080' | '720' | '480' | '360' | '240' | string;

export interface KodikVideoSource {
  src: string;
  type: string;
}

export class ParseError extends Error {
  name: string = 'ParseError';
}

export class VideoLinksError extends Error {
  name: string = 'VideoLinksError';
}

export interface VideoLinksParseParams {
  link: string;
  extended?: boolean;
}

export interface VideoLinksGetLinksParams {
  link: string;
  extended?: boolean;
  videoInfoUrl?: string
}

export const kodikPlayerLinkRegexp = /^(?<protocol>http[s]?:|)\/\/(?<host>[a-z0-9]+\.[a-z]+)\/(?<type>[a-z]+)\/(?<id>\d+)\/(?<hash>[0-9a-z]+)\/(?<quality>\d+p)(?:.*)$/;

export class VideoLinks {
  static async parseLink({extended: isExtended = false, link: kodikLink}: VideoLinksParseParams): Promise<KodikParsedLink> {
    if (!kodikLink) throw new ParseError('kodikLink is undefined');
    if (!kodikPlayerLinkRegexp.test(kodikLink)) throw new ParseError('kodikLink is not allowed');

    const linkParams = kodikPlayerLinkRegexp.exec(kodikLink)?.groups;
    if (!linkParams) throw new ParseError('cannot get \'groups\' from \'linkParams\'');
    const {hash, id, quality, type} = linkParams;

    const parsedLink: KodikParsedLink = {hash, id, quality, type};

    if (isExtended) {
      try {
        const page = await axios.get<string>(`${linkParams.protocol.length === 0 ? 'https:' : ''}${kodikLink}`);

        const urlParams = page.data.match(/var\s+urlParams\s*=\s*'(?<urlParams>[^']+)';/)?.groups?.urlParams;
        const translation = page.data.match(/var\s+translationId\s*=\s*(?<id>\d+);\s*var\s+translationTitle\s*=\s*"(?<title>[^"]+)";/is)?.groups;
        const skipButtons = page.data.match(/parseSkipButtons?\("(?<data>[^"]+)"\s*,\s*"(?<type>[^"]+)"\)/is)?.groups;

        if (!urlParams) throw new ParseError('cannot get urlParams');
        if (!translation) throw new ParseError('cannot get translation');

        parsedLink.ex = {
          urlParams: JSON.parse(urlParams) as KodikParsedLinkExUrlParams,
          translation: {
            id: +translation.id,
            title: translation.title
          },
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          skipButtons,
        };

        return parsedLink;
      } catch (error) {
        throw new ParseError('unknown error', {
          cause: error
        });
      }
    }

    return parsedLink;
  }

  static async getLinks({extended: isExtended = false, link: kodikLink, videoInfoUrl = '/kor'}: VideoLinksGetLinksParams): Promise<KodikVideos> {
    const kodikParsedLink = await VideoLinks.parseLink({
      link: kodikLink,
      extended: true
    });

    const videoInfoResponse = await axios.post(`https://${kodikParsedLink.ex?.urlParams.d ?? 'kodik.info'}${videoInfoUrl}`, null, {
      params: {
        hash: kodikParsedLink.hash,
        id: kodikParsedLink.id,
        type: kodikParsedLink.type,
        ...kodikParsedLink.ex!.urlParams
      },
      validateStatus: null
    });

    if (typeof videoInfoResponse.data !== 'object') throw new VideoLinksError('videoInfoResponse.data is not object');
    if (typeof videoInfoResponse.data.links !== 'object') throw new VideoLinksError('videoInfoResponse.data.links is not object');

    const kodikVideoLinks = videoInfoResponse.data.links as KodikVideoLinks;
    const zCharCode = 'Z'.charCodeAt(0);

    for (const [, sources] of Object.entries(kodikVideoLinks)) {
      for (const source of sources) {
        source.src = Buffer.from(source.src.replace(/[a-zA-Z]/g, e => {
          let eCharCode = e.charCodeAt(0);
          return String.fromCharCode((eCharCode <= zCharCode ? 90 : 122) >= (eCharCode = eCharCode + 13) ? eCharCode : eCharCode - 26);
        }), 'base64').toString('utf8');
      }
    }

    const kodikVideos: KodikVideos = {links: kodikVideoLinks};
    if (isExtended) kodikVideos.parsed = kodikParsedLink;

    return kodikVideos;
  }

  static parseSkipButtons = (skipButtons: KodikParsedLinkExSkipButtons) =>
    skipButtons.data.split(',').map((timeline) => {
      const [from, to] = timeline.split('-');
      return {from, to};
    });
}
