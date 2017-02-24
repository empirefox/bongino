import { Observable } from 'rxjs/Observable';

export class Cache<T>{
  constructor(private cache: any) { }

  create<T>(t: T): Observable<T> {
    return Observable.fromPromise(this.cache.create(t));
  }

  find(q?: any): Observable<T[]> {
    return this.cache.find(q);
  }

  get(id: any): Observable<T> {
    return this.cache.get(id);
  }

  remove(id: any): Observable<any> {
    return Observable.fromPromise(this.cache.remove(id).cache(_ => 1));
  }

  update(id: any, data: T): Observable<T> {
    return Observable.fromPromise(this.cache.update(id, data));
  }
}
