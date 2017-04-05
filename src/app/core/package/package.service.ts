import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { api } from '../config';
import { IPackage } from './package';

@Injectable()
export class PackageService {

  private products: Observable<IPackage[]> = null;

  constructor(private http: Http) { }

  clearCache() { this.products = null; }

  getPackages(): Observable<IPackage[]> {
    if (!this.products) {
      this.products = this.http.get(api.GetProducts).map(res => res.json() || []).publishReplay(1).refCount();
    }
    return this.products;
  }

}
