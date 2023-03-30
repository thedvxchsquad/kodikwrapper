import { expect } from 'chai';
import { VideoLinks } from '../src/videolinks';

describe("parse.ts", () => {
  it("Parse link correctly", async () => {
    const parsedLink = await VideoLinks.parseLink({ link: '//kodik.cc/video/87051/57c572172a2ccfb23234cdaf7174b20d/720p', extended: true });
    expect(parsedLink.type).string('video', 'param type');
    expect(parsedLink.quality).string('720', 'param quality');
    expect(parsedLink.id).string('87051', 'param id');
    expect(parsedLink.hash).string('57c572172a2ccfb23234cdaf7174b20d', 'param hash');
  })
})