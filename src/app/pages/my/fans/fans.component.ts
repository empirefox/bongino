import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { config, FansResolver, IFan } from '../../../core';

@Component({
  selector: 'app-fans',
  templateUrl: './fans.component.html',
  styleUrls: ['./fans.component.css']
})
export class FansComponent implements OnInit {
  config = config;
  fans: IFan[];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    const data = <{ fans: IFan[] }>this.route.snapshot.data;
    this.fans = data.fans;
  }

}
