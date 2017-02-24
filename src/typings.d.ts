// Typings reference file, see links for more information
// https://github.com/typings/typings
// https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html

///<reference path="../node_modules/firebase/firebase.d.ts"/>

declare var System: any;

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
