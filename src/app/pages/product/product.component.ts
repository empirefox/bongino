import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IProduct, ProductService } from '../../core';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  num = 1;
  nums = [1, 2, 5, 10];
  items: IProduct[];

  constructor(
    private router: Router,
    private productService: ProductService, ) { }

  ngOnInit() {
    this.productService.getProducts().subscribe(items => this.items = items);
  }

  gotoBuy(item: IProduct, num: number) {
    // TODO
    console.log('buy', item, num)
  }

  gotoContact() {
    this.router.navigateByUrl('/contact');
  }

}
