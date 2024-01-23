import axios from 'axios';

// parseLink types
export type KodikParsedLink = KodikParsedLinkParams & KodikParsedLinkExParams;

export interface KodikParsedLinkParams {
  type: string;
  id: string;
  hash: string;
  quality: string;
}

export interface KodikParsedLinkExParams {
  d?: string;
  d_sign?: string;
  pd?: string;
  pd_sign?: string;
  ref?: string;
  ref_sign?: string;
}

export interface KodikVideos {
  parsed?: KodikParsedLink;
  links: KodikVideoLinksType;
}
export type KodikVideoLinksType = Record<KodikVideoSourceQuality, KodikVideoSource[]>;
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

export const kodikPlayerLinkRegexp = /^(?<protocol>http[s]?:|)\/\/(?<host>[a-z0-9]+\.[a-z]+)\/(?<type>[a-z]+)\/(?<id>\d+)\/(?<hash>[0-9a-z]+)\/(?<quality>\d+p)$/;

export class VideoLinks {

  static async parseLink({extended: isExtended = false, link: kodikLink}: VideoLinksParseParams): Promise<KodikParsedLink> {
    if (!kodikLink) throw new ParseError('kodikLink is undefined');
    if (!kodikPlayerLinkRegexp.test(kodikLink)) throw new ParseError('kodikLink is not allowed');
    const linkParams = kodikPlayerLinkRegexp.exec(kodikLink)!;
    if (!linkParams.groups) throw new ParseError('cannot get \'groups\' from \'linkParams\'');
    linkParams.groups.protocol = linkParams.groups.protocol.length === 0 ? 'https:' : '';
    const parsedLink: KodikParsedLink = {
      hash: linkParams.groups.hash,
      id: linkParams.groups.id,
      quality: linkParams.groups.quality,
      type: linkParams.groups.type
    };

    if (isExtended) {
      try {
        const page = await axios.get<string>(`${linkParams.groups.protocol}${kodikLink}`, {
          headers: {
            'Origin': `https://${linkParams?.groups?.host ?? 'kodik.info'}`
          },
        });
        const pageMatchurlParams = page.data.match(/var\s+urlParams\s*=\s*'(?<urlParams>[^']+)';/);
        const urlParams = pageMatchurlParams?.groups?.urlParams;
        if (!urlParams) throw new ParseError('cannot get urlParams');
        const extendedFields = JSON.parse(urlParams) as KodikParsedLinkExParams;
        return {
          ...parsedLink,
          ...extendedFields
        };
      } catch (error) {
        throw new ParseError('unknown error');
      }
    }

    return parsedLink;
  }

  static async getLinks({extended: isExtended = false, link: kodikLink, videoInfoUrl = '/vdu'}: VideoLinksGetLinksParams): Promise<KodikVideos> {
    const kodikParsedLink = await VideoLinks.parseLink({
      link: kodikLink,
      extended: true
    });

    const videoInfoResponse = await axios.post(`https://${kodikParsedLink.d ?? 'kodik.info'}${videoInfoUrl}`, null, {
      params: kodikParsedLink,
      validateStatus: null
    });

    if (typeof videoInfoResponse.data !== 'object') throw new VideoLinksError('videoInfoResponse.data is not object');
    if (typeof videoInfoResponse.data.links !== 'object') throw new VideoLinksError('videoInfoResponse.data.links is not object');

    const kodikVideoLinks = videoInfoResponse.data.links as KodikVideoLinksType;
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
}
