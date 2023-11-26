import axios from 'axios';

// parseLink types
export type KodikParsedLink = KodikParsedLinkParams & KodikParsedLinkExParams;

interface KodikParsedLinkParams {
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
  /**
   * Ссылка на плеер
   */
  link: string;
  /**
   * Отправляет запрос на ссылку и получает дополнительную информацию
   */
  extended?: boolean;
}

export interface VideoLinksGetLinksParams {
  /**
   * Ссылка на плеер
   */
  link: string;
  /**
   * Добавляет поле params
   */
  extended?: boolean;
}

export class VideoLinks {
  static kodikPlayerLinkRegexp = /^(?<protocol>http[s]?:|)\/\/(?<host>[a-z0-9]+\.[a-z]+)\/(?<type>[a-z]+)\/(?<id>\d+)\/(?<hash>[0-9a-z]+)\/(?<quality>\d+p)$/;

  static async parseLink(opts: VideoLinksParseParams): Promise<KodikParsedLink> {
    const isExtended = opts.extended ?? false;
    const kodikLink = opts.link;

    if (!kodikLink) throw new ParseError('kodikLink is undefined');
    if (!this.kodikPlayerLinkRegexp.test(kodikLink)) throw new ParseError('kodikLink is not allowed');
    const parsedLink: KodikParsedLink = {
      hash: '',
      id: '',
      quality: '',
      type: ''
    };
    const linkParams = this.kodikPlayerLinkRegexp.exec(kodikLink)!;
    if (!linkParams.groups) throw new ParseError('cannot get \'groups\' from \'linkParams\'');
    linkParams.groups.protocol = linkParams.groups.protocol.length === 0 ? 'https:' : '';
    Object.assign(parsedLink, linkParams.groups);
    if (isExtended) {
      try {
        const page = await axios.get<string>(`${linkParams.groups.protocol}${kodikLink}`, {
          headers: {
            'Origin': `https://${linkParams?.groups?.host ?? 'kodik.info'}`
          }
        });
        const pageMatchurlParams = page.data.match(/var\s+urlParams\s*=\s*'(?<urlParams>[^']+)';/);
        const urlParams = pageMatchurlParams?.groups?.urlParams;
        if (!urlParams) throw new ParseError('cannot get urlParams');
        const extendedFields = JSON.parse(urlParams) as KodikParsedLinkExParams;
        return Object.assign(parsedLink, extendedFields);
      } catch (error) {
        // console.error(error)
        throw new ParseError('unknown error');
      }

    }

    return parsedLink;
  }

  static async getLinks(opts: VideoLinksGetLinksParams): Promise<KodikVideos> {
    const isExtended = opts.extended ?? false;
    const kodikLink = opts.link;

    const kodikParsedLink = await VideoLinks.parseLink({
      link: kodikLink,
      extended: true
    });
    const kodikVideoLinks = await axios.post(`https://${kodikParsedLink.d}/gvi`, null, {
      params: kodikParsedLink,
      validateStatus: null
    }).then(res => res.data.links as KodikVideoLinksType);
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
