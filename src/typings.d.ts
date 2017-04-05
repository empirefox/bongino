/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

declare interface Dict<T> {
    [key: string]: T;
    [key: number]: T;
}

declare module 'timeago.js' {
  export default class Timeago {
    constructor(nowDate: string, defaultLocale: string);
    format(value: Date | number, locale?: string): string;
  }
}