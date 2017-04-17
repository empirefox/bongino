import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { IPackage } from './package';
import { PackageService } from './package.service';

@Injectable()
export class PackageResolver implements Resolve<IPackage[]> {

  constructor(private packageService: PackageService) { }

  resolve(): Observable<IPackage[]> {
    return this.packageService.getItems();
  }

}
