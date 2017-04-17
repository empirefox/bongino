import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.css']
})
export class QrComponent implements OnInit {
  qr: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    const data = <{ qr: string }>this.route.snapshot.data;
    this.qr = data.qr;
  }

}
