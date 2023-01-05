import * as KodikWrapper from './index';

if (typeof window !== 'undefined') {
  // @ts-ignore
  window.KodikWrapper = KodikWrapper;
}