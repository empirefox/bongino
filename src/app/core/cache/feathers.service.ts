import { Injectable } from '@angular/core';
import * as RxJS from 'rxjs';

import { Cache } from './cache';

const feathers = require('feathers');
const memory = require('feathers-memory');
const rx = require('feathers-reactive');

export interface FeathersFindConfig {
  paginate?: {
    default?: number;
    max?: number;
  } | boolean;
}

export interface FeathersData<T> {
  total: number;
  limit: number;
  skip: number;
  data: T[];
}

@Injectable()
export class FeathersService {
  private caches: { [key: string]: Cache<any> } = {};

  private app: any = feathers().configure(rx(RxJS));

  getSites() { return this.get('sites'); }
  getResource() { return this.get('resources'); }

  get<T>(name: string): Cache<T> {
    if (!(name in this.caches)) {
      this.caches[name] = this.newCache<T>(name);
    }
    return this.caches[name];
  }

  newCache<T>(name: string, config?: FeathersFindConfig) {
    return new Cache<T>(this.app.use(`/${name}`, memory(config)).service(name));
  }

  // newFind(cache: any, q?: any) {
  //   let query$ = new RxJS.BehaviorSubject(q);
  //   let data$ = query$.mergeMap(query => cache.find({ query }));
  //   return { query$, data$ };
  // }
}

// let fs = new FeathersService();
// let sites = fs.getSites();
// let {query$, data$} = fs.newFind(sites);

// data$.subscribe(data => console.log('Data is', data));
// sites.create([])
// sites.create([
//   { id: 1, m: 3 },
//   { id: 5 },
// ]).then(() => {
//   sites.update(1, { n: 2 }).then(() => {
//     query$.next({ $skip: 0 });
//     sites.create([
//       { id: 7 },
//       { id: 3 },
//       { id: 6 },
//     ]).then(() => {
//       query$.next({ $skip: 1 });
//     })
//   })
// })
