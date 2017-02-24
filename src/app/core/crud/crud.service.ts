import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RetryHttp } from '../user';
import { Cache, FeathersService } from '../cache';

export interface CrudApis {
  cache: string;
  find: string;
  save: string;
  get: (id: any) => string;
  delete: (id: any) => string;
}

@Injectable()
export class CrudService {
  constructor(
    public http: RetryHttp,
    public feathersService: FeathersService) { }
}

export abstract class Crud<T> {
  http: RetryHttp;

  private cache$: Observable<Cache<T>>;
  private cache: Cache<T>;

  constructor(
    crudService: CrudService,
    private apis: CrudApis) {
    this.http = crudService.http;
    this.cache = crudService.feathersService.get(this.apis.cache);
  }

  // If first time to exec, fetch remote items to build one. It does NOT SEARCH!
  find(q?: any): Observable<T[]> {
    if (!this.cache$) {
      this.cache$ = this.http.get(this.apis.find)
        .mergeMap(res => this.cache.create<T[]>(res.json() || []).map(_ => this.cache))
        .publishReplay(1).refCount();
    }
    return this.cache$.mergeMap(cache => cache.find(q));
  }

  // Save to remote and cache.
  save(t: T): Observable<T> {
    return this.http.post(this.apis.save, JSON.stringify(t)).mergeMap(res => this.addToCache(res.json()));
  }

  // Find from cache first, then from remote, then save to cache.
  get(id: number): Observable<T> {
    return this.cache.get(id).mergeMap(t => {
      if (t) {
        return Observable.of(t);
      }
      return this.http.get(this.apis.get(id)).mergeMap(res => this.addToCache(res.json()));
    });
  }

  // Delete from remote and cache.
  delete(id: number): Observable<any> {
    return this.http.delete(this.apis.delete(id)).mergeMap(res => this.cache.remove(id));
  }

  addToCache(t: T): Observable<T> {
    return this.cache.create(t);
  }

  updateCache(id: number, t: T): Observable<T> {
    return this.cache.update(id, t);
  }

}
