import { Injectable } from '@angular/core';
import { Request, RequestOptionsArgs, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthHttp } from 'angular2-jwt';

import { TokenService } from './token.service';

@Injectable()
export class RetryHttp {

  constructor(
    private http: AuthHttp,
    private tokenService: TokenService) { }

  public get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.http.get(url, options).catch((error) =>
      error.status === 401 ?
        this.tokenService.mustUpdateToken().flatMap((data: any) => this.get(url, options)) :
        Observable.throw(error));
  }

  public post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.http.post(url, body, options).catch((error) =>
      error.status === 401 ?
        this.tokenService.mustUpdateToken().flatMap((data: any) => this.post(url, body, options)) :
        Observable.throw(error));
  }

  public put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.http.put(url, body, options).catch((error) =>
      error.status === 401 ?
        this.tokenService.mustUpdateToken().flatMap((data: any) => this.put(url, body, options)) :
        Observable.throw(error));
  }

  public delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.http.delete(url, options).catch((error) =>
      error.status === 401 ?
        this.tokenService.mustUpdateToken().flatMap((data: any) => this.delete(url, options)) :
        Observable.throw(error));
  }

  public patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.http.patch(url, body, options).catch((error) =>
      error.status === 401 ?
        this.tokenService.mustUpdateToken().flatMap((data: any) => this.patch(url, body, options)) :
        Observable.throw(error));
  }

  public head(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.http.head(url, options).catch((error) =>
      error.status === 401 ?
        this.tokenService.mustUpdateToken().flatMap((data: any) => this.head(url, options)) :
        Observable.throw(error));
  }

  public options(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.http.options(url, options);
  }

  public request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return this.http.request(url, options).catch((error) =>
      error.status === 401 ?
        this.tokenService.mustUpdateToken().flatMap((data: any) => this.request(url, options)) :
        Observable.throw(error));
  }

}
