import { Injectable }   from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { IOrder } from './order';
import { OrderService } from './order.service';

@Injectable()
export class OrderResolver implements Resolve<IOrder> {

  constructor(
    private router: Router,
    private orderService: OrderService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<IOrder | boolean> {
    let id = +route.params['id'];
    return this.orderService.getOrder(id).map(order => {
      if (!order) {
        this.router.navigateByUrl('/order');
      }
      return order;
    });
  }

}
