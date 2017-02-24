import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Cashes, Frozen, Rebates, Points } from './money';
import { MoneyService } from './money.service';

@Injectable()
export class CashesResolver implements Resolve<Cashes> {
  constructor(
    private router: Router,
    private moneyService: MoneyService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Cashes> {
    return this.moneyService.getCashes();
  }
}

@Injectable()
export class FrozenResolver implements Resolve<Frozen> {
  constructor(
    private router: Router,
    private moneyService: MoneyService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Frozen> {
    return this.moneyService.getFrozen();
  }
}

@Injectable()
export class RebatesResolver implements Resolve<Rebates> {
  constructor(
    private router: Router,
    private moneyService: MoneyService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Rebates> {
    return this.moneyService.getRebates();
  }
}

@Injectable()
export class PointsResolver implements Resolve<Points> {
  constructor(
    private router: Router,
    private moneyService: MoneyService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Points> {
    return this.moneyService.getPoints();
  }
}
