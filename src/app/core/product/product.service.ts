import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { api } from '../config';
import { IProduct } from './product';

@Injectable()
export class ProductService {

  private products: Observable<IProduct[]> = null;

  constructor(private http: Http) { }

  clearCache() { this.products = null; }

  getProducts(): Observable<IProduct[]> {
    if (!this.products) {
      this.products = this.http.get(api.GetProducts).map(res => res.json() || []).publishReplay(1).refCount();
    }
    return this.products;
  }

}
