import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IPackage, PackageService } from '../../../core';

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.css']
})
export class PackageComponent implements OnInit {

  num = 1;
  nums = [1, 2, 5, 10];
  items: IPackage[];

  constructor(
    private router: Router,
    private packageService: PackageService, ) { }

  ngOnInit() {
    this.packageService.getPackages().subscribe(items => this.items = items);
  }

  gotoBuy(item: IPackage, num: number) {
    // TODO
    console.log('buy', item, num)
  }

  gotoContact() {
    this.router.navigateByUrl('/contact');
  }

}
