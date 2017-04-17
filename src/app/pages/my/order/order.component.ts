import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';

import { TableColumn } from '@swimlane/ngx-datatable/src/types/table-column.type';
import { IOrder, OrderService, OrderStatePipe, trans } from '../../../core';
import { MoneyPipe } from '../../../pipes';

const tr = trans.Order;

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit, OnDestroy {
  @ViewChild('actionTmpl') actionTmpl: TemplateRef<any>;

  items: IOrder[];
  columns: TableColumn[];

  private osub: any;

  constructor(
    private orderStatePipe: OrderStatePipe,
    private moneyPipe: MoneyPipe,
    private orderService: OrderService) { }

  ngOnInit() {
    this.columns = [
      { prop: 'State', name: tr.State, pipe: this.orderStatePipe },
      { prop: 'Name', name: tr.Name },
      { prop: 'Price', name: tr.Price, pipe: this.moneyPipe },
      { prop: 'Quantity', name: tr.Quantity },
      { prop: 'Unit', name: tr.Unit },
      { prop: 'PayAmount', name: tr.PayAmount, pipe: this.moneyPipe },
      { prop: 'Remark', name: tr.Remark },
      { name: '操作', cellTemplate: this.actionTmpl },
    ];
    this.orderService.getOrders().subscribe(items => this.items = items);
  }

  ngOnDestroy() {
    this.osub.unsubscribe();
  }

}
