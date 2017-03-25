import { Component, ViewContainerRef, OnInit } from '@angular/core';
import { Overlay } from 'angular2-modal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor(
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef) {
    overlay.defaultViewContainer = viewContainerRef;
  }

  public ngOnInit() {
    // TODO
  }

}
