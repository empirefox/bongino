import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { api } from '../config';
import { IPackage } from './package';

@Injectable()
export class PackageService {

  private packages: Observable<IPackage[]> = null;

  constructor(private http: Http) { }

  clearCache() { this.packages = null; }

  getItems(): Observable<IPackage[]> {
    if (!this.packages) {
      this.packages = this.http.get(api.GetPackages).map(res => res.json() || []).publishReplay(1).refCount();
    }
    return this.packages;
  }

}
